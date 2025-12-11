declare module "@dcloudio/vite-plugin-uni";

declare module "@/uni_modules/cool-vibrate" {
	export function vibrate(duration: number): void;
}

declare module "@/uni_modules/cool-open-web" {
	export function openWeb(url: string): boolean;
}

declare type Theme = "light" | "dark";

declare interface Uni {
	setAppTheme(options: {
		theme: "auto" | Theme;
		success?: () => void;
		fail?: (err: {
			errCode: number;
			errSubject: string;
			data: UTSJSONObject;
			errMsg: string;
		}) => void;
	}): void;
	onAppThemeChange(callback: (res: { appTheme: Theme }) => void): number;
	onOsThemeChange(callback: (res: { osTheme: Theme }) => void): number;
	onHostThemeChange(callback: (res: { hostTheme: Theme }) => void): void;
	createCanvasContextAsync(options: {
		id: string;
		component: ComponentInternalInstance;
		success?: (context: CanvasContext) => void;
		fail?: (err: {
			errCode: number;
			errSubject: string;
			data: UTSJSONObject;
			errMsg: string;
		}) => void;
		complete?: () => void;
	}): Promise<CanvasContext>;
	rpx2px(px: number): number;
}

declare interface NodeInfo {
	id?: string;
	bottom?: number;
	context?: number;
	dataset?: number;
	height?: number;
	left?: number;
	node?: number;
	right?: number;
	scrollHeight?: number;
	scrollLeft?: number;
	scrollTop?: number;
	scrollWidth?: number;
	top?: number;
	width?: number;
}

declare interface UniEvent {
	bubbles: boolean;
	cancelable: boolean;
	type: string;
	target: any;
	currentTarget: any;
	timeStamp: number;
	[key: string]: any;
}

declare interface UniInputEvent extends UniEvent {
	detail: {
		value: string;
		cursor: number;
	};
}

declare interface UniInputFocusEvent extends UniEvent {
	detail: {
		value: string;
		height: number;
	};
}

declare interface UniTextareaFocusEvent extends UniEvent {
	detail: {
		value: string;
		height: number;
	};
}

declare interface UniInputBlurEvent extends UniEvent {
	detail: {
		value: string;
		cursor: number;
	};
}

declare interface UniTextareaBlurEvent extends UniEvent {
	detail: {
		value: string;
		cursor: number;
	};
}

declare interface UniInputConfirmEvent extends UniEvent {
	type: "confirm";
	detail: {
		value: string;
	};
}

declare interface UniInputKeyboardHeightChangeEvent extends UniEvent {
	type: "keyboardheightchange";
	target: {
		autofocus: boolean;
		disabled: boolean;
		type: string;
		value: string;
	};
	currentTarget: {
		autofocus: boolean;
		disabled: boolean;
		type: string;
		value: string;
	};
	isStopPropagation: boolean;
	detail: {
		duration: number;
		height: number;
	};
}

declare interface UniTextareaLineChangeEvent extends UniEvent {
	detail: {
		lineCount: number;
		heightRpx: number;
		height: number;
	};
}

declare interface UniTextareaBlurEvent extends UniEvent {
	detail: {
		value: string;
		cursor: number;
	};
}

declare interface UniTouch {
	clientX: number;
	clientY: number;
	force: number;
	identifier: number;
	pageX: number;
	pageY: number;
	radiusX: number;
	radiusY: number;
	rotationAngle: number;
	screenX: number;
	screenY: number;
}

declare interface UniTouchEvent extends UniEvent {
	changedTouches: {
		clientX: number;
		clientY: number;
		force: number;
		identifier: number;
		pageX: number;
		pageY: number;
		screenX: number;
		screenY: number;
	}[];
	touches: UniTouch[];
	stopPropagation: () => void;
	preventDefault: () => void;
}

declare interface UniPointerEvent extends UniEvent {
	clickX: number;
	clickY: number;
	pageX: number;
	pageY: number;
	screenX: number;
	screenY: number;
	x: number;
	y: number;
}

