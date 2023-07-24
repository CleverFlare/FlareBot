import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import User from "../../models/User";
import ranking from "../../utils/ranking";

export default {
  data: new SlashCommandBuilder()
    .setName("level-up")
    .setDescription("Level up a member in the server")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to level up")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("english").setDescription("Level up english")
    )
    .addIntegerOption((option) =>
      option.setName("help").setDescription("Level up help")
    )
    .addIntegerOption((option) =>
      option.setName("active").setDescription("Level up active")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.options.get("member");
    const englishLevel = interaction.options.get("english")?.value;
    const helpLevel = interaction.options.get("help")?.value;
    const activeLevel = interaction.options.get("active")?.value;
    const memberProfile = await User.findOne({
      username: member!.user?.username,
    });

    if (!memberProfile) {
      interaction.reply(
        "This user doesn't have a profile yet, they must do something in the server in order to create a profile for them"
      );
      return;
    }

    if (englishLevel) memberProfile.levels.english += Number(englishLevel);
    if (helpLevel) memberProfile.levels.help += Number(helpLevel);
    if (activeLevel) memberProfile.levels.active += Number(activeLevel);

    await memberProfile.save();

    interaction.client.emit("levelChange", memberProfile, interaction);

    interaction.reply(`<@${member?.user?.id}> was leveled up! :rocket:`);
  },
};
