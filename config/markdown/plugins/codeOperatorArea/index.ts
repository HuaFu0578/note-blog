import type MarkdownIt from "markdown-it";

import { load } from "cheerio";

import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import moreDomStr from "./moreDomStr";

export namespace CodeOperatorArea {
  export interface Options {
    /** 操作配置，例如按钮 */
    operators: Extension[];
  }
  export interface Extension {
    /** 扩展类型 */
    type?: "button" | "checkbox";
    icon?:
      | string
      | {
          type: "url" | "content";
          value: string;
        };
    /** 扩展图标宽度 */
    width?: number;
    className?: string;
    href?: string;
    /** a 链接的 target 属性 */
    linkTarget?: string;
    /** 匹配激活语言 */
    matchLang: (RegExp | string)[];
    render(
      rawCode: string,
      md: MarkdownIt,
      ctx: CodeSandBoxFenceContext
    ): string | void;
  }
}

export interface CodeSandBoxFenceContext {
  tokens: Token[];
  idx: number;
  options: MarkdownIt.Options;
  env: any;
  self: Renderer;
}
/** 默认每个扩展宽度 */
const DEFAULT_ITEM_WIDTH = 40;

/** 提供操作代码的扩展能力区域 */
export const CodeOperatorAreaPlugin = (
  md: MarkdownIt,
  { operators }: CodeOperatorArea.Options = {} as CodeOperatorArea.Options
) => {
  if (!operators?.length) return;
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);
    const lang = load(rawCode)("span.lang").text();
    const matchedOperators = operators?.filter((it) =>
      it?.matchLang?.some((reg) => new RegExp(reg).test(lang))
    );
    if (!matchedOperators?.length) return rawCode;
    const [tokens, idx, opt, env, self] = args;
    const ctx = { tokens, idx, options: opt, env, self };
    const extensionCode = matchedOperators?.reduce(
      (code, op) => op?.render(code, md, ctx) ?? code,
      rawCode
    );
    const extensionWidth = matchedOperators.reduce(
      (sum, it) => (sum += it.width ?? DEFAULT_ITEM_WIDTH),
      20
    );
    const extensionIconHTML = matchedOperators
      .map((it) => {
        const transTypeStr = (value: string, it: CodeOperatorArea.Extension) =>
          it?.href
            ? `<a href="${it?.href}" target='${
                it?.linkTarget ?? "_blank"
              }'>${value}</a>`
            : value;
        const iconStr =
          typeof it?.icon === "string"
            ? `<img src='${it?.icon}'/>`
            : it?.icon?.type === "url"
            ? `<img src='${it?.icon?.value}'/>`
            : it?.icon?.value ?? "";
        return `<div class='item ${it?.className ?? ""}' ${
          it?.width ? `style='width:${it?.width}px'` : ""
        }>${transTypeStr(iconStr, it)}</div>`;
      })
      .join("");
    const moreHTML = moreDomStr({
      width: `${extensionWidth}px`,
      children: extensionIconHTML,
    });
    const $ = load(extensionCode);
    const root = $(`div.language-${lang}`);
    $(moreHTML).insertBefore(root.children().first());
    const finalCode = $.html(root);
    return finalCode;
  };
};
