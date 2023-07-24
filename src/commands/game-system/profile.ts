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
    .setDescription("This command will show you your profile"),

  async execute(interaction: ChatInputCommandInteraction) {
    const displayName =
      (interaction.member as GuildMember).nickname || interaction.user.username;

    const doesUserExist = await User.exists({
      username: interaction.user.username,
    });
    let user: IUser;
    if (!doesUserExist)
      user = await createAnEmptyUser({
        username: interaction.user.username,
        avatar: interaction.user.avatarURL() || "",
        displayName: displayName || "unknown",
      });
    else
      user = (await User.findOne({
        username: interaction.user.username,
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
  },
};
