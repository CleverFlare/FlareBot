import { EmbedBuilder, Message } from "discord.js";

export function handleTimeout(reply: Message<boolean>) {
  const timeoutEmbed = new EmbedBuilder()
    .setTitle("Timeout")
    .setDescription("Match time has ran out.")
    .setColor("Red");

  return reply.edit({
    embeds: [timeoutEmbed],
    components: [],
  });
}
