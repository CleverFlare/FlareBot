import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import User from "../../models/User";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Give a server member a warning")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give the warning")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for this member to get a warning")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const userOption = interaction.options.get("user", true);
      const reasonOption = interaction.options.get("reason", true);

      let user = await User.findOne({
        username: userOption.user?.username || "",
      });

      const displayName =
        (userOption.member as GuildMember)?.nickname ||
        userOption.user?.username;

      if (!user && userOption.user?.username)
        user = await User.create({
          username: userOption.user.username,
          name: displayName,
          avatar: userOption.user.avatarURL(),
        });

      user?.warnings.push({
        date: Date.now().toString(),
        reason: reasonOption.value as string,
      });

      await user?.save();

      await (userOption.member as GuildMember).send(
        `You've been warned, the reason for the warning is: ${
          reasonOption.value as string
        }`
      );

      interaction.reply({
        content: `Member <@${
          interaction.options.get("user", true).user?.id
        }> has been given a warning`,
        ephemeral: true,
      });
    } catch (err) {
      interaction.reply({
        content: "Something went wrong, couldn't create a warning",
        ephemeral: true,
      });
    }
  },
};
