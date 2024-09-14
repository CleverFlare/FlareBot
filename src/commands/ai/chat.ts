import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

type ResponseType = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
};

export default {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with the natural language processing")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your message to the natural language processor")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.deferReply();

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
          model: "gemma2",
          prompt:
            interaction.options.get("message")?.value ??
            `Say "I'm sorry, it seems that there is an error running the Discord bot."`,
          stream: false,
        }),
      });

      const json = (await response.json()) as ResponseType;

      interaction.editReply(json.response);
    } catch (err) {
      interaction.reply("Something went wrong, check out the console");
    }
  },
};
