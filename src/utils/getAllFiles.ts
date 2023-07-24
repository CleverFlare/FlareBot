import { readdirSync } from "fs";
import { join } from "path";

export default function (directory: string, folderOnly = false) {
  const fileNames = [];

  const files = readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = join(directory, file.name);

    if (folderOnly) {
      if (file.isDirectory()) {
        fileNames.push(filePath);
      }
    } else {
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
}
