import type { DefaultTheme } from "vitepress";
import interview from "./interview";
import knowledge from "./knowledge";
import life from "./life";

export default {
  "/knowledge/interview": interview,
  "/knowledge/": knowledge,
  "/life/": life,
  "/": [],
} as DefaultTheme.Sidebar;
