import { Client, GuildMember } from "discord.js";
import RankRoles from "../../models/RankRoles";

export default async function (client: Client, interaction: GuildMember) {
  const rankRoles = await RankRoles.find();

  if (!rankRoles.length) return;

  const roleExists = interaction.guild?.roles.cache.find(rankRoles[0].role);

  if (roleExists) await interaction.roles.add(rankRoles[0].role);
  else console.log("Couldn't assign the role to the member");
}
