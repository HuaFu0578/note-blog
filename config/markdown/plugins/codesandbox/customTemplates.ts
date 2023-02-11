import type { TemplateInfo } from "./parser";

export default {
  react: {
    extends: "new",
  },
  "react-component": {
    extends: "new",
    entry: "src/App.js",
  },
} as Record<string, TemplateInfo>;
