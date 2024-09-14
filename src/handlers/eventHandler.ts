import { Client } from "discord.js";
import getAllFiles from "@/utils/get-all-files";
import { join } from "path";

export default function (client: Client) {
  const eventFolders = getAllFiles(join(__dirname, "..", "events"), true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a: string, b: string) => (a > b ? 1 : -1));
    const eventName = eventFolder.replace(/\\/gi, "/").split("/").pop();

    client.on(eventName as string, async (...args) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile).default;
        await eventFunction(client, ...args);
      }
    });
  }
}
