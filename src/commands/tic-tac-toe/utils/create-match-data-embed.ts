import { EmbedBuilder } from "discord.js";

export function createMatchDataEmbed(
  playerId: string,
  opponentId: string | null | undefined,
  turnUserId: string,
) {
  const opponent = !opponentId ? "the computer" : `<@${opponentId}>`;
  return new EmbedBuilder()
    .setTitle("Tic Tac Toe Game.")
    .setDescription(`A game started between <@${playerId}> and ${opponent}.`)
    .setFields([{ name: "Turn", value: `<@${turnUserId}>` }])
    .setColor("Blue");
}
