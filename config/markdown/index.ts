import type { MarkdownOptions } from "vitepress";
import { CodeSandBoxPlugin } from "./plugins/codesandbox";

export default {
  theme: "material-theme-palenight",
  lineNumbers: true,
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true,
  config(md) {
    md.use(CodeSandBoxPlugin);
  },
} as MarkdownOptions;
