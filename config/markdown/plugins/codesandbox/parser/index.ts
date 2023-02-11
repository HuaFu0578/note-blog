import { getParameters } from "codesandbox/lib/api/define";
import request from "sync-request";

import customTemplates from "../customTemplates";
import getTemplate from "./getTemplate";
import { mergeQuery, toBasePath } from "./utils";

import type { Query } from "./utils";
import type { IModule } from "codesandbox-import-util-types";
import type { CodeSandBoxFenceContext } from "../";

const DEFAULT_CUSTOM_TEMPLATES = customTemplates;
const PLUGIN_ONLY_QUERY_PARAMS = ["overrideEntry", "entry", "style"];

export interface TemplateInfo {
  extends?: string;
  entry?: string;
  query?: string | { [key: string]: string } | URLSearchParams;
  files?: { [filePath: string]: IModule };
  title?: string;
  directories?: any;
  modules?: any;
}

interface CodeSandBoxMetaOptions {
  mode?: "meta" | "iframe" | "button";
  customTemplates?: Record<string, TemplateInfo>;
  autoDeploy?: boolean;
  query?: Query;
}

export interface CodeSandBoxParserType {
  url: string;
}

/**
 * 解析 codesandbox 元数据
 *
 * @see 参考 [remark-codesandbox](https://github.com/kevin940726/remark-codesandbox/blob/master/packages/remark-codesandbox/src/index.js)
 */
export const codeSandBoxParser = (
  meta: string,
  ctx: CodeSandBoxFenceContext,
  {
    mode = "meta",
    customTemplates: optCustomTemplates = {} as any,
    query: baseQuery,
    autoDeploy = false,
  }: CodeSandBoxMetaOptions = {}
): CodeSandBoxParserType | null => {
  if (!meta) return null;
  const file = ctx?.env?.path;
  const content = ctx.tokens[ctx.idx]?.content;
  const templatesCache = new Map<string, TemplateInfo>();
  const customTemplates = {
    ...DEFAULT_CUSTOM_TEMPLATES,
    ...optCustomTemplates,
  };
  const [templateID, queryString] = meta.split("?");

  const template = getTemplate(
    templateID,
    templatesCache,
    customTemplates,
    file
  );

  const query: URLSearchParams = mergeQuery(
    baseQuery,
    template?.query,
    queryString
  );
  const entryPath = query.has("entry")
    ? toBasePath(query.get("entry")!)
    : template?.entry;

  // If there is no predefined `module` key, then we assign it to the entry file
  if (!query.has("module")) {
    query.set(
      "module",
      // `entry` doesn't start with leading slash, but `module` requires it
      entryPath?.startsWith("/") ? entryPath! : `/${entryPath}`
    );
  }

  const overrideEntry = query.get("overrideEntry");

  const style = query.get("style") || "";

  // Remove any options that are only for the plugin and not relevant to CodeSandbox
  PLUGIN_ONLY_QUERY_PARAMS.forEach((param) => {
    query.delete(param);
  });

  if (!template?.files?.[entryPath!]) {
    throw new Error(
      `Entry "${entryPath}" is not present in template "${templateID}".`
    );
  }

  let entryFileContent = template.files[entryPath!].content;
  if (!overrideEntry) {
    entryFileContent = content;
  } else if (overrideEntry !== "false") {
    const [overrideRangeStart, overrideRangeEnd] = overrideEntry.split("-");

    const lines = entryFileContent.split("\n");
    entryFileContent = [
      ...lines.slice(0, Number(overrideRangeStart) - 1),
      content,
      ...(overrideRangeEnd === "" ? [] : lines.slice(Number(overrideRangeEnd))),
    ].join("\n");
  }

  const parameters: string = getParameters({
    files: {
      ...template.files,
      [entryPath!]: { isBinary: false, content: entryFileContent },
    },
  });

  let url;

  if (autoDeploy) {
    const response = request(
      "POST",
      "https://codesandbox.io/api/v1/sandboxes/define",
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parameters, json: 1 }),
      }
    );
    const res = response.getBody().toString("utf-8");
    const sandbox_id = JSON.parse(res).sandbox_id;

    url = `https://codesandbox.io/s/${sandbox_id}?${query.toString()}`;
  } else {
    url = `https://codesandbox.io/api/v1/sandboxes/define?${new URLSearchParams(
      { parameters, query: query.toString() }
    ).toString()}`;
  }
  return {
    url: url,
  };
};