declare interface UniSliderChangeEvent extends UniEvent {
	detail: {
		value: number;
	};
}

declare interface UniPickerViewChangeEvent extends UniEvent {
	detail: {
		value: number[];
	};
}

declare interface UniScrollEvent extends UniEvent {
	detail: {
		scrollTop: number;
		scrollLeft: number;
		scrollHeight: number;
		scrollWidth: number;
		deltaY: number;
		deltaX: number;
	};
}

declare interface UniScrollToUpperEvent extends UniEvent {
	detail: {
		direction: string;
	};
}

declare interface UniScrollToLowerEvent extends UniEvent {
	detail: {
		direction: string;
	};
}

declare interface UniRefresherEvent extends UniEvent {
	detail: {
		dy: number;
	};
}

declare interface UniSwiperChangeEvent extends UniEvent {
	detail: {
		current: number;
		currentItemId: string;
		source: string;
	};
}

declare interface UniMouseEvent extends UniEvent {
	clientX: number;
	clientY: number;
	pageX: number;
	pageY: number;
	screenX: number;
	screenY: number;
	x: number;
	y: number;
}

declare interface UniImageLoadEvent extends UniEvent {
	detail: {
		width: number;
		height: number;
	};
}

declare interface JSON {
	parseObject<T>(text: string): T | null;
}

declare type UTSJSONObject = {
	[key: string]: any;
	parse?<T>(): T | null;
	get?(key: string): any | null;
	set?(key: string, value: any | null): void;
	getAny?(key: string): any | null;
	getAny?(key: string, def: any): any;
	getBoolean?(key: string): boolean | null;
	getBoolean?(key: string, def: any): boolean;
	getNumber?(key: string): number | null;
	getNumber?(key: string, def: any): number;
	getString?(key: string): string | null;
	getString?(key: string, def: any): string;
	getJSON?(key: string): UTSJSONObject | null;
	getJSON?(key: string, def: any): UTSJSONObject;
	getArray?<T>(key: string): T[] | null;
	getArray?<T>(key: string, def: T[]): T[];
	getArray?(key: string): any[] | null;
	getArray?(key: string, def: any[]): any[];
	toMap?(): Map<string, any>;
};

declare interface ChooseImageTempFile {
	path: string;
	size: number;
	name: string;
	type: string;
}

declare type RequestMethod =
	| "OPTIONS"
	| "GET"
	| "HEAD"
	| "POST"
	| "PUT"
	| "DELETE"
	| "TRACE"
	| "CONNECT";

declare const onAddToFavorites: (
	hook: (options: Page.AddToFavoritesOption) => Page.CustomFavoritesContent,
	target?: ComponentInternalInstance | null
) => void;

declare const onBackPress: (
	hook: (options: Page.BackPressOption) => any,
	target?: ComponentInternalInstance | null
) => void;

