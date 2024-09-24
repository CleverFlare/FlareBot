import {
  handleConfirmation as globalHandleConfirmation,
  ReturnType,
  Dependencies,
} from "@/functions/handle-confirmation";
import {
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export type HandleConfirmationProps = {
  interaction: ChatInputCommandInteraction;
  playerId: string;
  opponentId: string;
};

export function handleConfirmation({
  interaction,
  playerId,
  opponentId,
}: HandleConfirmationProps): ReturnType {
  const confirmationEmbed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle("Tic Tac Toe Challenge")
    .setDescription(
      `<@${playerId}> challenged you in a tic tac toe game. Do you accept the challenge?`,
    );

  const rejectionEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Challenge Rejected")
    .setDescription(`<@${opponentId}> did not accept the game challenge.`);

  const timeoutEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Timeout")
    .setDescription(`<@${opponentId}> did not respond in time.`);

  const acceptButton = new ButtonBuilder()
    .setCustomId("accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success);

  const rejectButton = new ButtonBuilder()
    .setCustomId("reject")
    .setLabel("Reject")
    .setStyle(ButtonStyle.Danger);

  return globalHandleConfirmation({
    interaction,
    embeds: {
      confirmation: confirmationEmbed,
      rejection: rejectionEmbed,
      timeout: timeoutEmbed,
    },
    buttons: {
      accept: acceptButton,
      reject: rejectButton,
    },
    allowedUsers: [opponentId],
  });
}
