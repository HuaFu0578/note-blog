import type { MarkdownOptions } from "vitepress";
import { CodeOperatorAreaPlugin } from "./plugins/CodeOperatorArea";
import { CodeSandBoxExtension } from "./plugins/CodeOperatorArea/extension/codesandbox";
import { MermaidPlugin } from "./plugins/MermaidPlugin";

import type { CodeOperatorArea } from "./plugins/CodeOperatorArea";
export default {
  theme: "material-theme-palenight",
  lineNumbers: true,
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true,
  config(md) {
    md.use(CodeOperatorAreaPlugin, {
      extensions: [CodeSandBoxExtension],
    } as CodeOperatorArea.Options).use(MermaidPlugin);
  },
} as MarkdownOptions;
