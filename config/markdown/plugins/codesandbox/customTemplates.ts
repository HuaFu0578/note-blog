import type { TemplateInfo } from "./parser";

interface CustomTemplateInfo extends Omit<TemplateInfo, "extends"> {
  extends: string;
}

export default {
  "react-component": { extends: "new", entry: "src/App.js" },
  js: { extends: "file:./js" },
  ts: { extends: "file:./ts" },
  react: { extends: "new" },
  vue: { extends: "file:./vue", entry: "src/App.vue" },
} as Record<string, CustomTemplateInfo>;
