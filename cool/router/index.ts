import { PAGES, TABS } from "../ctx";
import type { BackOptions, PageInstance, PushOptions } from "../types";
import {
	storage,
	last,
	isNull,
	isEmpty,
	get,
	isFunction,
	toArray,
	map,
	debounce,
	nth,
	assign,
	parse
} from "../utils";

// 路由信息类型
type RouteInfo = {
	path: string;
	query: UTSJSONObject;
	meta: UTSJSONObject;
	isAuth?: boolean;
};

// 跳转前钩子类型
type BeforeEach = (to: RouteInfo, from: PageInstance, next: () => void) => void;
// 登录后回调类型
type AfterLogin = () => void;

// 路由事件集合
type Events = {
	beforeEach?: BeforeEach;
	afterLogin?: AfterLogin;
};

// 路由核心类
export class Router {
	private eventsMap = {} as Events; // 事件存储

	// 获取传递的 params 参数
	params() {
		return (storage.get("router-params") ?? {}) as UTSJSONObject;
	}

	// 获取传递的 query 参数
	query() {
		return this.route()?.query ?? {};
	}

	// 获取默认路径，支持 home 和 login
	defaultPath(name: "home" | "login") {
		const paths = {
			home: PAGES[0].path, // 首页为第一个页面
			login: "/pages/user/login"
		};

		return get(paths, name) as string;
	}

	// 获取当前页面栈的所有页面实例
	getPages(): PageInstance[] {
		return map(getCurrentPages(), (e) => {
			let path = e.route!;

			// 根路径自动转为首页
			if (path == "/") {
				path = this.defaultPath("home");
			}

			// 补全路径前缀
			if (!path.startsWith("/")) {
				path = "/" + path;
			}

			// 获取页面样式
			const page = PAGES.find((e) => e.path == path);
			const style = page?.style;
			const meta = page?.meta;

			// 获取页面暴露的方法
			// @ts-ignore
			const vm = e.vm as any;

			let exposed = vm;

			// #ifdef H5
			exposed = get(e, "vm.$.exposed");
			// #endif

			// 获取页面 query 参数
			// @ts-ignore
			const query = e.options;

			return {
				path,
				vm,
				exposed,
				style,
				meta,
				query,
				isCustomNavbar: style?.navigationStyle == "custom"
			} as PageInstance;
		});
	}

	// 获取指定路径的页面实例
	getPage(path: string) {
		return this.getPages().find((e) => e.path == path);
	}

	// 获取当前路由页面实例
	route() {
		return last(this.getPages());
	}

	// 获取当前页面路径
	path() {
		return this.route()?.path ?? "";
	}

	// 简单跳转页面（默认 navigateTo）
	to(path: string) {
		this.push({
			path
		});
	}

	// 路由跳转，支持多种模式和参数
	push(options: PushOptions) {
		let {
			query = {},
			params = {},
			mode = "navigateTo",
			path,
			success,
			fail,
			complete,
			animationType,
			animationDuration,
			events,
			isAuth
		} = options;

		// 拼接 query 参数到 url
		if (!isEmpty(query)) {
			const arr = toArray(query, (v, k) => {
				return `${k}=${v}`;
			});
			path += "?" + arr.join("&");
		}

		// params 通过 storage 临时存储
		if (!isEmpty(params)) {
			storage.set("router-params", params, 0);
		}

		// tabBar 页面强制使用 switchTab 跳转
		if (this.isTabPage(path)) {
			mode = "switchTab";
		}

		// 跳转执行函数
		const next = () => {
			switch (mode) {
				case "navigateTo":
					uni.navigateTo({
						url: path,
						success,
						events,
						fail,
						complete,
						animationType,
						animationDuration
					});
					break;
				case "redirectTo":
					uni.redirectTo({
						url: path,
						success,
						fail,
						complete
					});
					break;
				case "reLaunch":
					uni.reLaunch({
						url: path,
						success,
						fail,
						complete
					});
					break;
				case "switchTab":
					uni.switchTab({
						url: path,
						success,
						fail,
						complete
					});
					break;
			}
		};

		// 跳转前钩子处理
		if (this.eventsMap.beforeEach != null) {
			// 当前页
			const from = last(this.getPages());

			// 跳转页
			const to = { path, meta: this.getMeta(path), query, isAuth } as RouteInfo;

			// 调用跳转前钩子
			this.eventsMap.beforeEach(to, from!, next);
		} else {
			next();
		}
	}

