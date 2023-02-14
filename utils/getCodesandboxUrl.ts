import { codeSandBoxParser } from "../config/markdown/plugins/CodeOperatorArea/extension/codesandbox/parser";

/** 获取 codesandbox 打开链接 */
export default (
  templateQuery: string,
  options: {
    /* 模版根路径 */
    templateRootPath?: string;
    /** 填充内容 */
    content?: string;
  } = {}
) => {
  const { url } =
    codeSandBoxParser(
      templateQuery,
      { tokens: [{ content: options.content }], idx: 0 } as any,
      {
        customTemplateRootPath: options.templateRootPath,
      }
    ) ?? {};
  return url;
};
