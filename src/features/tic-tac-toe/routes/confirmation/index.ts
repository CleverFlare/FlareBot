import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { router, Routes } from "../..";
import { Route } from "../../router";

const confirmationRoute: Route = (interaction) => {
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
    reply: {
      embeds: [confirmationEmbed],
      components: [actionRow],
      content: `<@${interaction.options.getUser("opponent")?.id}>`,
    },
    buttonEvents: [
      {
        customId: "accept",
        handler: handleAccept,
      },
    ],
  };
};

export default confirmationRoute;
