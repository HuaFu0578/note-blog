import { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    // 注册自定义全局组件
    // ctx.app.component("MYGlobalComponent", TheWelcome);
  },
} as Theme;
