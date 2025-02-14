export const CHANNELS = {
  FEEDBACK: process.env.FEEDBACK_CHANNEL_ID as string,
  GITHUB: process.env.GITHUB_CHANNEL_ID as string,
} as const;

export const DISCORD_CONFIG = {
  APP_ID: process.env.APP_ID as string,
  PUBLIC_KEY: process.env.PUBLIC_KEY as string,
  TOKEN: process.env.DISCORD_TOKEN as string,
  SERVER_ID: process.env.DISCORD_SERVER_ID as string,
} as const;