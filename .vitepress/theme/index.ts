import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

import theme from "@/theme";

export default {
  ...DefaultTheme,
  ...theme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    theme?.enhanceApp?.(ctx);
  },
} as Theme;
