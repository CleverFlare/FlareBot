import {
  SlashCommandBuilder,
  Message,
  EmbedBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  User as UserType,
} from "discord.js";
import { ranks } from "../../data/ranks";
import User, { IUser } from "../../models/User";
import { createAnEmptyUser } from "../../utils/db";

interface Member {
  username: string;
  name: string;
  avatar: string;
  levels: {
    english: string;
    help: string;
    active: string;
  };
  rank: number;
}

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("This command will show you your profile")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you wanna see their profile")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const userOption = interaction.options.get("user");

      const username = userOption?.user
        ? userOption.user.username
        : interaction.user.username;

      const nickname = userOption?.member
        ? (userOption.member as GuildMember).nickname
        : (interaction.member as GuildMember).nickname;

      const avatar = userOption?.user
        ? userOption.user.avatarURL()
        : interaction.user.avatarURL();

      const displayName = nickname || username;

      const doesUserExist = await User.exists({
        username: username,
      });
      let user: IUser;
      if (!doesUserExist)
        user = await createAnEmptyUser({
          username: username,
          avatar: avatar || "",
          displayName: displayName || "unknown",
        });
      else
        user = (await User.findOne({
          username: username,
        })) as IUser;
      // build the embed message
      const embedMessage = new EmbedBuilder()
        .setColor("#ff00ae")
        .setTitle(":sparkles: " + user.name + " Profile")
        .setDescription("Here are all your profile info")
        .setThumbnail(user.avatar)
        .setFields({
          name: "Skills",
          value: "Here are your current skills",
        })
        .addFields([
          {
            name: "English",
            value: `level: ${Math.floor(user.levels.english)}`,
            inline: true,
          },
          {
            name: "Help",
            value: `level: ${Math.floor(user.levels.help)}`,
            inline: true,
          },
          {
            name: "Active",
            value: `level: ${Math.floor(user.levels.active)}`,
            inline: true,
          },
        ])
        .addFields({
          name: "Rank",
          value: `${ranks[user.rank].icon} ${ranks[user.rank].name}`,
        })
        .setImage(ranks[user.rank].image);
      // send the embed message
      await interaction.reply({
        embeds: [embedMessage],
      });
    } catch (err) {
      interaction.reply("Something went wrong, check out the logs");
    }
  },
};