declare const onError: (
	hook: (error: string) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onExit: (hook: () => void, target?: ComponentInternalInstance | null) => void;

declare const onHide: (hook: () => any, target?: ComponentInternalInstance | null) => void;

declare const onInit: (
	hook: (query?: AnyObject | undefined) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onLaunch: (
	hook: (options?: App.LaunchShowOption | undefined) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onLoad: (
	hook: (query?: AnyObject | undefined) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onNavigationBarButtonTap: (
	hook: (options: Page.NavigationBarButtonTapOption) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onNavigationBarSearchInputChanged: (
	hook: (event: Page.NavigationBarSearchInputEvent) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onNavigationBarSearchInputClicked: (
	hook: () => any,
	target?: ComponentInternalInstance | null
) => void;

declare const onNavigationBarSearchInputConfirmed: (
	hook: (event: Page.NavigationBarSearchInputEvent) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onNavigationBarSearchInputFocusChanged: (
	hook: onNavigationBarSearchInputFocusChangedHook,
	target?: ComponentInternalInstance | null
) => void;

declare type onNavigationBarSearchInputFocusChangedHook = (
	options: NavigationBarSearchInputFocusChanged
) => void;

declare const onPageHide: (hook: () => any, target?: ComponentInternalInstance | null) => void;

declare const onPageNotFound: (
	hook: (options: App.PageNotFoundOption) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onPageScroll: (
	hook: (options: Page.PageScrollOption) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onPageShow: (
	hook: ((options?: App.LaunchShowOption | undefined) => void) | (() => void),
	target?: ComponentInternalInstance | null
) => void;

declare const onPullDownRefresh: (
	hook: () => any,
	target?: ComponentInternalInstance | null
) => void;

declare const onReachBottom: (hook: () => any, target?: ComponentInternalInstance | null) => void;

declare const onReady: (hook: () => any, target?: ComponentInternalInstance | null) => void;

declare const onResize: (
	hook: (options: Page.ResizeOption) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onSaveExitState: (
	hook: onSaveExitStateHook,
	target?: ComponentInternalInstance | null
) => void;

declare type onSaveExitStateHook = () => SaveExitState;

declare const onShareAppMessage: (
	hook: (
		options: Page.ShareAppMessageOption
	) => Page.CustomShareContent | Promise<Omit<Page.CustomShareContent, "promise">>,
	target?: ComponentInternalInstance | null
) => void;

declare const onShareTimeline: (
	hook: () => Page.ShareTimelineContent,
	target?: ComponentInternalInstance | null
) => void;

declare const onShow: (
	hook: ((options?: App.LaunchShowOption | undefined) => void) | (() => void),
	target?: ComponentInternalInstance | null
) => void;

declare const onTabItemTap: (
	hook: (options: Page.TabItemTapOption) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onThemeChange: (
	hook: (options: UniApp.OnThemeChangeCallbackResult) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onUnhandledRejection: (
	hook: (options: UniApp.OnUnhandledRejectionCallbackResult) => void,
	target?: ComponentInternalInstance | null
) => void;

declare const onUnload: (hook: () => any, target?: ComponentInternalInstance | null) => void;

declare interface DOMRect {
	x: number;
	y: number;
	width: number;
	height: number;
	left: number;
	top: number;
	right: number;
	bottom: number;
}

declare interface UniElement {
	$vm: ComponentPublicInstance;
	id: string;
	firstChild: UniElement;
	lastChild: UniElement;
	previousSibling: UniElement;
	parentElement: UniElement;
	children: UniElement[];
	attributes: Map<string, any>;
	dataset: Map<string, any>;
	style: CSSStyleDeclaration;
	classList: string[];
	takeSnapshot(options: {
		success?: (res: { tempFilePath: string }) => void;
		fail?: (err: { errCode: number; errMsg: string }) => void;
	}): void;
	getBoundingClientRectAsync(): Promise<DOMRect>;
	getBoundingClientRect(): DOMRect;
	getDrawableContext(): DrawableContext;
	animate(
		keyframes: UniAnimationKeyframe | UniAnimationKeyframe[],
		options?:
			| {
					delay?: number;
					direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
					duration?: number;
					easing?:
						| "ease"
						| "ease-in"
						| "ease-out"
						| "ease-in-out"
						| "linear"
						| "cubic-bezier";
					fill?: "backwards" | "forwards" | "both" | "none";
					iterations?: number;
			  }
			| number
	): { id: string; playState: "running" | "paused" | "finished" | "idle" } | null;
}

declare interface CanvasContext extends HTMLCanvasElement {
	createImage(): HTMLImageElement;
	reset(): void;
}

declare type Image = HTMLImageElement;

declare type VueApp = any;

declare interface UniNativeViewElement extends UniElement {
	bindAndroidView(view: any): void;
	bindIOSView(): void;
	bindHarmonyFrameNode(node: FrameNode): void;
	bindHarmonyWrappedBuilder<O extends Object>(
		builder: WrappedBuilder<[options: O]>
	): BuilderNode<[O]>;
	getHarmonyFrameNode(): FrameNode | null;
}

declare type UniNativeViewInitEvent = {
	detail: {
		element: UniNativeViewElement;
	};
};
