import type { DefaultTheme } from "vitepress";

export default [
  {
    text: "前端",
    collapsible: true,
    items: [
      {
        text: "设计模式",
        link: "/knowledge/frontend/设计模式",
      },
      {
        text: "数据结构和算法",
        link: "/knowledge/frontend/数据结构与算法",
      },
      {
        text: "网络相关",
        link: "/knowledge/frontend/网络相关",
      },
      {
        text: "微信小程序",
        link: "/knowledge/frontend/微信小程序",
      },
      {
        text: "移动端适配",
        link: "/knowledge/frontend/移动端适配",
      },
      {
        text: "ES6",
        link: "/knowledge/frontend/es6",
      },
      {
        text: "git 版本控制系统",
        link: "/knowledge/frontend/git版本控制系统",
      },
      {
        text: "react",
        link: "/knowledge/frontend/react",
      },
      {
        text: "typescript",
        link: "/knowledge/frontend/typescript",
      },
      {
        text: "vue",
        link: "/knowledge/frontend/vue",
      },
      {
        text: "webpack",
        link: "/knowledge/frontend/webpack",
      },
      {
        text: "知识回顾",
        link: "/knowledge/frontend/知识回顾",
      },
    ],
  },
  {
    text: "后端",
    collapsible: true,
    collapsed: true,
    items: [
      {
        text: "linux",
        link: "/knowledge/backend/linux",
      },
    ],
  },
] as DefaultTheme.Sidebar;
