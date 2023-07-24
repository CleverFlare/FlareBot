import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import RankRoles from "../../models/RankRoles";
import { ranks } from "../../data/ranks";

export default {
  data: new SlashCommandBuilder()
    .setName("add-ranks-roles")
    .setDescription(
      "Add the roles which will be assigned for reaching certain ranks"
    )
    .addRoleOption((option) =>
      option
        .setName("rookie")
        .setDescription("Add role for the Rookie rank")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("talented")
        .setDescription("Add role for the Apprentice rank")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("skilled")
        .setDescription("Add role for the Skilled rank")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("exceptional")
        .setDescription("Add role for the Exceptional rank")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("elite")
        .setDescription("Add role for the Elite rank")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await RankRoles.create(
      {
        rank: ranks[0].name,
        role: interaction.options.get("rookie")!.value,
      },
      {
        rank: ranks[1].name,
        role: interaction.options.get("talented")!.value,
      },
      {
        rank: ranks[2].name,
        role: interaction.options.get("skilled")!.value,
      },
      {
        rank: ranks[3].name,
        role: interaction.options.get("exceptional")!.value,
      },
      {
        rank: ranks[4].name,
        role: interaction.options.get("elite")!.value,
      }
    );
    interaction.reply("The rank roles have been set successfully");
  },
};
