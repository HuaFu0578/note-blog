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
  footer: {
    message: "Danker 个人笔记站点",
    copyright: `Copyright © ${new Date().getFullYear()}-present Danker`,
  },
  algolia: {
    appId: "DN0SK7UQY1",
    apiKey: "f62888ddc77684b696046411873f94f2",
    indexName: "danker_notes_blog_index",
    placeholder: "请输入关键词",
    translations: {
      button: { buttonText: "搜索" },
    },
  },
} as DefaultTheme.Config;
