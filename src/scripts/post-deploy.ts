import { execSync } from 'child_process';

console.log('Post-deployment script executed successfully at:', new Date().toISOString());
console.log('Environment:', process.env.NODE_ENV || 'development');

// Log workflow information
console.log('\nWorkflow Information:');
console.log('Workflow Name:', process.env.WORKFLOW_NAME || 'N/A');
console.log('Workflow Status:', process.env.WORKFLOW_STATUS || 'N/A');
console.log('Workflow Run ID:', process.env.WORKFLOW_RUN_ID || 'N/A');
console.log('Trigger Event:', process.env.WORKFLOW_TRIGGER || 'N/A');

// Run user tests and capture output
console.log('\nRunning User Tests:');
try {
  const testOutput = execSync('npm test -- test/user.test.ts', { encoding: 'utf-8' });
  console.log('Test Output:');
  console.log(testOutput);
  console.log('User tests completed successfully');
} catch (error) {
  console.error('User tests failed:');
  if (error instanceof Error) {
    console.error(error.message);
    // Exit with error code if tests fail
    process.exit(1);
  }
}

// Exit with success code if everything passes
process.exit(0);
