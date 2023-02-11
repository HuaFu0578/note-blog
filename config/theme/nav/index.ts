import type { DefaultTheme } from "vitepress";
const pkg = require("../../../package.json");

export default [
  {
    text: "模块分类",
    items: [
      { text: "知识库", link: "/knowledge/" },
      { text: "面试专题", link: "/knowledge/interview/" },
      { text: "生活", link: "/life/" },
    ],
  },
  { text: pkg.version, link: "" },
] as DefaultTheme.NavItem[];
