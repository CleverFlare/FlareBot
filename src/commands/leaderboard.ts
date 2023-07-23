import { SlashCommandBuilder, Message, EmbedBuilder } from "discord.js";
import { ranks } from "../ranks";
import User, { IUser } from "../models/user";

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("This command will show you the leaderboard"),

  async execute(interaction: Message) {
    const users = await User.find();
    users.sort((a, b) => {
      const englishCondition = a.levels.english > b.levels.english;
      const helpCondition = a.levels.help > b.levels.help;
      const activeCondition = a.levels.active > b.levels.active;
      if (englishCondition && helpCondition && activeCondition) return -1;
      return 1;
    });
    let usersNames: string[] = [];
    let usersRanks: number[] = [];

    users.map((user: IUser) => {
      usersNames.push(user.name);
      usersRanks.push(user.rank);
    });

    // build the embed message
    const embedMessage = new EmbedBuilder()
      .setColor("#ff00ae")
      .setTitle(":bar_chart: Ranking Leaderboard")
      .setDescription(
        "If you don't see yourself in the leaderboard you're most likely haven't sent a single message in the server"
      )
      .addFields([
        {
          name: "Name",
          value: `${usersNames
            .map((name, index) => `\`#${index + 1}\` ${name}`)
            .join("\n")}`,
          inline: true,
        },
        {
          name: "Rank",
          value: `${usersRanks
            .map((rank) => `${ranks[rank].name}`)
            .join("\n")}`,
          inline: true,
        },
      ]);

    // send the embed message
    await interaction.reply({
      embeds: [embedMessage],
    });
  },
};
