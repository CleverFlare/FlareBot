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
) {
  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttons,
  );

  return interaction.reply({
    embeds: embeds,
    components: [actionRow],
  });
}
