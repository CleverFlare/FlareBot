import { SlashCommandBuilder } from "discord.js";
import ticTacToe from "@/features/tic-tac-toe";

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
  execute: ticTacToe,
};
