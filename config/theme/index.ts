import { defineConfigWithTheme } from 'vitepress';
import { DefaultTheme } from 'vitepress/theme';

import nav from './nav';
import sidebar from './sidebar';

export default defineConfigWithTheme<DefaultTheme.Config>({
  themeConfig: {
    siteTitle: "Danker 学习笔记",
    lastUpdatedText: "最近更新时间",
    outline: {
      label: "文章目录",
      level: [2, 6],
    },
    outlineBadges: false,
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    nav: nav,
    sidebar: sidebar,
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
