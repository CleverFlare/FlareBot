import { ButtonInteraction } from "discord.js";

export function isAvailableMove(
  interaction: ButtonInteraction,
  availableMoves: number,
  move: number,
) {
  const isOverlapping = (availableMoves & move) !== 0;

  if (isOverlapping) {
    interaction.reply({
      content: "This position is occupied! Try playing in another position.",
      ephemeral: true,
    });

    return false;
  }

  return true;
}
