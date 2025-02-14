console.log('Post-deployment script executed successfully at:', new Date().toISOString());
console.log('Environment:', process.env.NODE_ENV || 'development');

// Log workflow information
console.log('\nWorkflow Information:');
console.log('Workflow Name:', process.env.WORKFLOW_NAME || 'N/A');
console.log('Workflow Status:', process.env.WORKFLOW_STATUS || 'N/A');
console.log('Workflow Run ID:', process.env.WORKFLOW_RUN_ID || 'N/A');
console.log('Trigger Event:', process.env.WORKFLOW_TRIGGER || 'N/A');

// Exit with success code
process.exit(0);
