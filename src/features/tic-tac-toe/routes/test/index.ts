import { EmbedBuilder } from "discord.js";
import { Route } from "../../router";

const testRoute: Route = () => {
  const confirmationEmbed = new EmbedBuilder()
    .setTitle("Test Screen")
    .setDescription("Is everything working alright?");

  return {
    reply: {
      content: "",
      embeds: [confirmationEmbed],
      components: [],
    },
  };
};

export default testRoute;
