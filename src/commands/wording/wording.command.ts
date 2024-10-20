import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

type Body = {
  model: "gemma2:27b";
  prompt: string;
  system?: string;
  stream: boolean;
};

export default {
  data: new SlashCommandBuilder()
    .setName("wording")
    .setDescription("Get alternative wordings for an English text.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The English text you want different wordings for.")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const text = interaction.options.getString("text");

    if (!text) {
      await interaction.reply({
        content:
          "You haven't specified the English text to provide alternative wordings for.",
        ephemeral: true,
      });

      return;
    }

    await interaction.deferReply();

    const body: Body = {
      model: "gemma2:27b",
      prompt: `Analyze the following sentence and provide alternative wordings that convey the same meaning: ${text}`,
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
  },
};
