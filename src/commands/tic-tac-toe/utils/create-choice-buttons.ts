import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

type Button = {
  emoji: string;
  value: number;
};

const buttons: Button[] = [
  {
    emoji: "1️⃣",
    value: 0b100000000,
  },
  {
    emoji: "2️⃣",
    value: 0b010000000,
  },
  {
    emoji: "3️⃣",
    value: 0b001000000,
  },
  {
    emoji: "4️⃣",
    value: 0b000100000,
  },
  {
    emoji: "5️⃣",
    value: 0b000010000,
  },
  {
    emoji: "6️⃣",
    value: 0b000001000,
  },
  {
    emoji: "7️⃣",
    value: 0b000000100,
  },
  {
    emoji: "8️⃣",
    value: 0b000000010,
  },
  {
    emoji: "9️⃣",
    value: 0b000000001,
  },
];

export function createChoiceButtons() {
  const results = [];

  for (const button of buttons) {
    results.push(
      new ButtonBuilder()
        .setCustomId(button.value.toString(2).padStart(9, "0"))
        .setStyle(ButtonStyle.Primary)
        .setEmoji(button.emoji),
    );
  }

  return [
    new ActionRowBuilder<ButtonBuilder>().addComponents(results.slice(0, 3)),
    new ActionRowBuilder<ButtonBuilder>().addComponents(results.slice(3, 6)),
    new ActionRowBuilder<ButtonBuilder>().addComponents(results.slice(6, 9)),
  ];
}
