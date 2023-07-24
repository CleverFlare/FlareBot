import {
  APIInteractionGuildMember,
  ChatInputCommandInteraction,
  GuildMember,
  Message,
} from "discord.js";
import RankRoles from "../models/RankRoles";
import { IUser } from "../models/User";
import { rankUps, ranks } from "../data/ranks";

export default async function (user: IUser, member: GuildMember) {
  const rankRoles = await RankRoles.find();

  for (const rank of rankUps) {
    const matchEnglish = rank.levels.english <= user!.levels.english!;
    const matchHelp = rank.levels.help <= user!.levels.help!;
    const matchActive = rank.levels.active <= user!.levels.active!;

    if (matchEnglish && matchHelp && matchActive) {
      user!.rank = rank.rank;

      if (!rankRoles.length) return;

      for (const rankRole of rankRoles) {
        const roleById = member.guild.roles.cache.get(rankRole.role);
        if (member?.roles.cache.some((role) => role.name === roleById!.name))
          member?.roles.remove(rankRole.role);
      }
    }
  }

  const rankName = ranks[user!.rank].name;

  member?.roles.add(
    rankRoles!.find((rankRole) => (rankRole!.rank as string) === rankName!)!
      .role
  );
}
