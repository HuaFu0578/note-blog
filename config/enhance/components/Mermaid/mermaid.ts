import mermaid from "mermaid";

import mindmap from "@mermaid-js/mermaid-mindmap";

import type { MermaidConfig } from "mermaid";

const init = (async () => {
  try {
    await mermaid.registerExternalDiagrams([mindmap]);
  } catch (e) {
    console.error(e);
  }
})();

export const render = async (
  id: string,
  code: string,
  config: MermaidConfig
): Promise<string> => {
  await init;
  try {
    mermaid.initialize(config);
    const svg = await mermaid.renderAsync(id, code);
    return svg;
  } catch (e) {
    console.warn(e);
    return "";
  }
};
