import { EmbedBuilder } from "discord.js";

export function createConfirmationEmbed(playerId: string) {
  return new EmbedBuilder()
    .setColor("Blue")
    .setTitle("Rock Paper Scissors Challenge")
    .setDescription(
      `<@${playerId}> challenged you in a rock paper scissors game. Do you accept the challenge?`,
    );
}
