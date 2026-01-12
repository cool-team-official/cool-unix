declare type ComponentPublicInstance = any;

declare type ClInputComponentPublicInstance = {
	isFocus: boolean;
	focus: () => void;
	clear: () => void;
};

declare type ClTextareaComponentPublicInstance = {
	isFocus: boolean;
	focus: () => void;
};

declare type ClPopupComponentPublicInstance = {
	isOpened: boolean;
	isOpen: boolean;
	open: () => void;
	close: () => void;
};

declare type ClSelectComponentPublicInstance = {
	open: (cb: ((value: any) => void) | null) => void;
	close: () => void;
};

declare type ClSelectDateComponentPublicInstance = {
	open: (cb: ((value: string) => void) | null) => void;
	close: () => void;
	setValue: (value: string) => void;
	setValues: (values: string[]) => void;
	clear: () => void;
	setRange: (index: number) => void;
	confirm: () => void;
};

declare type ClSelectTimeComponentPublicInstance = {
	open: (cb: ((value: string) => void) | null) => void;
	close: () => void;
};

declare type ClRowComponentPublicInstance = {
	gutter: number;
};

declare type ClConfirmComponentPublicInstance = {
	open: (options: {
		title: string;
		message: string;
		confirmText?: string;
		showConfirm?: boolean;
		cancelText?: string;
		showCancel?: boolean;
	}) => void;
	close: () => void;
};

declare type ClActionSheetComponentPublicInstance = {
	open: (options: {
		title?: string;
		list: {
			label: string;
			icon?: string;
			disabled?: boolean;
			color?: string;
			callback?: () => void;
		}[];
		cancelText?: string;
		showCancel?: boolean;
	}) => void;
	close: () => void;
};

declare type ClToastComponentPublicInstance = {
	open: (options: {
		message: string;
		duration?: number;
		icon?: string;
		position?: "top" | "center" | "bottom";
	}) => void;
	close: () => void;
};

declare type ClKeyboardNumberComponentPublicInstance = {
	open: () => void;
	close: () => void;
};

declare type ClKeyboardCarComponentPublicInstance = {
	open: () => void;
	close: () => void;
};

declare type ClKeyboardPasswordComponentPublicInstance = {
	open: () => void;
	close: () => void;
};

declare type ClPaginationComponentPublicInstance = {
	prev: () => void;
	next: () => void;
};

declare type ClCollapseComponentPublicInstance = {
	show: () => void;
	hide: () => void;
	toggle: () => void;
};

declare type ClCountdownComponentPublicInstance = {
	next: () => void;
	start: () => void;
	stop: () => void;
	done: () => void;
	isRunning: boolean;
};

declare type ClStickyComponentPublicInstance = {
	getRect: () => void;
};

declare type ClListIndexComponentPublicInstance = {
	scrollToIndex: (index: string) => void;
};

declare type ClListItemComponentPublicInstance = {
	resetSwipe: () => void;
	initSwipe: () => void;
};

declare type ClListItem = {
	label: string;
	content?: string;
	icon?: string;
	arrow?: boolean;
	hoverable?: boolean;
	disabled?: boolean;
};

declare type ClListViewItem = {
	label?: string;
	value?: any;
	index?: string;
	children?: ClListViewItem[];
};

declare type ClListViewComponentPublicInstance = {
	data: ClListViewItem[];
	stopRefresh: () => void;
};

declare type ClCascaderComponentPublicInstance = {
	open: () => void;
	close: () => void;
	reset: () => void;
	clear: () => void;
};

declare type ClWaterfallComponentPublicInstance = {
	append: (data: UTSJSONObject[]) => Promise<void>;
	remove: (id: string | number) => void;
	update: (id: string | number, data: UTSJSONObject) => void;
	clear: () => void;
};

declare type ClQrcodeComponentPublicInstance = {
	toPng: () => Promise<string>;
};

declare type ClProgressCircleComponentPublicInstance = {
	animate: (value: number) => void;
};

declare type ClSignComponentPublicInstance = {
	clear: () => void;
	toPng: () => Promise<string>;
};

declare type ClCropperComponentPublicInstance = {
	open: (url: string) => void;
	close: () => void;
	chooseImage: () => void;
	toPng: () => Promise<string>;
};

declare type ClFormRule = {
	required?: boolean;
	message?: string;
	min?: number;
	max?: number;
	pattern?: RegExp;
	validator?: (value: any | null) => boolean | string;
};

declare type ClFormValidateError = {
	field: string;
	message: string;
};

declare type ClFormComponentPublicInstance = {
	labelPosition: "left" | "top" | "right";
	labelWidth: string;
	showAsterisk: boolean;
	showMessage: boolean;
	disabled: boolean;
	data: UTSJSONObject;
	errors: Map<string, string>;
	fields: Set<string>;
	addField: (prop: string, rules: ClFormRule[]) => void;
	removeField: (prop: string) => void;
	getValue: (prop: string) => any | null;
	setError: (prop: string, error: string) => void;
	getError: (prop: string) => string;
	getErrors: () => Promise<ClFormValidateError[]>;
	removeError: (prop: string) => void;
	clearErrors: () => void;
	getRule: (prop: string) => ClFormRule[];
	setRule: (prop: string, rules: ClFormRule[]) => void;
	removeRule: (prop: string) => void;
	validateRule: (value: any | null, rule: ClFormRule) => string | null;
	clearValidate: () => void;
	validateField: (prop: string) => string | null;
	validate: (callback: (valid: boolean, errors: ClFormValidateError[]) => void) => Promise<void>;
};

declare type ClFormItemComponentPublicInstance = {
	prop: string;
	isError: boolean;
};

declare type ClPageComponentPublicInstance = {
	scrollTop: number;
	scrollTo: (top: number) => void;
	scrollToTop: () => void;
};

declare type ClSlideVerifyComponentPublicInstance = {
	init: () => void;
	reset: () => void;
};

declare type ClTreeComponentPublicInstance = {
	icon: string;
	expandIcon: string;
	checkable: boolean;
	multiple: boolean;
	checkStrictly: boolean;
	clearChecked: () => void;
	setChecked: (key: string | number, flag: boolean) => void;
	setCheckedKeys: (keys: (string | number)[]) => void;
	getCheckedKeys: () => (string | number)[];
	getHalfCheckedKeys: () => (string | number)[];
	setExpanded: (key: string | number, flag: boolean) => void;
	setExpandedKeys: (keys: (string | number)[]) => void;
	getExpandedKeys: () => (string | number)[];
	expandAll: () => void;
	collapseAll: () => void;
};

declare type ClCalendarComponentPublicInstance = {
	open(cb: ((value: string | string[]) => void) | null = null): void;
	close(): void;
};

declare type ClMarqueeComponentPublicInstance = {
	play(): void;
	pause(): void;
	start(): void;
	stop(): void;
	reset(): void;
};

declare type ClReadMoreComponentPublicInstance = {
	toggle(): void;
	getContentHeight(): void;
};

declare type ClSelectSeatComponentPublicInstance = {
	setSeat: (row: number, col: number, data: UTSJSONObject) => void;
	getSeats: () => {
		row: number;
		col: number;
		disabled?: boolean;
		empty?: boolean;
		bgColor?: string;
		borderColor?: string;
		selectedBgColor?: string;
		selectedColor?: string;
		selectedIcon?: string;
		icon?: string;
		image?: string;
		selectedImage?: string;
	}[];
	draw: () => void;
};
