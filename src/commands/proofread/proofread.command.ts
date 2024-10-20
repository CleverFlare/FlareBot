import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

type Body = {
  model: "gemma2:27b";
  prompt: string;
  system?: string;
  stream: boolean;
};

export default {
  data: new SlashCommandBuilder()
    .setName("proofread")
    .setDescription(
      "Correct the spelling, punctuation, formatting, and accuracy of your English writings.",
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text you want to proofread.")
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("verbose")
        .setDescription(
          "If set to true, the bot will detail about the corrections.",
        ),
    )
    .addBooleanOption((option) =>
      option
        .setName("formal")
        .setDescription(
          "If set to true, the bot will not allow informal contractions.",
        ),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const text = interaction.options.getString("text");
    const isVerbose = interaction.options.getBoolean("verbose");
    const isFormal = interaction.options.getBoolean("formal");

    const verboseInstruction = isVerbose
      ? " and list all of the corrected parts while describing why and how it was corrected."
      : "";
    const formalInstruction = isFormal ? "(formal)" : "(informal)";

    if (!text) {
      await interaction.reply({
        content: "You must add in the text you want to proofread.",
        ephemeral: true,
      });

      return;
    }

    await interaction.deferReply();

    const body: Body = {
      model: "gemma2:27b",
      prompt: `Correct only the grammar, spelling and contractions${formalInstruction} of "${text}" and respond only by giving the corrected sentence${verboseInstruction}. do not rephrase or restructure the sentence unless necessary. If no correction can be made, respond with "There are no errors in the text.".`,
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
