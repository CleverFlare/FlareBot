import { EmbedBuilder } from "discord.js";

export function createRejectionEmbed(opponentId: string) {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle("Challenge Rejected")
    .setDescription(`<@${opponentId}> did not accept the game challenge.`);
}
