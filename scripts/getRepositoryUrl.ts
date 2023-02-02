import { exec, execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { EOL } from "os";
import { resolve } from "path";

/** 获取 git 仓库地址 */
export default function (
  path: string = __dirname,
  keyword: string = "github.com"
) {
  const reg = new RegExp(`(.*(https://${keyword}/|git@${keyword}:)(.*\\.git))`);
  const pkgPath = resolve(path, "./package.json");
  const isExistPkg = existsSync(pkgPath);

  if (isExistPkg) {
    const pkg = JSON.parse(readFileSync(pkgPath, { encoding: "utf-8" }));
    const url = pkg.repository.url;
    const repo = url?.replace(reg, `https://${keyword}/$3`);
    if (repo) return repo;
  }

  const stdout = execSync(
    `cd ${path} && git remote -v |grep ${keyword}|grep push`,
    { encoding: "utf-8" }
  );
  if (stdout) {
    const remotes = stdout
      .split(EOL)
      .map((it) => it.split(/\s+/))
      .filter((it) => it.length > 1);

    const repo = remotes
      .find((it) => it?.[1]?.match(reg))?.[1]
      ?.replace(reg, `https://${keyword}/$3`);
    if (repo) return repo;
  }
}
