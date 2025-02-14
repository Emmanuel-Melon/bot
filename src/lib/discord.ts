import { Client, Message, IntentsBitField, Partials } from "discord.js";
import { DISCORD_CONFIG } from "../services/discord/constants";

export const createDiscordClient = () => {
  // Verify Discord configuration
  console.log('\nDiscord Configuration Check:');
  if (!DISCORD_CONFIG.TOKEN) {
    console.error('❌ Discord token is not set!');
    process.exit(1);
  }
  console.log('✓ Discord token is set');
  console.log('✓ App ID:', DISCORD_CONFIG.APP_ID);
  console.log('✓ Server ID:', DISCORD_CONFIG.SERVER_ID);

  const discord = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
      IntentsBitField.Flags.GuildMessageReactions,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
      Partials.User,
    ],
  });

  discord.on("ready", () => {
    console.info("Discord bot is ready!");
    console.log('Connected as:', discord.user?.tag);
  });

  // Login with the token
  console.log('Attempting to login to Discord...');
  discord.login(DISCORD_CONFIG.TOKEN).catch(error => {
    console.error('Failed to login to Discord:', error);
    process.exit(1);
  });

  return discord;
};

export const discord = createDiscordClient();
