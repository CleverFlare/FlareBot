import {
  ChatInputCommandInteraction,
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
import { emptyCellsBinary } from "./constants";

export default {
  data: new SlashCommandBuilder()
    .setName("tic-tac-toe")
    .setDescription(
      "Play with the computer or with your friend the famous Tic Tac Toe game.",
    )
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("Choose your opponent.")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const playerId: string = interaction.user.id;
      const opponentId: string | undefined =
        interaction.options.getUser("opponent")?.id;

      // confirm challenge acceptance from the opponent if an opponent specified
      if (opponentId !== undefined) {
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
      }

      // const game = findGame(playerId, opponentId);

      const matchDataEmbed = createMatchDataEmbed(playerId, opponentId);
      const ticTacGrid = constructGridFromBinary(
        emptyCellsBinary,
        emptyCellsBinary,
      );
      const ticTacGridEmbed = new EmbedBuilder().setDescription(
        "```" + ticTacGrid + "```",
      );
      const choiceButtons = createChoiceButtons();

      await interaction.editReply({
        embeds: [matchDataEmbed, ticTacGridEmbed],
        components: choiceButtons,
      });

      // const boardEmbed = new EmbedBuilder()
      //   .setDescription(
      //     `Turn: <@${userTurn}>\n${constructBoardFromBinary(
      //       game.playerMoves,
      //       game.opponentMoves,
      //     )}`,
      //   )
      //   .setColor("Blue");
      //
      // let buttons = createChoicesButtons();
      //
      // let actionRows = [
      //   new ActionRowBuilder<ButtonBuilder>().addComponents(
      //     buttons.slice(0, 3),
      //   ),
      //   new ActionRowBuilder<ButtonBuilder>().addComponents(
      //     buttons.slice(3, 6),
      //   ),
      //   new ActionRowBuilder<ButtonBuilder>().addComponents(
      //     buttons.slice(6, 9),
      //   ),
      // ];
      //
      // const reply = await interaction.reply({
      //   embeds: [initialEmbed, boardEmbed],
      //   components: [...actionRows],
      //   fetchReply: true,
      // });
      //
      // const collector = reply.createMessageComponentCollector({
      //   componentType: ComponentType.Button,
      //   filter: (i) => i.user.id === userTurn || !gameOver,
      //   time: 30_000,
      // });
      //
      // collector.on("collect", async (interaction) => {
      //   if (interaction.user.id !== userTurn) {
      //     if (interaction.user.id === game.opponent) {
      //       interaction.reply({
      //         content: "It's not your turn yet!",
      //         ephemeral: true,
      //       });
      //     } else {
      //       interaction.reply({
      //         content:
      //           "You're not a party in this game. Feel free to begin a new one if you like.",
      //         ephemeral: true,
      //       });
      //     }
      //
      //     return;
      //   }
      //
      //   if (
      //     (game.availableMoves | parseInt(interaction.customId, 2)) ===
      //     game.availableMoves
      //   ) {
      //     interaction.reply({
      //       content:
      //         "This position is occupied! Try playing in another position.",
      //       ephemeral: true,
      //     });
      //     return;
      //   }
      //
      //   if (userTurn === game.player) {
      //     game.playerMoves |= parseInt(interaction.customId, 2);
      //   } else if (userTurn === game.opponent) {
      //     game.opponentMoves |= parseInt(interaction.customId, 2);
      //   }
      //
      //   game.turn = !game.turn;
      //
      //   userTurn = game.turn ? game.player : game.opponent;
      //
      //   const winner = detectWinner(
      //     game.playerMoves,
      //     game.opponentMoves,
      //     winningCombos,
      //   );
      //
      //   if (0b111111111 === game.availableMoves && !winner) {
      //     boardEmbed.setDescription(
      //       `${constructBoardFromBinary(game.playerMoves, game.opponentMoves)}`,
      //     );
      //
      //     initialEmbed.setDescription(
      //       `A game started between <@${game.player}> and ${game.opponent === "NPC" ? "the computer" : `<@${game.opponent}>`}\nResult: Tie`,
      //     );
      //
      //     await reply.edit({
      //       embeds: [initialEmbed, boardEmbed],
      //       components: [],
      //     });
      //
      //     await interaction.deferUpdate();
      //
      //     const gameIndex = games.indexOf(game);
      //
      //     games.splice(gameIndex, 1);
      //
      //     return;
      //   }
      //
      //   if (!winner) {
      //     boardEmbed.setDescription(
      //       `Turn: <@${userTurn}>\n${constructBoardFromBinary(
      //         game.playerMoves,
      //         game.opponentMoves,
      //       )}`,
      //     );
      //
      //     await reply.edit({
      //       embeds: [initialEmbed, boardEmbed],
      //       components: [...actionRows],
      //     });
      //   } else {
      //     boardEmbed
      //       .setDescription(
      //         `${constructBoardFromBinary(game.playerMoves, game.opponentMoves)}`,
      //       )
      //       .setColor("Green");
      //
      //     initialEmbed
      //       .setDescription(
      //         `A game started between <@${game.player}> and ${game.opponent === "NPC" ? "the computer" : `<@${game.opponent}>`}\nWinner: <@${winner === "player" ? game.player : game.opponent}>`,
      //       )
      //       .setColor("Green");
      //
      //     await reply.edit({
      //       embeds: [initialEmbed, boardEmbed],
      //       components: [],
      //     });
      //
      //     const gameIndex = games.indexOf(game);
      //
      //     games.splice(gameIndex, 1);
      //   }
      //
      //   await interaction.deferUpdate();
      //
      //   console.log("Game's Current State:", game);
      // });
    } catch (err) {
      console.log("ERROR:", err);
      interaction.reply(
        "An error occurred. If this is a bug, do not hesitate to inform the developer to look into the bot's logs",
      );
    }
  },
};
