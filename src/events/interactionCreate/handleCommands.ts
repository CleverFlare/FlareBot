import { ChatInputCommandInteraction, Client, Collection } from "discord.js";
export type User = Client & {
  commands?: Collection<any, any>;
  conditionListeners?: any[];
};

export default async function (
  client: Client,
  interaction: ChatInputCommandInteraction,
) {
  if (interaction.user.bot) return;
  if (!interaction.isChatInputCommand()) return;

  const command = (interaction.client as User).commands?.get(
    interaction.commandName,
  );

  if (!command) {
    console.log(`there is no such command as ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
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
}
