import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { constructBoardFromBinary } from "./utils/construct-board-from-binary";
import { detectWinner } from "./utils/detect-winner";

interface Game {
  player: string;
  opponent: string | "NPC";
  board: [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]];
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
    .addBooleanOption((option) =>
      option
        .setName("multiplayer")
        .setDescription("If set to True, you'll start a game with a friend"),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const winner = detectWinner(0b000000000, 0b000000000, winningCombos);
      if (winner) interaction.reply(winner);
      else interaction.reply("tie");
    } catch (err) {
      console.log("ERROR:", err);
      interaction.reply(
        "An error occurred. If this is a bug, do not hesitate to inform the developer to look into the bot's logs",
      );
    }
  },
};
