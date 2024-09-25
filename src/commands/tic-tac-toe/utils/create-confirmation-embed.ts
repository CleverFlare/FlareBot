import { EmbedBuilder } from "discord.js";

export function createConfirmationEmbed(playerId: string) {
  return new EmbedBuilder()
    .setColor("Blue")
    .setTitle("Tic Tac Toe Challenge")
    .setDescription(
      `<@${playerId}> challenged you in a tic tac toe game. Do you accept the challenge?`,
    );
}
