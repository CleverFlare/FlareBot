import callAi from "@/utils/call-ai";
import { Client, DMChannel, Message, MessageType } from "discord.js";

export default async function (client: Client, message: Message) {
  if (message.author.bot) return;

  if (
    message.content.includes("@here") ||
    message.content.includes("@everyone")
  )
    return false;

  if (client.user?.id && !message.mentions.has(client.user?.id ?? "Unknown"))
    return;

  if (message.type === MessageType.Reply) {
    const repliedTo = await message.channel.messages.fetch(
      message.reference?.messageId ?? "Hi there",
    );
    if (repliedTo.author?.id !== client.user?.id) return;
  }

  const regex = new RegExp(`<@${client.user?.id ?? 0}>`, "gi");

  const cleanContent = message.content.replace(regex, "").trim();

  await (message.channel as DMChannel).sendTyping();

  const data = await callAi(cleanContent);

  await message.reply(data.response);
}
