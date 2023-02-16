import { Dirent, readdirSync } from "fs";
import minimatch from "minimatch";
import { resolve } from "path";

/** 递归同步读取目录文件 */
export const readDirSyncRecursive = <T extends boolean = false>(
  dirPath: string,
  options: { ignoreGlobs?: string[]; withDirs?: T } = {}
): T extends true ? [string, Dirent][] : string[] => {
  const { ignoreGlobs, withDirs } = options;
  const traverse = (
    paths: [string, Dirent],
    store: Map<string, [string, Dirent]>
  ) => {
    const [path, dirent] = paths;
    if (dirent.isDirectory()) {
      if (withDirs) store.set(path, [path, dirent]);
      const dirs = readdirSync(path, {
        encoding: "utf-8",
        withFileTypes: true,
      }).filter((it) => !ignoreGlobs?.some((p) => minimatch(it.name, p)));
      dirs.forEach((it) => {
        const nextPath = resolve(path, it.name);
        traverse([nextPath, it], store);
      });
    } else {
      store.set(path, [path, dirent]);
    }
  };
  const store: Map<string, [string, Dirent]> = new Map();
  traverse([dirPath, { isDirectory: () => true, name: "" } as any], store);
  return withDirs
    ? Array.from(store.values())
    : (Array.from(store.keys()) as any);
};

export default readDirSyncRecursive;
