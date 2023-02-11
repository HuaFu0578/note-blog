import type MarkdownIt from "markdown-it";

import { load } from "cheerio";

import { codeSandBoxParser } from "./parser";
import sandboxHtml from "./sandboxHtml";
import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";

export interface CodeSandBoxPluginOptions {
  enable?: boolean;
  /** 允许的语言 */
  enableLangs?: string[];
  btnToolTips?: string | ((lang: string) => string);
}

export interface CodeSandBoxFenceContext {
  tokens: Token[];
  idx: number;
  options: MarkdownIt.Options;
  env: any;
  self: Renderer;
}

export const CodeSandBoxPlugin = (
  md: MarkdownIt,
  options: CodeSandBoxPluginOptions = {
    enable: true,
    enableLangs: [
      "JS",
      "javascript",
      "react",
      "vue",
      "ts",
      "TypeScript",
      "jsx",
    ],
    btnToolTips: "在 CodeSandBox 中打开",
  }
) => {
  if (!options.enable) return;
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);
    const { enableLangs, btnToolTips } = options;
    const [tokens, idx, opt, env, self] = args;
    const info = tokens[idx]?.info;
    if (!/codesandbox\s*=/.test(info)) return rawCode;
    const $ = load(rawCode);
    const lang = $("span.lang").text();
    const root = $(`div.language-${lang}`);
    const langsReg = enableLangs?.map?.((it) => new RegExp(`^${it}$`, "i"));
    const isMatchedLangs = langsReg?.some?.((it) => it?.test(lang));
    if (!isMatchedLangs) return rawCode;
    const toolTips =
      typeof btnToolTips === "function" ? btnToolTips(lang) : btnToolTips;

    const sandboxMeta = info?.match(/codesandbox\s*=([^&]+)/)?.[1] ?? "";
    const { url } =
      codeSandBoxParser(sandboxMeta.trim(), {
        tokens,
        idx,
        options: opt,
        env,
        self,
      }) ?? {};
    root.append(sandboxHtml({ title: toolTips, href: url }));
    const finalCode = $.html(root);
    return finalCode;
  };
};
