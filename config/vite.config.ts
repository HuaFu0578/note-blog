import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { SearchPlugin } from "vitepress-plugin-search";

export default defineConfig({
  plugins: [
    SearchPlugin({
      previewLength: 62,
      buttonLabel: "搜索",
      placeholder: "搜索文档",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../", import.meta.url)),
    },
  },
});
