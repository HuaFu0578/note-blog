import { defineConfig, type UserConfig } from "vitepress";
import viteConfig from "./vite.config";
import theme from "./theme";
import markdown from "./markdown";
import headInjection from "../headInjection";
export default defineConfig({
  lang: "zh-CN",
  base: "/notes",
  title: "Danker 笔记",
  description: "学习笔记整理与记录",
  cleanUrls: true,
  lastUpdated: true,
  outDir: "./dist/notes",
  srcDir: "./docs",
  vite: viteConfig as UserConfig,
  head: headInjection,
  themeConfig: theme,
  markdown: markdown,
});
