import { Dirent, readdirSync } from "fs";
import minimatch from "minimatch";
import { resolve } from "path";

/** 递归同步读取目录文件 */
export function readDirSyncRecursive(
  dirPath: string,
  options: { ignoreGlobs?: string[]; withDirs?: boolean } = {}
) {
  const { ignoreGlobs, withDirs = false } = options;
  const traverse = (paths: [string, Dirent], store: string[]) => {
    const [path, dirent] = paths;
    if (dirent.isDirectory()) {
      if (withDirs) store.push(path);
      const dirs = readdirSync(path, {
        encoding: "utf-8",
        withFileTypes: true,
      }).filter((it) => !ignoreGlobs?.some((p) => minimatch(it.name, p)));
      dirs.forEach((it) => {
        const nextPath = resolve(path, it.name);
        traverse([nextPath, it], store);
      });
    } else {
      store.push(path);
    }
  };
  const store: string[] = [];
  traverse([dirPath, { isDirectory: () => true, name: "" } as any], store);
  return Array.from(new Set(store));
}

export default readDirSyncRecursive;
