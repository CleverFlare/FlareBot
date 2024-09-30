import { ButtonBuilder, ButtonStyle } from "discord.js";

export function createRejectButton() {
  return new ButtonBuilder()
    .setCustomId("reject")
    .setLabel("Reject")
    .setStyle(ButtonStyle.Danger);
}
