import { config } from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
const envPath = path.resolve(process.cwd(), '.env');
config({ path: envPath });
import { DiscordService } from '../services/discord/discord.service';
import { DISCORD_CONFIG } from '../services/discord/constants';
import { discord } from '../lib/discord';

async function main() {
  try {
    const discordService = new DiscordService();
      
    // Initialize the Discord service
    discordService.initialize();
    
    // Wait for the Discord client to be ready
    if (!discord.isReady()) {
      console.log('Waiting for Discord client to be ready...');
      await new Promise<void>((resolve) => {
        discord.once('ready', () => {
          console.log('Discord client is now ready!');
          resolve();
        });
      });
    }
    
    // Find and log GitHub channel
    await discordService.findChannel();
    
    // Get all channels for reference
    const channels = await discordService.getChannels(DISCORD_CONFIG.SERVER_ID);
    console.log('\nAll available channels:');
    channels.forEach(channel => {
      console.log(`- ${channel.name} (${channel.id})`);
    });
    
  } catch (error) {
    console.error('Error checking channels:', error);
    process.exit(1);
  }
}

// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
