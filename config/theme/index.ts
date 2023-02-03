import getRepositoryUrl from "../../scripts/getRepositoryUrl";
import nav from "./nav";
import sidebar from "./sidebar";

import type { DefaultTheme } from "vitepress/theme";

const repositoryUrl = getRepositoryUrl(process.cwd());

export default {
  siteTitle: "Danker 笔记",
  lastUpdatedText: "最近更新时间",
  outline: {
    label: "文章目录",
    level: [2, 6],
  },
  outlineBadges: true,
  docFooter: {
    prev: "上一篇",
    next: "下一篇",
  },
  nav: nav,
  sidebar: sidebar,
  editLink: {
    pattern: "https://github.com/HuaFu0578/note-blog/edit/master/docs/:path",
    text: "在 GitHub 页面编辑此页",
  },
  socialLinks: [{ icon: "github", link: repositoryUrl }],
} as DefaultTheme.Config;
