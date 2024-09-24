import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

export function createConfirmationComponents(
  playerId: string,
  opponentId: string,
) {
  const confirmationEmbed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle("Tic Tac Toe Challenge")
    .setDescription(
      `<@${playerId}> challenged you in a tic tac toe game. Do you accept the challenge?`,
    );

  const rejectionEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Challenge Rejected")
    .setDescription(`<@${opponentId}> did not accept the game request.`);

  const acceptButton = new ButtonBuilder()
    .setCustomId("accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success);

  const rejectButton = new ButtonBuilder()
    .setCustomId("reject")
    .setLabel("Reject")
    .setStyle(ButtonStyle.Danger);

  return {
    confirmationEmbed,
    rejectionEmbed,
    buttons: {
      accept: acceptButton,
      reject: rejectButton,
    },
  };
}
