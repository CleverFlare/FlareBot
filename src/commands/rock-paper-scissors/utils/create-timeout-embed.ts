import { EmbedBuilder } from "discord.js";

export function createTimeoutEmbed(opponentId: string) {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle("Timeout")
    .setDescription(`<@${opponentId}> did not respond in time.`);
}
