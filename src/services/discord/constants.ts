// Validate required environment variables
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    console.error(`❌ Required environment variable ${name} is not set!`);
    process.exit(1);
  }
  return value;
}

export const CHANNELS = {
  FEEDBACK: validateEnvVar('FEEDBACK_CHANNEL_ID', process.env.FEEDBACK_CHANNEL_ID),
  GITHUB: validateEnvVar('DISCORD_GITHUB_CHANNEL_ID', process.env.DISCORD_GITHUB_CHANNEL_ID),
} as const;

console.log('\nChannel Configuration:');
console.log('✓ GitHub Channel ID:', CHANNELS.GITHUB);
console.log('✓ Feedback Channel ID:', CHANNELS.FEEDBACK);

export const DISCORD_CONFIG = {
  APP_ID: validateEnvVar('APP_ID', process.env.APP_ID),
  DISCORD_PUBLIC_KEY: validateEnvVar('DISCORD_PUBLIC_KEY', process.env.DISCORD_PUBLIC_KEY),
  TOKEN: validateEnvVar('DISCORD_TOKEN', process.env.DISCORD_TOKEN),
  SERVER_ID: validateEnvVar('DISCORD_SERVER_ID', process.env.DISCORD_SERVER_ID),
} as const;