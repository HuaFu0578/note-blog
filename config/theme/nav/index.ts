import type { DefaultTheme } from "vitepress";
const pkg = require("../../../package.json");

export default [
  {
    text: "模块分类",
    items: [
      { text: "知识总结", link: "/knowledge/" },
      { text: "面试专题", link: "/knowledge/interview/" },
      { text: "品茗生活", link: "/life/" },
      { text: "开卷有益", link: "/books/" },
    ],
  },
  { text: pkg.version, link: "" },
] as DefaultTheme.NavItem[];
