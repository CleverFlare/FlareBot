import { EmbedBuilder, Message } from "discord.js";
import { completedGrid } from "../constants";

export async function handleResult(
  reply: Message<boolean>,
  availableMoves: number,
  winner: "player" | "opponent" | null,
  playerId: string,
  opponentId: string | undefined | null,
  dataEmbed: EmbedBuilder,
  gridEmbed: EmbedBuilder,
  callback: () => void,
): Promise<null | "player" | "opponent" | "tie"> {
  const isCompletedGrid = availableMoves === completedGrid;

  const isOpponentCpu = !opponentId;

  const opponent = isOpponentCpu ? "The computer" : `<@${opponentId}>`;

  switch (winner) {
    case "player":
      dataEmbed.setFields([{ name: "Result", value: `<@${playerId}> Wins` }]);
      dataEmbed.setColor("Green");
      gridEmbed.setColor("Green");
      await reply.edit({
        embeds: [dataEmbed, gridEmbed],
        components: [],
      });
      callback();
      return "player";
    case "opponent":
      dataEmbed.setFields([{ name: "Result", value: `${opponent} Wins` }]);
      dataEmbed.setColor("Green");
      gridEmbed.setColor("Green");
      await reply.edit({
        embeds: [dataEmbed, gridEmbed],
        components: [],
      });
      callback();
      return "opponent";
    default:
      if (isCompletedGrid) {
        dataEmbed.setFields([{ name: "Result", value: `Tie` }]);
        await reply.edit({
          embeds: [dataEmbed, gridEmbed],
          components: [],
        });
        callback();
        return "tie";
      }
  }

  return null;
}
