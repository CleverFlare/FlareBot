import {
  ChatInputCommandInteraction,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";
import { createConfirmationEmbed } from "./utils/create-confirmation-embed";
import { createRejectionEmbed } from "./utils/create-rejection-embed";
import { createTimeoutEmbed } from "./utils/create-timeout-embed";
import { createAcceptButton } from "./utils/create-accept-button";
import { createRejectButton } from "./utils/create-reject-button";
import { handleConfirmation } from "./functions/handle-confirmation";
import { createDataEmbed } from "./utils/create-date-embed";
import { createRockPaperScissorButtons } from "./utils/create-rock-paper-scissor-buttons";
import { findGame, removeGame } from "./store";
import { handleTimeout } from "./functions/handle-timeout";
import { handleCpuChoice } from "./functions/handle-cpu-choice";
import { handleChoice } from "./functions/handle-choice";
import { handleRevealChoices } from "./functions/handle-reveal-choices";
import { detectWinner } from "./utils/detect-winner";

export default {
  data: new SlashCommandBuilder()
    .setName("rock-paper-scissors")
    .setDescription(
      "Play with the computer or with your friend the famous Rock Paper Scissors game.",
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

      const dataEmbed = createDataEmbed(playerId, opponentId);
      const buttons = createRockPaperScissorButtons();

      // only works if no opponent has been specified by the command
      handleCpuChoice(
        opponentId,
        dataEmbed,
        (choice) => (game.opponentChoice = choice),
      );

      const reply = await interaction.editReply({
        content: "",
        embeds: [dataEmbed],
        components: [buttons],
      });

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 30_000,
      });

      collector.on("collect", async (interaction) => {
        // handle player choice (only if the interaction is made by the player)
        handleChoice(
          interaction,
          game.playerId,
          "Player",
          dataEmbed,
          (choice) => (game.playerChoice = choice),
        );

        // handle opponent choice (only if the interaction is made by the opponent)
        handleChoice(
          interaction,
          game.opponentId,
          "Opponent",
          dataEmbed,
          (choice) => (game.opponentChoice = choice),
        );

        const playerPicked = game.playerChoice !== null;
        const opponentPicked = game.opponentChoice !== null;

        if (playerPicked && opponentPicked) {
          const fields = handleRevealChoices(
            dataEmbed,
            game.playerChoice!,
            game.opponentChoice!,
          );

          const winner = detectWinner(
            game.playerId,
            game.opponentId,
            game.playerChoice!,
            game.opponentChoice!,
            {
              onWinOrLose() {
                dataEmbed.setColor("Green");
              },
            },
          );

          const isTie = winner === null;

          const value = isTie ? "Tie" : `${winner} Wins!`;

          dataEmbed.setFields([...fields, { name: "Result", value }]);
        }

        await reply.edit({
          embeds: [dataEmbed],
          components: playerPicked && opponentPicked ? [] : [buttons],
        });

        await interaction.deferUpdate();

        if (playerPicked && opponentPicked) {
          collector.stop();
        }
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
