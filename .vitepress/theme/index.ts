import DefaultTheme from "vitepress/theme";

import enhance from "@/config/enhance";

import type { Theme } from "vitepress";
export default {
  ...DefaultTheme,
  ...enhance,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    enhance?.enhanceApp?.(ctx);
  },
} as Theme;
