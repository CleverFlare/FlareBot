import { ButtonInteraction } from "discord.js";

export async function turnGate(
  interaction: ButtonInteraction,
  turnUser: string,
  playerId: string,
  opponentId?: string,
) {
  const interactingUserId = interaction.user.id;

  const isCorrectUser = interactingUserId === turnUser;

  if (isCorrectUser) return; // guard clouse

  const isPlayer = interactingUserId === playerId;
  const isOpponent = interactingUserId === opponentId;

  if (isPlayer || isOpponent) {
    interaction.reply({
      content: "It's not your turn yet.",
      ephemeral: true,
    });

    return false;
  }

  const isNotParty = !isPlayer && !isOpponent;

  if (isNotParty) {
    await interaction.reply({
      content:
        "You're not a party in this game. Feel free to begin a new one if you like.",
      ephemeral: true,
    });

    return false;
  }

  return true;
}
