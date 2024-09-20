import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { router, Routes } from "../..";
import { RouteReturnedType } from "../../router";

export default function confirmationRoute(
  interaction: ChatInputCommandInteraction,
): RouteReturnedType {
  const confirmationEmbed = new EmbedBuilder()
    .setTitle("Tic Tac Toe Challenge")
    .setDescription(
      `<@${interaction.user.id}> challenged you in a Tic Tac Toe game. Do you accept?`,
    );

  const acceptButton = new ButtonBuilder()
    .setCustomId("accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success);

  const denyButton = new ButtonBuilder()
    .setCustomId("deny")
    .setLabel("Deny")
    .setStyle(ButtonStyle.Danger);

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
    acceptButton,
    denyButton,
  ]);

  async function handleAccept(i: ButtonInteraction) {
    router.navigate<Routes>("test");
    i.deferUpdate();
  }

  return {
    embeds: [confirmationEmbed],
    components: [actionRow],
    content: `<@${interaction.options.getUser("opponent")?.id}>`,
    buttonEvents: [
      {
        customId: "accept",
        handler: handleAccept,
      },
    ],
  };
}
