import { codeSandBoxParser } from "./parser";
import sandboxSVG from "./sandboxSVG";

import type { CodeOperatorArea } from "../../";
export interface CodeSandBoxPluginOptions {
  enable?: boolean;
  /** 允许的语言 */
  enableLangs?: string[];
  tooltips?: string | ((lang: string) => string);
}

export const CodeSandBoxExtension = ({
  enable = true,
  enableLangs = ["JS", "javascript", "react", "vue", "ts", "TypeScript", "jsx"],
  tooltips = "在 CodeSandBox 中打开",
}: CodeSandBoxPluginOptions = {}): CodeOperatorArea.Extension | undefined => {
  if (!enable) return;
  return {
    activeLangs: enableLangs,
    render(md, ctx) {
      const { tokens, idx, env, self } = ctx;
      const info = tokens[idx]?.info;
      if (!/codesandbox\s*=/.test(info)) return;
      const sandboxMeta = info?.match(/codesandbox\s*=([^&]+)/)?.[1] ?? "";
      const { url } = codeSandBoxParser(sandboxMeta.trim(), ctx) ?? {};
      return {
        tooltips,
        href: url,
        icon: { type: "content", value: sandboxSVG() },
      };
    },
  };
};
