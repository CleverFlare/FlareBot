import { ChatInputCommandInteraction, Client } from "discord.js";
import confirmationRoute from "./routes/confirmation";
import { Router } from "./router";
import testRoute from "./routes/test";

export const router = new Router();

const routes = {
  confirmation: confirmationRoute,
  test: testRoute,
};

export type Routes = typeof routes;

export default async function (
  interaction: ChatInputCommandInteraction,
  client: Client,
) {
  router.createRouter<Routes>({
    routes,
    initialRoute: "confirmation",
    interaction,
    client,
  });
}
