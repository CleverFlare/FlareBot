import { EmbedBuilder } from "discord.js";
import { Choices } from "../constants";

export function handleRevealChoices(
  dataEmbed: EmbedBuilder,
  playerChoice: Choices,
  opponentChoice: Choices,
) {
  const fields = structuredClone(dataEmbed.data.fields!);

  const playerFieldIndex = fields.findIndex((field) => field.name === "Player");
  const opponentFieldIndex = fields.findIndex(
    (field) => field.name === "Opponent",
  );

  fields[playerFieldIndex].value = playerChoice;
  fields[opponentFieldIndex].value = opponentChoice;

  return fields;
}
