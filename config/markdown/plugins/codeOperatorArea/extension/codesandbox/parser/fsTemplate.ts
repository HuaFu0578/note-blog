import {
  getMainFile,
  getTemplate,
} from "codesandbox-import-utils/lib/create-sandbox/templates";
import { readFileSync } from "fs";
import path, { basename, isAbsolute, relative, resolve } from "path";

import { readDirSyncRecursive } from "../../../../../../../utils/readDirSyncRecursive";

import type { TemplateInfo } from ".";
export type EntryType = ReturnType<typeof getMainFile>;

function fsTemplate(directoryPath: string, rootPath: string): TemplateInfo {
  let absDirectoryPath;

  if (isAbsolute(directoryPath)) {
    absDirectoryPath = directoryPath;
  } else if (!rootPath) {
    throw new Error(
      "No rootPath provided, are you running on a non-remark environment?"
    );
  } else {
    absDirectoryPath = resolve(rootPath, directoryPath);
  }

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

  const filePaths = readDirSyncRecursive(absDirectoryPath, { ignoreGlobs });

  const files: TemplateInfo["files"] = {};

  for (const filePath of filePaths) {
    const relativePath = relative(absDirectoryPath, filePath);
    // CodeSandbox expects posix path
    const posixRelativePath = toPosixPath(relativePath);
    files[posixRelativePath] = {
      isBinary: false,
      content: readFileSync(filePath, { encoding: "utf8" }),
    };
  }

  if (!files["package.json"]) {
    throw new Error(
      'No "package.json" found, it\'s required to be used with file templates.'
    );
  }

  const packageJSON = JSON.parse((files["package.json"] as any).content);

  const templateName = getTemplate(packageJSON, files);
  const entry = getMainFile(templateName!);

  return {
    files,
    entry,
    title: basename(absDirectoryPath),
  };
}

function toPosixPath(pathString: string) {
  return pathString.split(path.sep).join(path.posix.sep);
}

export default fsTemplate;
