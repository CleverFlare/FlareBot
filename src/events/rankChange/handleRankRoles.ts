import {
  ChatInputCommandInteraction,
  GuildMemberRoleManager,
  Message,
} from "discord.js";
import RankRoles from "../../models/RankRoles";
import { IUser } from "../../models/User";
import { User } from "../interactionCreate/handleCommands";
import { ranks } from "../../data/ranks";

export default async function (
  client: User,
  user: IUser,
  interaction: ChatInputCommandInteraction | Message
) {
  const rankRoles = await RankRoles.find();

  if (!rankRoles.length) return;

  await (interaction.member?.roles as GuildMemberRoleManager).remove(
    rankRoles.map((rankRole) => rankRole.role)
  );

  const newRankRoleName = ranks[user.rank].name;

  const newRankRoleId = rankRoles.find(
    (rankRole) => rankRole.rank === newRankRoleName
  )?.role;

  await (interaction.member?.roles as GuildMemberRoleManager).add(
    newRankRoleId
  );

  interaction.reply(
    `You have just ranked up! and got <@&${newRankRoleId}>!! :partying_face: :tada:`
  );
}
