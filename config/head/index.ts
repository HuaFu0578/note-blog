import { readFileSync } from "fs";
import { resolve } from "path";

import { isProdEnv } from "../../utils/env";
import readDirSyncRecursive from "../../utils/readDirSyncRecursive";

import type { HeadConfig } from "vitepress";
function getFiles() {
  const dirsMap = {
    css: {
      path: resolve(__dirname, "css"),
      resolver: (content: string, file: string) => {
        return [
          "style",
          { type: "text/css", ...(!isProdEnv && { "data-vite-dev-id": file }) },
          content,
        ];
      },
    },
    js: {
      path: resolve(__dirname, "js"),
      resolver: (content: string, file: string) => {
        return [
          "script",
          { type: "module", ...(!isProdEnv && { "data-vite-dev-id": file }) },
          content,
        ];
      },
    },
  };

  return Object.entries(dirsMap).reduce((arr, [key, config]) => {
    const files = readDirSyncRecursive(config.path);
    const result = files?.map((filename) => {
      const file = resolve(config.path, filename);
      const content = readFileSync(file, { encoding: "utf-8" });
      return config.resolver(content, file);
    });
    return arr.concat(result);
  }, [] as any[]);
}

export default [...getFiles()] as HeadConfig[];
