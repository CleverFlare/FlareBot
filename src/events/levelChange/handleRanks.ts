import { IUser } from "../../models/User";
import { rankUps } from "../../data/ranks";
import { User as UserType } from "../interactionCreate/handleCommands";
import { ChatInputCommandInteraction, Message } from "discord.js";

export default async function (
  client: UserType,
  user: IUser,
  interaction: ChatInputCommandInteraction | Message
) {
  const oldRank = user.rank;
  for (const rankUp of rankUps) {
    const levelsEntries = Object.entries(rankUp.levels);

    let isRankup;

    for (const levelEntry of levelsEntries) {
      const [criterion, value] = levelEntry;

      const doesCriterionMeet = user.levels[criterion] >= value;

      if (doesCriterionMeet) isRankup = true;
      else isRankup = false;
    }

    if (isRankup) user.rank = rankUp.rank;
  }

  const newRank = user.rank;

  if (oldRank !== newRank)
    interaction.client.emit("rankChange", user, interaction);

  await user.save();
}
