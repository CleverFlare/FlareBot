import { Message } from "discord.js";
import { User as UserType } from "../interactionCreate/handleCommands";
import User, { IUser } from "../../models/User";
import { createAnEmptyUser } from "../../utils/db";
import RankRoles from "../../models/RankRoles";
import { rankUps } from "../../data/ranks";
import ranking from "../../utils/ranking";

export default async function (client: UserType, interaction: Message) {
  if (interaction.author.bot) return;
  if (!/[a-zA-Z]+/gi.test(interaction.content)) return;

  let user: IUser | null = await User.findOne({
    username: interaction.author.username,
  });

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

  await (user as any).save();

  interaction.client.emit("levelChange", user, interaction);
}
