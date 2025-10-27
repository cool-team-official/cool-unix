import { isMp } from "@/cool";
import { dev } from "./dev";
import { prod } from "./prod";

// 判断当前是否为开发环境
export const isDev = process.env.NODE_ENV == "development";

// 忽略 token 校验的接口路径
export const ignoreTokens: string[] = [];

// 微信配置
type WxConfig = {
	debug: boolean;
};

// 配置类型定义
type Config = {
	name: string; // 应用名称
	version: string; // 应用版本
	locale: string; // 应用语言
	website: string; // 官网地址
	host: string; // 主机地址
	baseUrl: string; // 基础路径
	showDarkButton: boolean; // 是否显示暗色模式切换按钮
	isCustomTabBar: boolean; // 是否自定义 tabBar
	backTop: boolean; // 是否显示回到顶部按钮
	wx: WxConfig; // 微信配置
};

// 根据环境导出最终配置
export const config = {
	name: "MARA",
	version: "1.0.0",
	locale: "zh",
	website: "https://cool-js.com",
	showDarkButton: isMp() ? false : true,
	isCustomTabBar: true,
	backTop: true,
	wx: {
		debug: false
	},
	...(isDev ? dev() : prod())
} as Config;

// 导出代理相关配置
export * from "./proxy";
