import {
  ButtonInteraction,
  InteractionReplyOptions,
  MessagePayload,
} from "discord.js";

export function handleButtonClick(
  i: ButtonInteraction,
  allowedUsers: string[],
  formatList: (allowedUsersMentions: string[]) => string,
  allowedUserReplyOptions?: string | MessagePayload | InteractionReplyOptions,
) {
  if (!allowedUsers.includes(i.user.id)) {
    const allowedUsersMentions = allowedUsers.map((userId) => `<@${userId}>`);

    const plural = allowedUsers.length > 1;

    const formattedAllowedUsersmentions = formatList(allowedUsersMentions);

    i.reply(
      allowedUserReplyOptions ?? {
        content: `Only ${formattedAllowedUsersmentions} ${plural ? "are" : "is"} allowed to interact with this confirmation message.`,
        ephemeral: true,
      },
    );

    return false;
  }

  return true;
}
