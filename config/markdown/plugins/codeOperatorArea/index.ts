import type MarkdownIt from "markdown-it";

import { load } from "cheerio";

import type Token from "markdown-it/lib/token";
import type Renderer from "markdown-it/lib/renderer";
import moreDomStr from "./moreDomStr";

type OptionalFn<T> = T | ((...args: any) => T);

export namespace CodeOperatorArea {
  export interface Options {
    /** 操作配置，例如按钮 */
    extensions: (
      | OptionalFn<Extension | undefined>
      | [OptionalFn<Extension | undefined>, Record<string, any>]
    )[];
  }

  export interface ExtensionReturn {
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
    /** 鼠标 hover 提示 */
    tooltips?: string | ((lang: string) => string);
    /** 按钮的超链接地址 */
    href?: string;
    /** a 链接的 target 属性，默认 _blank */
    linkTarget?: string;
    /** 返回的代码片段，会自动处理，一般不需要手动指定，也不建议手动指定，
     * 这个属性主要是为了特殊需求场景
     *  */
    code?: string;
  }
  export interface Extension {
    /** 匹配激活语言 */
    activeLangs: (RegExp | string)[];
    render(
      md: MarkdownIt,
      ctx: CodeSandBoxFenceContext,
      rawCode?: string
    ): ExtensionReturn | void | undefined;
  }
}
/** 将兼容参数对齐 */
const align = <T = any>(
  value: (OptionalFn<T> | [OptionalFn<T>, Record<string, any>])[]
): [T, Record<string, any>][] => {
  return (
    value?.map?.((item) => {
      const [it, params] = Array.isArray(item) ? item : [item, {}];
      if (typeof it === "function") {
        return [(it as Function)(params), params];
      }
      return [it, params];
    }) as [T, Record<string, any>][]
  )?.filter(([it]) => it);
};

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
  { extensions }: CodeOperatorArea.Options = {} as CodeOperatorArea.Options
) => {
  if (!extensions?.length) return;
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);
    const lang = load(rawCode)("span.lang").text();

    const matchedOperators = align<CodeOperatorArea.Extension | undefined>(
      extensions
    )?.filter(([it]) => {
      return it?.activeLangs?.some((reg) => new RegExp(reg).test(lang));
    });
    if (!matchedOperators?.length) return rawCode;
    const [tokens, idx, opt, env, self] = args;
    const ctx = { tokens, idx, options: opt, env, self };
    const [extensionCode, extensionResults] = matchedOperators?.reduce<
      [string, CodeOperatorArea.ExtensionReturn[]]
    >(
      ([code, results], [extension]) => {
        const res =
          extension?.render(md, ctx, code) ??
          ({ code } as CodeOperatorArea.ExtensionReturn);
        results.push(res);
        return [res?.code ?? code, results];
      },
      [rawCode, []]
    );
    const extensionWidth = extensionResults.reduce(
      (sum, it) => (sum += it?.width ?? DEFAULT_ITEM_WIDTH),
      20
    );
    const extensionIconHTML = extensionResults
      .map((it) => {
        const transTypeStr = (value: string, item: typeof it) =>
          item?.href
            ? `<a href="${item?.href}" target='${
                item?.linkTarget ?? "_blank"
              }'>${value}</a>`
            : value;

        const transTooltips = () => {
          const tips =
            typeof it?.tooltips === "function"
              ? it?.tooltips(lang)
              : it?.tooltips;
          return it?.tooltips ? `title='${tips}'` : "";
        };
        const iconStr =
          typeof it?.icon === "string"
            ? `<img src='${it?.icon}'/>`
            : it?.icon?.type === "url"
            ? `<img src='${it?.icon?.value}'/>`
            : it?.icon?.value ?? "";
        return `<div class='item ${it?.className ?? ""}' 
        ${it?.width ? `style='width:${it?.width}px'` : ""}
        ${transTooltips()}
        >${transTypeStr(iconStr, it)}</div>`;
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
