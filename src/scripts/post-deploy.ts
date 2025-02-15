import { execSync } from 'child_process';
import { logParser } from './log-parser';
import { DiscordService } from '../services/discord/discord.service';

const discordService = new DiscordService();

async function main() {
  console.log('Post-deployment script executed at:', new Date().toISOString());
  console.log('Environment:', process.env.NODE_ENV || 'development');

  

  // Log workflow information
  const workflowInfo = {
    name: process.env.WORKFLOW_NAME || 'N/A',
    status: process.env.WORKFLOW_STATUS || 'N/A',
    runId: process.env.WORKFLOW_RUN_ID || 'N/A',
    trigger: process.env.WORKFLOW_TRIGGER || 'N/A',
    deploymentUrl: process.env.DEPLOYMENT_URL || 'N/A'
  };

  console.log('\nWorkflow Information:', workflowInfo);

  try {
    const isSuccess = workflowInfo.status === 'success';
    let testOutput = '';
    let healthCheckStatus = '❓';

    if (isSuccess) {
      try {
        // Run user tests and capture output
        console.log('\nRunning User Tests:');
        testOutput = execSync('npm test -- test/user.test.ts', { encoding: 'utf-8' });
        console.log('Test Output:', testOutput);
        healthCheckStatus = '✅';
      } catch (testError) {
        console.error('Test execution failed:', testError);
        healthCheckStatus = '❌';
        throw testError;
      }
    }

    const message = logParser.formatDeploymentMessage({
      isSuccess,
      healthCheckStatus,
      testOutput,
      workflowInfo
    });

    await discordService.sendToGitHubChannel(message);
    process.exit(isSuccess ? 0 : 1);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in post-deployment check:', error);
      
      // Format and send error message
      const message = logParser.formatErrorMessage(error, workflowInfo);
      await discordService.sendToGitHubChannel(message);
    }
    process.exit(1);
  }
}

// Run the async main function
main().catch(error => {
  console.error('Unhandled error in post-deployment script:', error);
  process.exit(1);
});
