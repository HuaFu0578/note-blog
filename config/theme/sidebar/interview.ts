import type { DefaultTheme } from "vitepress";
import { getRouteFromPath } from "./utils";

export default [
  {
    text: "前端面试相关",
    collapsed: false,
    items: getRouteFromPath("./knowledge/interview"),
  },
] as DefaultTheme.Sidebar;
