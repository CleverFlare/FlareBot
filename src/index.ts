import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Client, GatewayIntentBits, Collection } from "discord.js";
import eventHandler from "./handlers/eventHandler";

// registers .env
dotenv.config();

// user type
type User = Client & {
  commands?: Collection<any, any>;
  conditionListeners?: any[];
};

// constructs the client object which is the root of all discord properties and methods
export const client: User = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

eventHandler(client);

client.login(process.env.DISCORD_TOKEN);
