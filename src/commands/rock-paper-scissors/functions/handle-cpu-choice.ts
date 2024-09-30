import { randomArrayItem } from "@/utils/array-random-item";
import { Choices, pickedMark, winLoseMap, WinLoseMap } from "../constants";
import { EmbedBuilder } from "discord.js";

export function handleCpuChoice(
  opponentId: string | null | undefined,
  dataEmbed: EmbedBuilder,
  callback: (choice: Choices) => any,
) {
  const isOppponentCpu = !opponentId;

  if (!isOppponentCpu) return;

  const choices = Object.keys(winLoseMap) as Array<keyof WinLoseMap>;
  const choice = randomArrayItem(choices);

  const fields = structuredClone(dataEmbed.data.fields!);

  const computerFieldIndex = fields.findIndex(
    (field) => field.name === "Opponent",
  );

  fields[computerFieldIndex].value = pickedMark;

  dataEmbed.setFields(fields);

  callback(choice);
}