	// 回到首页
	home() {
		this.push({
			path: this.defaultPath("home")
		});
	}

	// 返回上一页
	back(options: BackOptions | null = null) {
		if (this.isFirstPage()) {
			this.home();
		} else {
			const delta = options?.delta ?? 1;

			// 执行跳转函数
			const next = () => {
				uni.navigateBack({ ...(options ?? {}) });
			};

			// 跳转前钩子处理
			if (this.eventsMap.beforeEach != null) {
				// 当前页
				const from = last(this.getPages());

				// 上一页
				const to = nth(this.getPages(), -delta - 1);

				if (to != null) {
					// 调用跳转前钩子
					this.eventsMap.beforeEach(
						{
							path: to.path,
							query: to.query,
							meta: to.meta ?? ({} as UTSJSONObject)
						},
						from!,
						next
					);
				} else {
					console.error("[router] found to page is null");
				}
			} else {
				next();
			}
		}
	}

	// 获取页面元数据
	getMeta(path: string) {
		return PAGES.find((e) => path.includes(e.path))?.meta ?? ({} as UTSJSONObject);
	}

	// 执行当前页面暴露的方法
	callMethod(name: string, data?: any): any | null {
		const fn = get(this.route()!, `$vm.$.exposed.${name}`) as (d?: any) => any | null;
		if (isFunction(fn)) {
			return fn(data);
		}
		return null;
	}

	// 判断页面栈是否只有一个页面
	isFirstPage() {
		return getCurrentPages().length == 1;
	}

	// 判断是否为首页
	isHomePage() {
		return this.path() == this.defaultPath("home");
	}

	// 判断是否为自定义导航栏页面
	isCustomNavbarPage() {
		return this.route()?.isCustomNavbar ?? false;
	}

	// 判断是否为当前页面
	isCurrentPage(path: string) {
		return this.path() == path;
	}

	// 判断是否为 tab 页面
	isTabPage(path: string | null = null) {
		if (path == null) {
			path = this.path();
		}

		if (path == "/") {
			path = this.defaultPath("home");
		}
		return !isNull(TABS.find((e) => path == e.pagePath));
	}

	// 判断是否为登录页
	isLoginPage(path: string) {
		return path == this.defaultPath("login");
	}

	// 跳转到登录页（防抖处理）
	login = debounce(() => {
		if (!this.isLoginPage(this.path())) {
			this.push({
				path: "/pages/user/login",
				mode: "reLaunch"
			});
		}
	}, 300);

	// 登录成功后跳转逻辑
	nextLogin() {
		const pages = this.getPages();

		// 找到登录页的索引
		const index = pages.findIndex((e) => this.defaultPath("login").includes(e.path));

		// 未找到，则跳回首页
		if (index < 0) {
			this.home();
		} else {
			this.back({
				delta: pages.length - index
			});
		}
		// 登录后回调
		if (this.eventsMap.afterLogin != null) {
			this.eventsMap.afterLogin!();
		}
		// 触发全局 afterLogin 事件
		uni.$emit("afterLogin");
	}

	// 注册跳转前钩子
	beforeEach(cb: BeforeEach) {
		this.eventsMap.beforeEach = cb;
	}

	// 注册登录后回调
	afterLogin(cb: AfterLogin) {
		this.eventsMap.afterLogin = cb;
	}
}

// 单例导出
export const router = new Router();
