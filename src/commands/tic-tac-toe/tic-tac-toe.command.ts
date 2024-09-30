import {
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { createTimeoutEmbed } from "./utils/create-timeout-embed";
import { handleConfirmation } from "./functions/handle-confirmation";
import { createRejectionEmbed } from "./utils/create-rejection-embed";
import { createConfirmationEmbed } from "./utils/create-confirmation-embed";
import { createAcceptButton } from "./utils/create-accept-button";
import { createRejectButton } from "./utils/create-reject-button";
import { createMatchDataEmbed } from "./utils/create-match-data-embed";
import { constructGridFromBinary } from "./utils/construct-board-from-binary";
import { createChoiceButtons } from "./utils/create-choice-buttons";
import { emptyCellsBinary, winningCombos } from "./constants";
import { findGame, removeGame } from "./store";
import { turnGate } from "./functions/turn-gate";
import { isAvailableMove } from "./functions/is-available-move";
import { storeMove } from "./functions/store-move";
import { detectWinner } from "./functions/detect-winner";
import { handleResult } from "./functions/handle-result";
import { handleTimeout } from "./functions/handle-timeout";
import { handleCpuMove } from "./functions/handle-cpu";

export default {
  data: new SlashCommandBuilder()
    .setName("tic-tac-toe")
    .setDescription(
      "Play with the computer or with your friend the famous Tic Tac Toe game.",
    )
    .addUserOption((option) =>
      option.setName("opponent").setDescription("Choose your opponent."),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const playerId: string = interaction.user.id;
      const opponentId: string | undefined =
        interaction.options.getUser("opponent")?.id;

      const isOpponentCpu = !opponentId;

      // confirm challenge acceptance from the opponent if an opponent specified
      if (!isOpponentCpu) {
        const embeds = {
          confirmation: createConfirmationEmbed(playerId),
          rejection: createRejectionEmbed(opponentId),
          timeout: createTimeoutEmbed(opponentId),
        };
        const buttons = {
          accept: createAcceptButton(),
          reject: createRejectButton(),
        };

        const response = await handleConfirmation({
          interaction,
          opponentId,
          embeds,
          buttons,
        });

        // if the confirmation message timeout or is rejected, return instead of proceeding
        if (response.type === "timeout" || response.type === "reject") return;
      } else {
        await interaction.deferReply();
      }

      const game = findGame(playerId, opponentId);

      const matchDataEmbed = createMatchDataEmbed(
        playerId,
        opponentId,
        game.turn.userId,
      );
      const ticTacGrid = constructGridFromBinary(
        emptyCellsBinary,
        emptyCellsBinary,
      );
      const ticTacGridEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription("```" + ticTacGrid + "```");
      const choiceButtons = createChoiceButtons();

      const reply = await interaction.editReply({
        embeds: [matchDataEmbed, ticTacGridEmbed],
        components: choiceButtons,
      });

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 100_000,
      });

      collector.on("collect", async (interaction) => {
        const moveInBinary = parseInt(interaction.customId, 2);

        const isAllowed = await turnGate(
          interaction,
          game.turn.userId,
          playerId,
          opponentId,
        );

        if (isAllowed === false) return;

        isAvailableMove(interaction, game.availableMoves, moveInBinary);

        storeMove(
          game.turn.userId,
          game.playerId,
          game.opponentId,
          () => (game.playerMoves |= moveInBinary),
          () => (game.opponentMoves |= moveInBinary),
        );

        if (!isOpponentCpu) game.turn.swap();

        handleCpuMove(
          game.availableMoves,
          game.opponentMoves,
          opponentId,
          (cpuMove) => (game.opponentMoves |= cpuMove),
        );

        matchDataEmbed.setFields([
          { name: "Turn", value: `<@${game.turn.userId}>` },
        ]);

        const ticTacGrid = constructGridFromBinary(
          game.playerMoves,
          game.opponentMoves,
        );

        ticTacGridEmbed.setDescription("```" + ticTacGrid + "```");

        await reply.edit({
          embeds: [matchDataEmbed, ticTacGridEmbed],
          components: choiceButtons,
        });

        const winner = detectWinner(
          game.playerMoves,
          game.opponentMoves,
          winningCombos,
        );

        await handleResult(
          reply,
          game.availableMoves,
          winner,
          playerId,
          opponentId,
          matchDataEmbed,
          ticTacGridEmbed,
          () => collector.stop("finished"),
        );

        await interaction.deferUpdate();
      });

      collector.on("end", async (_, reason) => {
        if (reason === "time") {
          await handleTimeout(reply);
        }

        removeGame(game);
      });
    } catch (err) {
      console.log("ERROR:", err);
      interaction.reply(
        "An error occurred. If this is a bug, do not hesitate to inform the developer to look into the bot's logs",
      );
    }
  },
};
