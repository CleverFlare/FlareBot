import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export function sendInitialReply(
  interaction: ChatInputCommandInteraction,
  embeds: EmbedBuilder[],
  buttons: ButtonBuilder[],
  message?: string,
) {
  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttons,
  );

  return interaction.reply({
    content: message,
    embeds: embeds,
    components: [actionRow],
  });
}
