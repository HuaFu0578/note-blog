import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { SearchPlugin } from "vitepress-plugin-search";

import { isProdEnv } from "../utils/env";

export default defineConfig({
  // plugins: [
  //   isProdEnv &&
  //     SearchPlugin({
  //       previewLength: 62,
  //       buttonLabel: "搜索",
  //       placeholder: "搜索文档",
  //     }),
  // ].filter(Boolean),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../", import.meta.url)),
    },
  },
  server: {
    open: true,
  },
});
