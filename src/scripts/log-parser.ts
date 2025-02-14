import fs from 'fs';
import path from 'path';

interface ErrorLog {
  message: string;
  stack: string[];
  nodeVersion: string;
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

      if (isStackTrace && line.includes('at ')) {
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
