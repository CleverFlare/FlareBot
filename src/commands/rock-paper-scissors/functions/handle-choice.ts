import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Choices } from "../constants";

export function handleChoice(
  interaction: ButtonInteraction,
  userId: string,
  fieldName: string,
  dataEmbed: EmbedBuilder,
  callback: (playerChoice: Choices) => any,
) {
  const isSpecifiedUserChoice = interaction.user.id === userId;

  if (!isSpecifiedUserChoice) return;

  const choice = interaction.customId as Choices;

  const fields = structuredClone(dataEmbed.data.fields!);

  const playerFieldIndex = fields.findIndex(
    (field) => field.name === fieldName,
  );

  fields[playerFieldIndex].value = "✅ Picked";

  dataEmbed.setFields(fields);

  callback(choice);
}
