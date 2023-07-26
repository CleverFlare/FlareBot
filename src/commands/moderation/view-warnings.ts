import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import User from "../../models/User";

export default {
  data: new SlashCommandBuilder()
    .setName("view-warnings")
    .setDescription("Lists warned member, or a specific member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "If you specify this you'll see the warnings for that specific user"
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const userOption = interaction.options.get("user");
      let users;
      let embedMessage: EmbedBuilder | undefined;

      if (userOption) {
        users = await User.findOne({
          username: userOption.user!.username,
        });

        embedMessage = new EmbedBuilder()
          .setColor("#ff00ae")
          .setThumbnail(userOption.user?.avatarURL() || "")
          .setTitle((userOption.member as GuildMember).displayName)
          .setFields(
            users?.warnings.map((warning, index) => ({
              name: `#${index + 1}`,
              value: `**reason: **${warning.reason}\n`,
            })) || [{ name: "Got no warnings", value: "\u200B" }]
          );
      } else {
        users = await User.find({
          warnings: { $exists: true, $not: { $size: 0 } },
        });
        const warningCounts: number[] = [];
        const names: string[] = [];

        for (const user of users) {
          if (!user.warnings.length) continue;

          names.push(user.name);
          warningCounts.push(user.warnings.length);
        }

        embedMessage = new EmbedBuilder()
          .setColor("#ff00ae")
          .setTitle("Warned members")
          .setDescription(
            "This is a list of all the warned members and how many warnings they've got"
          )
          .addFields([
            {
              name: "Name",
              value: `${names.map((name, index) => `${name}`).join("\n")}`,
              inline: true,
            },
            {
              name: "Warnings",
              value: `${warningCounts
                .map((warningCount) => `${warningCount}`)
                .join("\n")}`,
              inline: true,
            },
          ]);
      }

      interaction.reply({
        embeds: [embedMessage],
      });
    } catch (error) {
      interaction.reply("Something went wrong, check out the logs");
    }
  },
};
