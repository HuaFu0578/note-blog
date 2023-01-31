import { DefaultTheme } from "vitepress";
import knowledge from "./knowledge";
import life from "./life";

export default {
  "/": [
    {
      text: "Guide1",
      items: [
        { text: "Introduction", link: "/introduction" },
        { text: "Getting Started", link: "/getting-started" },
      ],
    },
  ],
  '/knowledge/':knowledge,
  '/life/':life,
} as DefaultTheme.Sidebar;
