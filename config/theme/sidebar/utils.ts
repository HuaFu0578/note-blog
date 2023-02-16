import readDirSyncRecursive from "../../../utils/readDirSyncRecursive";
import { relative, resolve } from "path";
import type { Dirent } from "fs";

const ignoreGlobs = [
  ".gitignore",
  "*.log",
  ".DS_Store",
  "node_modules",
  "package-lock.json",
  "yarn.lock",
  ".yarn",
  ".pnp.js",
  ".cache",
];

const EndExtReg = /(\.[^.]+)$/;

export type FileDirent = [string, Dirent];

export interface PageRoutesOptions {
  includeExt?: (string | RegExp)[];
  withExt?: boolean;
  onlyFiles?: boolean;
  ignoreGlobs?: string[];
}
/** 递归获取页面路由 */
export const getPagesRoutesRecursive = (
  relativePath: string,
  options: PageRoutesOptions = {}
): FileDirent[] => {
  const {
    includeExt = [/\.md$/],
    withExt = false,
    onlyFiles = true,
    ignoreGlobs: ignores = ["...", "index.md"],
  } = options;
  const docsPath = resolve(__dirname, "../../../docs");
  const workPath = resolve(docsPath, relativePath);
  const computedIgnores = Array.from(
    ignores.reduce((set, it) => {
      if (it.includes("...")) {
        ignoreGlobs.forEach((i) => set.add(i));
        return set;
      }
      set.add(it);
      return set;
    }, new Set<string>())
  );
  const files = readDirSyncRecursive(workPath, {
    ignoreGlobs: computedIgnores,
    withDirs: true,
  });
  const relativeFiles = files.map<FileDirent>(([file, all]) => [
    relative(docsPath, file).replace(/^[/]*/, "/"),
    all,
  ]);
  const finalFiles = relativeFiles
    .filter(([file]) => includeExt.some((ext) => new RegExp(ext).test(file)))
    .filter(([, dirent]) => (onlyFiles ? !dirent.isDirectory() : true))
    .map<FileDirent>((it) => {
      if (withExt) return it;
      it[0] = it[0].replace(EndExtReg, "");
      it[1].name = it[1].name.replace(EndExtReg, "");
      return it;
    });
  return finalFiles;
};

/** 将文件转路由 */
export const fileToRoutes = (files: FileDirent[]) => {
  const routes = files
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .reduce((arr, [file, dirent]) => {
      arr.push({ text: dirent.name, link: file });
      return arr;
    }, [] as Record<string, any>[]);
  return routes;
};

export const getRouteFromPath = (
  relDocPath: string,
  options?: PageRoutesOptions
): Record<string, { text: string; link: string }>[] => {
  return fileToRoutes(getPagesRoutesRecursive(relDocPath, options));
};
