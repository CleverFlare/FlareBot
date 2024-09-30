import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import system from "../../system.txt";

type Body = {
  model: "gemma2:27b";
  prompt: string;
  system?: string;
  stream: boolean;
};

export default {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the A.I. model any question you want.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question you would like to ask.")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const question = interaction.options.getString("question")!;

      const body: Body = {
        model: "gemma2:27b",
        prompt: question,
        system,
        stream: false,
      };

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const json = (await response.json()) as { response: string };

      await interaction.editReply({
        content: json.response,
      });
    } catch (err) {
      console.log("ERROR:", err);
      interaction.reply(
        "An error occurred. If this is a bug, do not hesitate to inform the developer to look into the bot's logs",
      );
    }
  },
};
