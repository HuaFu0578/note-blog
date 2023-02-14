import type { Theme } from "vitepress";
import Test from "./components/Test.vue";

export default {
  enhanceApp(ctx) {
    ctx.app.component("Test", Test);
  },
} as Theme;
