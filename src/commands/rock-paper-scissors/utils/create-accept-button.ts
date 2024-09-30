import { ButtonBuilder, ButtonStyle } from "discord.js";

export function createAcceptButton() {
  return new ButtonBuilder()
    .setCustomId("accept")
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success);
}
