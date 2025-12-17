import { computed, ref } from "vue";
import uniTheme from "@/theme.json";
import { router } from "../router";
import { ctx } from "../ctx";
import { isNull } from "../utils";

// 主题类型定义，仅支持 light 和 dark
type Theme = "light" | "dark";

// 是否为自动主题模式（跟随系统）
export const isAuto = ref(true);

/**
 * 获取页面样式
 * @param key 样式 key
 * @returns 样式值
 */
export function getStyle(key: string): string | null {
	// 页面配置
	const style = router.route()?.style;

	// 页面配置 key 映射
	const names = {
		bgColor: "backgroundColor",
		bgContentColor: "backgroundColorContent",
		navBgColor: "navigationBarBackgroundColor",
		navTextStyle: "navigationBarTextStyle"
	};

	// 如果页面配置存在，则使用页面配置
	if (style != null) {
		if (names[key] != null) {
			const val = style[names[key]!] as string | null;

			if (val != null) {
				return val;
			}
		}
	}

	return null;
}

/**
 * 获取颜色
 * @param name 颜色名称
 * @returns 颜色值
 */
export const getColor = (name: string) => {
	if (isNull(ctx.color)) {
		return "";
	}

	return ctx.color[name] as string;
};

/**
 * 获取 uniapp 主题配置
 */
export function getConfig(key: string): string {
	// 主题配置
	const themeVal = ((isDark.value ? uniTheme.dark : uniTheme.light) as UTSJSONObject)[key] as
		| string
		| null;

	// 页面样式
	const styleVal = getStyle(key);

	return styleVal ?? themeVal ?? "";
}

/**
 * 获取当前主题
 * APP 下优先获取 appTheme，若为 auto 则跟随系统 osTheme
 * H5/小程序下优先获取 hostTheme，否则默认为 light
 */
const getTheme = () => {
	let value: string | null;

	// #ifdef APP
	const appInfo = uni.getAppBaseInfo();
	// @ts-ignore
	const appTheme = appInfo.appTheme as string;
	const osTheme = uni.getSystemInfoSync().osTheme!;

	// 如果 appTheme 为 auto，则跟随系统主题，否则使用 appTheme
	value = appTheme == "auto" ? osTheme : appTheme;
	isAuto.value = appTheme == "auto";
	// #endif

	// #ifdef H5 || MP
	const hostTheme = uni.getAppBaseInfo().hostTheme;
	if (hostTheme) {
		// 如果有 hostTheme，则使用 hostTheme
		value = hostTheme;
	} else {
		// 默认使用 light 主题
		value = "light";
	}
	// #endif

	return value as Theme;
};

// 当前主题响应式变量
export const theme = ref<Theme>(getTheme());

/**
 * 是否为暗色模式
 */
export const isDark = computed(() => {
	return theme.value == "dark";
});

/**
 * 切换自动主题模式（仅 APP 有效）
 */
export const setIsAuto = () => {
	// #ifdef APP
	isAuto.value = !isAuto.value;

	if (isAuto.value) {
		// 设置为自动主题，跟随系统
		uni.setAppTheme({
			theme: "auto"
		});
	} else {
		// 关闭自动，使用当前 theme
		setTheme(theme.value);
	}
	// #endif
};

/**
 * 设置主题
 * @param value 主题值（"light" | "dark"）
 */
export const setTheme = (value: Theme) => {
	// 如果当前主题与目标主题一致，则不做处理
	if (theme.value == value) return;

	// 关闭自动主题
	isAuto.value = false;

	// #ifdef APP
	uni.setAppTheme({
		theme: value,
		success: () => {
			// 设置成功后更新 theme
			theme.value = value;
		}
	});
	// #endif

	// #ifndef APP
	theme.value = value;
	// #endif

	// #ifdef H5
	setH5();
	// #endif
};

// 设置 H5 下的主题色
export const setH5 = () => {
	const bgContentColor = getConfig("bgContentColor");
	const tabBgColor = getConfig("tabBgColor");
	const navBgColor = getConfig("navBgColor");
	const navTextStyle = getConfig("navTextStyle");

	// 设置主题类
	document.documentElement.classList.toggle("dark", isDark.value);

	// 设置背景色
	document.body.style.setProperty("--background-color-content", bgContentColor);

	// 设置 tabbar 背景色
	const tabbar = document.querySelector(".uni-tabbar");
	if (tabbar) {
		(tabbar as HTMLElement).style.backgroundColor = tabBgColor;
	}

	// 设置页面头部背景色和文字颜色
	const pageHead = document.querySelector(".uni-page-head");
	if (pageHead) {
		(pageHead as HTMLElement).style.backgroundColor = navBgColor;
		(pageHead as HTMLElement).style.color = navTextStyle;
	}

	// 设置页面头部按钮路径颜色
	const pageHeadBtnPath = document.querySelector(".uni-page-head-btn path");
	if (pageHeadBtnPath) {
		(pageHeadBtnPath as HTMLElement).style.fill = navTextStyle;
	}

	// 发送主题变化消息
	window.parent.postMessage(
		{
			type: "theme-change",
			isDark: isDark.value
		},
		"*"
	);
};

/**
 * 切换主题
 */
export const toggleTheme = () => {
	if (isDark.value) {
		setTheme("light");
	} else {
		setTheme("dark");
	}
};

/**
 * 初始化主题监听
 * APP 下监听系统主题和 App 主题变化
 * H5/小程序下监听 hostTheme 变化
 */
export const initTheme = () => {
	// #ifdef APP-ANDROID || APP-IOS
	uni.onOsThemeChange((res) => {
		if (isAuto.value) {
			setTimeout(() => {
				uni.setAppTheme({
					theme: res.osTheme,
					success: () => {
						theme.value = res.osTheme;
					}
				});
			}, 100);
		}
	});

	// 监听 App 主题变化
	uni.onAppThemeChange((res) => {
		theme.value = res.appTheme;
	});
	// #endif

	// #ifdef MP
	uni.onHostThemeChange((res) => {
		setTheme(res.hostTheme);
	});
	// #endif

	// #ifdef H5
	// 监听父窗口发送的主题变化消息
	// [BUG] uni.onHostThemeChange 打包会丢失
	// uni.onHostThemeChange((res) => {
	// 	setTheme(res.hostTheme);
	// });
	window.addEventListener("message", (e) => {
		if (e.data?.type == "theme-change") {
			setTheme(e.data.isDark ? "dark" : "light");
		}
	});
	// #endif
};
