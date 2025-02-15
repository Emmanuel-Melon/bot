import fs from 'fs';
import path from 'path';

interface ErrorLog {
  message: string;
  stack: string[];
  nodeVersion: string;
}

interface WorkflowInfo {
  name: string;
  status: string;
  runId: string;
  trigger: string;
  deploymentUrl: string;
}

interface DeploymentStatus {
  isSuccess: boolean;
  healthCheckStatus: string;
  testOutput?: string;
  workflowInfo: WorkflowInfo;
}

class LogParser {
  private parseErrorLog(log: string): ErrorLog {
    const lines = log.split('\n').filter(line => line.trim());
    const errorLog: ErrorLog = {
      message: '',
      stack: [],
      nodeVersion: ''
    };

    let isStackTrace = false;

    for (const line of lines) {
      if (line.startsWith('Error:')) {
        errorLog.message = line.substring('Error:'.length).trim();
        isStackTrace = true;
        continue;
      }

      if (line.startsWith('Node.js v')) {
        errorLog.nodeVersion = line.trim();
        isStackTrace = false;
        continue;
      }

      if (isStackTrace && line.trim()) {
        errorLog.stack.push(line.trim());
      }
    }

    return errorLog;
  }

  private generateRecommendations(errorLog: ErrorLog): string[] {
    const recommendations: string[] = [];

    if (errorLog.message.includes("Unknown option '--ts'")) {
      recommendations.push("- Update the test command in package.json to use the correct tap configuration");
      recommendations.push("- Consider using `tap --node-arg=--loader=ts-node/esm` for TypeScript tests");
      recommendations.push("- Ensure @types/tap and ts-node are installed as devDependencies");
    }

    return recommendations;
  }

  public formatErrorReport(logContent: string): string {
    const errorLog = this.parseErrorLog(logContent);
    const recommendations = this.generateRecommendations(errorLog);

    return `
🔍 Test Execution Report
════════════════════════
📅 Generated at: ${new Date().toISOString()}

❌ Error Details
──────────────────
🚫 Error Message:
${errorLog.message}

📚 Stack Trace:
${errorLog.stack.join('\n')}

🔧 Environment:
${errorLog.nodeVersion}

💡 Recommendations:
${recommendations.length > 0 
  ? recommendations.join('\n')
  : "No specific recommendations available for this error."}
`;
  }

  public formatDeploymentMessage(status: DeploymentStatus): string {
    const { isSuccess, healthCheckStatus, testOutput, workflowInfo } = status;
    const statusEmoji = isSuccess ? '🚀' : '❌';
    const statusTitle = isSuccess ? 'Deployment Successful!' : 'Deployment Failed';

    return `${statusEmoji} ${statusTitle}
━━━━━━━━━━━━━━━━━━━━━━━
🏥 Health Check: ${healthCheckStatus}
📅 Time: ${new Date().toISOString()}
🔄 Workflow: ${workflowInfo.name}
🎯 Trigger: ${workflowInfo.trigger}
🆔 Run ID: ${workflowInfo.runId}
🌐 URL: ${workflowInfo.deploymentUrl}

${!isSuccess ? '❌ Deployment failed. Please check the GitHub Actions logs for more details.' : ''}
${testOutput ? `\n📋 Test Output:\n\`\`\`\n${testOutput}\`\`\`` : ''}`;
  }

  public formatErrorMessage(error: Error, workflowInfo: WorkflowInfo): string {
    const formattedReport = this.formatErrorReport(error.message);
    
    return `❌ Error in Post-Deployment Check
━━━━━━━━━━━━━━━━━━━━
⚠️ Error Details:
\`\`\`
${formattedReport}
\`\`\`
📅 Time: ${new Date().toISOString()}
🔄 Workflow: ${workflowInfo.name}
🆔 Run ID: ${workflowInfo.runId}`;
  }
}

// Export the class and also handle direct execution
export const logParser = new LogParser();

if (require.main === module) {
  let logContent = '';
  if (process.stdin.isTTY) {
    console.error('Error: No log input provided. Please pipe log content to this script.');
    process.exit(1);
  } else {
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => {
      logContent += chunk;
    });
    process.stdin.on('end', () => {
      console.log(logParser.formatErrorReport(logContent));
    });
  }
}
