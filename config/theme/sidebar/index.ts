import type { DefaultTheme } from "vitepress";
import books from "./books";
import interview from "./interview";
import knowledge from "./knowledge";
import life from "./life";

export default {
  "/knowledge/interview": interview,
  "/knowledge/": knowledge,
  "/life/": life,
  "/books/": books,
  "/": [],
} as DefaultTheme.Sidebar;
