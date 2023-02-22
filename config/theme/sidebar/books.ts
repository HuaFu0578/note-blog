import type { DefaultTheme } from "vitepress";
import { getRouteFromPath } from "./utils";

export default [
  {
    text: "《labuladong 的算法小抄》",
    collapsed: false,
    items: getRouteFromPath("./books/labuladong 的算法小抄"),
  },
] as DefaultTheme.Sidebar;
