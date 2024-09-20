import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  MessagePayload,
} from "discord.js";
import { RouteReturnedType } from "../../router";

export default function testRoute(
  interaction: ChatInputCommandInteraction,
): RouteReturnedType {
  const confirmationEmbed = new EmbedBuilder()
    .setTitle("Test Screen")
    .setDescription("Is everything working alright?");

  return {
    content: "",
    embeds: [confirmationEmbed],
    components: [],
  };
}
