import { REST, Routes } from "discord.js";
import getLocalCommands from "@/utils/get-local-commands";
import { User } from "@/events/interactionCreate/handleCommands";

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

export default async function (client: User) {
  const localCommands = getLocalCommands();

  client.commands = localCommands;

  try {
    console.log(
      `Started refreshing ${localCommands.size} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      {
        body: Array.from(localCommands).map(([_, object]: [any, any]) =>
          object.data.toJSON(),
        ),
      },
    );

    console.log(
      `Successfully reloaded ${(data as any).length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
}
