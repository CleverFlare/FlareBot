import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

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
      interaction.reply(
        "```\n" +
          new Array(5)
            .fill(null)
            .map((_, index) => {
              if ((index + 1) % 2) {
                return "   |   |   ";
              } else {
                return "---|---|---";
              }
            })
            .join("\n") +
          "\n```",
      );
    } catch (err) {
      console.log("ERROR:", err);
      interaction.reply(
        "An error occurred. If this is a bug, do not hesitate to inform the developer to look into the bot's logs",
      );
    }
  },
};
