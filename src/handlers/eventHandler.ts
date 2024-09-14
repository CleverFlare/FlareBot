import { Client } from "discord.js";
import getAllFiles from "@/utils/get-all-files";
import { join } from "path";

export default function (client: Client) {
  // get all the event folders in an array
  const eventFolders = getAllFiles(join(__dirname, "..", "events"), true);

  // iterate over the event folders array
  for (const eventFolder of eventFolders) {
    // get all event files within each event folder in an array
    const eventFiles = getAllFiles(eventFolder);

    // sort files
    eventFiles.sort((a: string, b: string) => (a > b ? 1 : -1));

    // extract the event name from the folder
    const eventName = eventFolder.replace(/\\/gi, "/").split("/").pop();

    // listen to the event and execute the functions found in the event files
    client.on(eventName as string, async (...args) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile).default;
        await eventFunction(client, ...args);
      }
    });
  }
}
