import type { DefaultTheme } from "vitepress";
import { getRouteFromPath } from "./utils";

export default [
  {
    text: "前端",
    collapsed: false,
    items: getRouteFromPath("./knowledge/frontend"),
  },
  {
    text: "后端",
    collapsed: true,
    items: getRouteFromPath("./knowledge/backend"),
  },
] as DefaultTheme.Sidebar;

console.log(getRouteFromPath("./knowledge/frontend"));
