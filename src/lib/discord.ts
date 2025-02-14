import { Client, Message, IntentsBitField, Partials } from "discord.js";

export const createDiscordClient = () => {
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
  });

  return discord;
};



export const discord = createDiscordClient();
