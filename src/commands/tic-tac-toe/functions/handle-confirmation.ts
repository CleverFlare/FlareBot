import {
  handleConfirmation as globalHandleConfirmation,
  ReturnType,
} from "@/functions/handle-confirmation";
import {
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export type HandleConfirmationProps = {
  interaction: ChatInputCommandInteraction;
  opponentId: string;
  embeds: {
    confirmation: EmbedBuilder;
    rejection: EmbedBuilder;
    timeout: EmbedBuilder;
  };
  buttons: {
    accept: ButtonBuilder;
    reject: ButtonBuilder;
  };
};

export function handleConfirmation({
  interaction,
  opponentId,
  embeds,
  buttons,
}: HandleConfirmationProps): ReturnType {
  return globalHandleConfirmation({
    interaction,
    embeds,
    buttons,
    allowedUsers: [opponentId],
  });
}
