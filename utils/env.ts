export const ENV = process.env;

export default ENV;

/** 是否为生产环境 */
export const isProdEnv = ENV.NODE_ENV === "production";
