import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import RanksRoles from "../models/ranks-roles";
import { ranks } from "../ranks";
import RanksRoles from "../models/ranks-roles";

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
        .setName("apprentice")
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
    const rankRoles = await RanksRoles.find();
    RanksRoles.create([
      {
        rank: ranks[0].name,
        role: interaction.options.get("rookie")!.role,
      },
      {
        rank: ranks[1].name,
        role: interaction.options.get("apprentice")!.role,
      },
      {
        rank: ranks[2].name,
        role: interaction.options.get("skilled")!.role,
      },
      {
        rank: ranks[3].name,
        role: interaction.options.get("exceptional")!.role,
      },
      {
        rank: ranks[4].name,
        role: interaction.options.get("elite")!.role,
      },
    ]);
    interaction.reply("The rank roles have been set successfully");
  },
};
