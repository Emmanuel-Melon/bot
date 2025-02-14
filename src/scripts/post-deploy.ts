import { execSync } from 'child_process';
import { logParser } from './log-parser';
import { DiscordService } from '../services/discord/discord.service';

const discordService = new DiscordService();

async function main() {
  console.log('Post-deployment script executed successfully at:', new Date().toISOString());
  console.log('Environment:', process.env.NODE_ENV || 'development');

  // Log workflow information
  const workflowInfo = {
    name: process.env.WORKFLOW_NAME || 'N/A',
    status: process.env.WORKFLOW_STATUS || 'N/A',
    runId: process.env.WORKFLOW_RUN_ID || 'N/A',
    trigger: process.env.WORKFLOW_TRIGGER || 'N/A'
  };

  console.log('\nWorkflow Information:', workflowInfo);

  try {
    // Run user tests and capture output
    console.log('\nRunning User Tests:');
    const testOutput = execSync('npm test -- test/user.test.ts', { encoding: 'utf-8' });
    console.log('Test Output:');
    console.log(testOutput);
    console.log('User tests completed successfully');
    console.log("DISCORD_PUBLIC_KEY:", process.env.DISCORD_PUBLIC_KEY);

    // Send success message to Discord
    await discordService.sendToGitHubChannel(`
🚀 Deployment Successful!
━━━━━━━━━━━━━━━━━━━━━━━
✅ Tests: Passed
📅 Time: ${new Date().toISOString()}
🔄 Workflow: ${workflowInfo.name}
🎯 Trigger: ${workflowInfo.trigger}
🆔 Run ID: ${workflowInfo.runId}
    `);

    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      const formattedReport = logParser.formatErrorReport(error.message);
      console.error(formattedReport);

      // Send error message to Discord
      await discordService.sendToGitHubChannel(`
❌ Deployment Failed!
━━━━━━━━━━━━━━━━━━━━
⚠️ Tests: Failed
📅 Time: ${new Date().toISOString()}
🔄 Workflow: ${workflowInfo.name}
🎯 Trigger: ${workflowInfo.trigger}
🆔 Run ID: ${workflowInfo.runId}

Error Details:
\`\`\`
${error.message}
\`\`\`
      `);

      process.exit(1);
    }
  }
}

// Run the async main function
main().catch(error => {
  console.error('Unhandled error in post-deployment script:', error);
  process.exit(1);
});
