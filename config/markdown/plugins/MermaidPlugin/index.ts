import { load } from "cheerio";
import type MarkdownIt from "markdown-it";

export namespace Mermaid {
  export interface Options {}
}

const mermaidReg = /mermaid/i;

export const MermaidPlugin = (
  md: MarkdownIt,
  {}: Mermaid.Options = {} as any
) => {
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);
    const $ = load(rawCode);
    const lang = $("span.lang").text();
    const root = $(`div.language-${lang}`);
    if (!mermaidReg.test(lang)) return rawCode;
    const [tokens, idx] = args;
    const content = tokens?.[idx]?.content;
    const MermaidVueComponent = `<MermaidPlugin>${content}</MermaidPlugin>`;
    root.after(MermaidVueComponent);
    const finalCode = root.parent().html() ?? "";
    return finalCode;
  };
};
