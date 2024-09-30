import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function createRockPaperScissorButtons() {
  const rockButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel("Rock")
    .setEmoji("🪨")
    .setCustomId("rock");
  const paperButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel("Paper")
    .setEmoji("📄")
    .setCustomId("paper");
  const scissorButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel("Scissor")
    .setEmoji("✂️")
    .setCustomId("scissor");

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    rockButton,
    paperButton,
    scissorButton,
  );

  return actionRow;
}
