import { ChatInputCommandInteraction, Message } from "discord.js";
import User, { IUser } from "../models/user";
import { createAnEmptyUser } from "../utils/db";
import RanksRoles, { IRanksRoles } from "../models/ranks-roles";

const levelsToRank = [
  {
    levels: { english: 30, help: 20, active: 60 },
    rank: 1,
  },
  {
    levels: { english: 60, help: 40, active: 120 },
    rank: 2,
  },
  {
    levels: { english: 100, help: 80, active: 200 },
    rank: 3,
  },
  {
    levels: { english: 200, help: 160, active: 400 },
    rank: 4,
  },
];

// Test:
// const levelsToRank = [
//   {
//     levels: { english: 1, help: 1, active: 1 },
//     rank: 1,
//   },
//   {
//     levels: { english: 2, help: 2, active: 2 },
//     rank: 2,
//   },
//   {
//     levels: { english: 3, help: 3, active: 3 },
//     rank: 3,
//   },
//   {
//     levels: { english: 4, help: 4, active: 4 },
//     rank: 4,
//   },
// ];

export default {
  async execute(interaction: Message) {
    if (!/[a-zA-Z]+/gi.test(interaction.content)) return;
    let user: IUser | null = await User.findOne({
      username: interaction.author.username,
    });

    const rankRoles = await RanksRoles.find();

    if (!user)
      user = await createAnEmptyUser({
        username: interaction.author.username,
        avatar: interaction.author.avatarURL() || "",
        displayName: interaction.member?.displayName || "unknown",
      });

    if (!user) return;

    user.levels.active += 0.1;
    user.levels.english += 0.3;
    if (interaction.channel!.type === 11) user!.levels.help += 1;

    levelsToRank.forEach((rank) => {
      const matchEnglish = rank.levels.english <= user!.levels.english!;
      const matchHelp = rank.levels.help <= user!.levels.help!;
      const matchActive = rank.levels.active <= user!.levels.active!;

      if (matchEnglish && matchHelp && matchActive) {
        user!.rank = rank.rank;
        if (!rankRoles.length) return;
        rankRoles.map((rankRole) => {
          if (
            interaction.member?.roles.cache.some(
              (role) => role.name === rankRole.role.name
            )
          )
            interaction.member?.roles.remove(rankRole.role);
        });

        interaction.member?.roles.add(rankRoles[user!.rank].role);
      }
    });

    await (user as any).save();
  },
};
