import { EmbedBuilder } from "discord.js";

export function createTimeoutEmbed() {
  const timeoutEmbed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Timeout")
    .setDescription(`No response has been received in time.`);

  return timeoutEmbed;
}
