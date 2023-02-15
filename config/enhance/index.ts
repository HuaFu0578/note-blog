import type { Theme } from "vitepress";
import Mermaid from "./components/Mermaid/index.vue";
import Test from "./components/Test.vue";

export default {
  enhanceApp(ctx) {
    ctx.app.component("Test", Test);
    ctx.app.component("Mermaid", Mermaid);
  },
} as Theme;
