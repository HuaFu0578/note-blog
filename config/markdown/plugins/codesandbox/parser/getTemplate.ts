import type { TemplateInfo } from "./";
import request from "sync-request";

import fsTemplate from "./fsTemplate";

function mergeTemplates(
  baseTemplate: TemplateInfo,
  targetTemplate: TemplateInfo
) {
  return {
    ...baseTemplate,
    ...targetTemplate,
    files: {
      ...(baseTemplate.files || {}),
      ...(targetTemplate.files || {}),
    },
  };
}

function getFilePath(mappings: any, shortid: string): string {
  const dir = mappings[shortid];

  if (!dir) {
    return "";
  }

  return (
    [getFilePath(mappings, dir.directory_shortid), dir.title]
      .filter(Boolean)
      // CodeSandbox expects posix path
      .join("/")
  );
}

/**
 * `templateID` can be either:
 *  - sandbox id
 *  - `file:` path
 *  - custom sandbox id
 */
function getTemplate(
  templateID: string,
  customTemplates: Record<string, TemplateInfo>,
  rootPath?: string
): TemplateInfo {
  if (customTemplates[templateID]) {
    const baseTemplate = getTemplate(
      customTemplates[templateID].extends!,
      customTemplates
    );

    const template = mergeTemplates(baseTemplate, customTemplates[templateID]);

    return template;
  }

  let template: TemplateInfo;

  if (templateID.startsWith("file:")) {
    if (typeof window !== "undefined") {
      throw new Error(
        '"file:" template is not supported in browser environment!'
      );
    }

    const directoryPath = templateID.slice("file:".length);
    template = fsTemplate(directoryPath, rootPath ? rootPath : process.cwd());
  } else {
    try {
      const response = request(
        "GET",
        `https://codesandbox.io/api/v1/sandboxes/${templateID}`
      );
      const res = response.getBody().toString("utf-8");
      template = JSON.parse(res).data;
    } catch (err) {
      console.error(`Failed to get the sandbox template: ${templateID}`);
      throw err;
    }

    // Construct files/directories mappings
    const mappings: Record<string, any> = {};

    (template.directories || []).forEach((dir: any) => {
      mappings[dir.shortid] = dir;
    });
    (template.modules || []).forEach((file: any) => {
      mappings[file.shortid] = file;
    });

    // Construct files mappings
    const files: TemplateInfo["files"] = {};

    (template.modules || []).forEach((file: any) => {
      const path = getFilePath(mappings, file.shortid);

      files[path] = { isBinary: false, content: file.code };
    });

    template.files = files;
  }

  return template;
}

export default function getTemplateFromCache(
  templateID: string,
  templatesCache: Map<string, TemplateInfo>,
  customTemplates: Record<string, TemplateInfo>,
  customTemplateRootPath?: string
) {
  if (!templatesCache.has(templateID)) {
    templatesCache.set(
      templateID,
      getTemplate(templateID, customTemplates, customTemplateRootPath) as any
    );
  }

  return templatesCache.get(templateID);
}
