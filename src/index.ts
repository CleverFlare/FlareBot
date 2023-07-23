import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  SlashCommandBuilder,
  Message,
  REST,
  Routes,
} from "discord.js";
import path from "path";
import { readdirSync } from "fs";
import mongoose from "mongoose";

// Registers .env
dotenv.config();

// Prefix
let prefix = "!";

// User type
type User = Client & {
  commands?: Collection<any, any>;
  conditionListeners?: any[];
};

// Custom events enum
enum BotEvents {
  Command = "command",
  Message = "message",
}

// Constructs the client object which is the root of all discord properties and methods
export const client: User = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Listens to ClientReady event only once to issue a console log that the bot is live
client.once(Events.ClientReady, (c) => {
  console.log(`✅ The Bot is Online (${c.user.tag})`);
});

// Creates the a collection data structure in a property called commands inside the client object
client.commands = new Collection();
const arrayCommands = [];

// Finds the commands directory
const commandsPath = path.join(__dirname, "commands");

// Filters the javascript and typescript files from the list of files it gets
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith(".ts" || ".js")
);

// Slash commands interface
interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: Message) => any;
}

// Puts all the data it gets in a command property inside the client object
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command: SlashCommand = require(filePath).default;

  if ("data" in command && "execute" in command) {
    client.commands!.set(command.data.name, command);

    arrayCommands.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Listeners interface
interface Listener {
  execute: (interaction: Message) => any;
}

// Creates the an array data structure in a property called listeners inside the client object
client.conditionListeners = [];

// Finds the listeners directory
const listenersPath = path.join(__dirname, "listeners");

// Filters the javascript and typescript files from the list of files it gets
const listenersFiles = readdirSync(listenersPath).filter((file) =>
  file.endsWith(".ts" || ".js")
);

// Puts all the data it gets in a listeners property inside the client object
for (const file of listenersFiles) {
  const filePath = path.join(listenersPath, file);
  const listener: Listener = require(filePath).default;

  if ("execute" in listener) client.conditionListeners!.push(listener);
  else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "condition" or "execute" property.`
    );
  }
}

// Listens to any interaction and capture the interaction it needs
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = (interaction.client as User).commands?.get(
    interaction.commandName
  );

  if (!command) {
    console.log(`there is no such command as ${interaction.commandName}`);
    return;
  }

  try {
    command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

type Command = Message<true> & { command: string };

// Listens to sending messages
client.on(Events.MessageCreate, async (interaction) => {
  if (interaction.author.bot) return;
  if (!interaction.content.startsWith(prefix)) {
    client.emit(BotEvents.Message, interaction);
    return;
  }

  const command = interaction.content.replace(prefix, "").split(" ")[0];

  (interaction as Command).command = command;

  interaction.content = interaction.content.substr(
    interaction.content.indexOf(" ") + 1
  );

  client.emit(BotEvents.Command, interaction);
});

client.on(BotEvents.Command, async (interaction) => {
  const command = (interaction.client as User).commands?.get(
    interaction.command
  );

  if (!command) {
    console.log(`there is no such command as ${interaction.commandName}`);
    interaction.reply("There is no such command.");
    return;
  }

  try {
    command.execute(interaction);
  } catch (err) {
    console.error(err);
  }
});

client.on(BotEvents.Message, async (interaction) => {
  (interaction.client.conditionListeners as Listener[]).forEach((listener) => {
    listener?.execute(interaction);
  });
});

mongoose.connect(process.env.MONGODB_URL!, {
  dbName: "FlareBot",
});

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(
      `Started refreshing ${arrayCommands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      {
        body: arrayCommands,
      }
    );

    console.log(
      `Successfully reloaded ${(data as any).length} application (/) commands.`
    );

    client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
