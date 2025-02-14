console.log('Post-deployment script executed successfully at:', new Date().toISOString());
console.log('Environment:', process.env.NODE_ENV || 'development');

// Exit with success code
process.exit(0);
