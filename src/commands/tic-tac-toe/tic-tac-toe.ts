import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { constructBoardFromBinary } from "./utils/construct-board-from-binary";
import { createChoicesButtons } from "./utils/create-buttons-from-binary";
import { detectWinner } from "./utils/detect-winner";

interface Game {
  player: string;
  opponent: string | "NPC";
  availableMoves: number;
  playerMoves: number;
  opponentMoves: number;
  turn: boolean;
}

const games: Game[] = [];

const winningCombos = [
  // horizontal
  0b111000000, 0b000111000, 0b000000111,
  // vertical
  0b100100100, 0b010010010, 0b001001001,
  // diagonal
  0b100010001, 0b001010100,
];

export default {
  data: new SlashCommandBuilder()
    .setName("tic-tac")
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
      let gameOver = false;

      let game = games.find(
        (game) =>
          game.player === interaction.user.id ||
          game.opponent === interaction.user.id,
      );

      if (!game) {
        games.push({
          player: interaction.user.id,
          opponent: interaction.options.getUser("opponent")?.id ?? "NPC",
          opponentMoves: 0b000000000,
          playerMoves: 0b000000000,
          get availableMoves() {
            return this.playerMoves | this.opponentMoves;
          },
          turn: true,
        });

        game = games.at(-1)!;
      }

      console.log("GAMES:", games);

      let userTurn = game.turn ? game.player : game.opponent;

      const initialEmbed = new EmbedBuilder()
        .setTitle("Tic Tac Toe Game")
        .setDescription(
          `A game started between <@${game.player}> and ${game.opponent === "NPC" ? "the computer" : `<@${game.opponent}>`}`,
        )
        .setColor("Blue");

      const boardEmbed = new EmbedBuilder()
        .setDescription(
          `Turn: <@${userTurn}>\n${constructBoardFromBinary(
            game.playerMoves,
            game.opponentMoves,
          )}`,
        )
        .setColor("Blue");

      let buttons = createChoicesButtons();

      let actionRows = [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          buttons.slice(0, 3),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          buttons.slice(3, 6),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          buttons.slice(6, 9),
        ),
      ];

      const reply = await interaction.reply({
        embeds: [initialEmbed, boardEmbed],
        components: [...actionRows],
        fetchReply: true,
      });

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === userTurn || !gameOver,
        time: 30_000,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.user.id !== userTurn) {
          if (interaction.user.id === game.opponent) {
            interaction.reply({
              content: "It's not your turn yet!",
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content:
                "You're not a party in this game. Feel free to begin a new one if you like.",
              ephemeral: true,
            });
          }

          return;
        }

        if (
          (game.availableMoves | parseInt(interaction.customId, 2)) ===
          game.availableMoves
        ) {
          interaction.reply({
            content:
              "This position is occupied! Try playing in another position.",
            ephemeral: true,
          });
          return;
        }

        if (userTurn === game.player) {
          game.playerMoves |= parseInt(interaction.customId, 2);
        } else if (userTurn === game.opponent) {
          game.opponentMoves |= parseInt(interaction.customId, 2);
        }

        game.turn = !game.turn;

        userTurn = game.turn ? game.player : game.opponent;

        const winner = detectWinner(
          game.playerMoves,
          game.opponentMoves,
          winningCombos,
        );

        if (0b111111111 === game.availableMoves && !winner) {
          boardEmbed.setDescription(
            `${constructBoardFromBinary(game.playerMoves, game.opponentMoves)}`,
          );

          initialEmbed.setDescription(
            `A game started between <@${game.player}> and ${game.opponent === "NPC" ? "the computer" : `<@${game.opponent}>`}\nResult: Tie`,
          );

          await reply.edit({
            embeds: [initialEmbed, boardEmbed],
            components: [],
          });

          await interaction.deferUpdate();

          const gameIndex = games.indexOf(game);

          games.splice(gameIndex, 1);

          return;
        }

        if (!winner) {
          boardEmbed.setDescription(
            `Turn: <@${userTurn}>\n${constructBoardFromBinary(
              game.playerMoves,
              game.opponentMoves,
            )}`,
          );

          await reply.edit({
            embeds: [initialEmbed, boardEmbed],
            components: [...actionRows],
          });
        } else {
          boardEmbed
            .setDescription(
              `${constructBoardFromBinary(game.playerMoves, game.opponentMoves)}`,
            )
            .setColor("Green");

          initialEmbed
            .setDescription(
              `A game started between <@${game.player}> and ${game.opponent === "NPC" ? "the computer" : `<@${game.opponent}>`}\nWinner: <@${winner === "player" ? game.player : game.opponent}>`,
            )
            .setColor("Green");

          await reply.edit({
            embeds: [initialEmbed, boardEmbed],
            components: [],
          });

          const gameIndex = games.indexOf(game);

          games.splice(gameIndex, 1);
        }

        await interaction.deferUpdate();

        console.log("Game's Current State:", game);
      });
    } catch (err) {
      console.log("ERROR:", err);
      interaction.reply(
        "An error occurred. If this is a bug, do not hesitate to inform the developer to look into the bot's logs",
      );
    }
  },
};
