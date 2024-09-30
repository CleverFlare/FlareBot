import {
  Channel,
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send a message in any server channel.")
    .addStringOption((option) =>
      option
        .setName("message-id")
        .setDescription("The ID of the message you want the bot to send.")
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "Choose the channel in which the message should be sent into.",
        )
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const messageId = interaction.options.getString("message-id")!;
      const channel = interaction.options.getChannel("channel") as TextChannel;

      if (
        !interaction.channel ||
        interaction.channel.type !== ChannelType.GuildText
      ) {
        await interaction.reply({
          content: "You are not in a server text channel",
          ephemeral: true,
        });

        return;
      }

      let message = await interaction.channel.messages
        .fetch(messageId)
        .catch(() => {});

      if (!message) {
        await interaction.reply({
          content: "Couldn't find a message with ID " + messageId,
          ephemeral: true,
        });

        return;
      }

      await channel.send({
        content: message.content,
      });

      await interaction.deferReply();
      await interaction.deleteReply();
    } catch (err) {
      console.log("ERROR:", err);
      interaction.reply(
        "An error occurred. If this is a bug, do not hesitate to inform the developer to look into the bot's logs",
      );
    }
  },
};
