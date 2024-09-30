import { EmbedBuilder } from "discord.js";

export function createDataEmbed(playerId: string, opponentId?: string) {
  const isOpponentCpu = !opponentId;

  const opponent = isOpponentCpu ? "the computer" : `<@${opponentId}>`;

  return new EmbedBuilder()
    .setTitle("Rock Paper Scissors Game")
    .setDescription(`A game started between <@${playerId}> and ${opponent}.`)
    .setColor("Blue")
    .setFields([
      { name: "Player", value: "Picking...", inline: true },
      { name: "Opponent", value: "Picking...", inline: true },
    ]);
}
