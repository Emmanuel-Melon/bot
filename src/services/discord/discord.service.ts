import {
    Client,
    Message,
    MessageReaction,
    User,
    PartialMessageReaction,
    PartialUser,
    MessageReactionEventDetails,
    GuildChannel,
    TextChannel,
  } from "discord.js";
  import { discord } from "../../lib/discord";
  import { CHANNELS } from "./constants";
  
  export class DiscordService {
    constructor() {
    }
  
    async handleReady() {
      console.log("Discord bot is ready!");
    }
  
    async handleMessageCreate(message: Message) {
      try {
        console.info({
          event: "message_logged",
          messageId: message?.id,
          channel: message.channel.id
        });
      } catch (error) {
        console.error("Failed to save message:", error);
      }
    }
  
    async handleMessageReactionAdd(
      reaction: MessageReaction | PartialMessageReaction,
      user: User | PartialUser,
      _details: MessageReactionEventDetails,
    ) {
      try {
        if (reaction.partial) {
          reaction = await reaction.fetch();
        }
        if (user.partial) {
          user = await user.fetch();
        }
  
        if (user.bot) return;
  
        const emojiName = reaction.emoji.name;
        if (!["🐛", "🚀", "❓"].includes(emojiName || "")) {
          return;
        }
      } catch (error) {
        console.error("Failed to handle reaction:", error);
      }
    }
  
    async getChannels(guildId: string): Promise<TextChannel[]> {
      try {
        const guild = await discord.guilds.fetch(guildId);
        const channels = await guild.channels.fetch();
        
        return channels
          .filter((channel): channel is TextChannel => 
            channel !== null && channel.type === 0
          )
          .map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: channel.position,
          })) as TextChannel[];
      } catch (error) {
        console.error("Failed to fetch channels:", error);
        throw error;
      }
    }

    async findChannel() {
      try {
        console.log('Looking for GitHub channel...');
        console.log('Channel ID:', CHANNELS.GITHUB);
        
        const channel = await discord.channels.fetch(CHANNELS.GITHUB);
        console.log('Found channel:', {
          id: channel?.id,
          name: channel?.toString(),
          type: channel?.type,
          available: !!channel
        });
        
        return channel;
      } catch (error) {
        console.error('Error finding GitHub channel:', error);
        throw error;
      }
    }

    async sendToGitHubChannel(message: string) {
      try {
        console.log("github channel id", CHANNELS.GITHUB);
        const channel = await discord.channels.fetch(CHANNELS.GITHUB) as TextChannel;
        console.log("Channel:", channel);
        if (!channel) {
          throw new Error('GitHub channel not found');
        }
        return await channel.send(message);
      } catch (error) {
        console.error('Failed to send message to GitHub channel:', error);
        throw error;
      }
    }
  
    initialize() {
      discord.on("ready", this.handleReady.bind(this));
      discord.on("messageCreate", this.handleMessageCreate.bind(this));
      discord.on(
        "messageReactionAdd",
        this.handleMessageReactionAdd.bind(this),
      );
    }
  }