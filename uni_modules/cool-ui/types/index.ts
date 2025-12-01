export type Size = "small" | "normal" | "large";

export type Type = "primary" | "success" | "warn" | "error" | "info";

export type PassThroughProps = {
	className?: string;
};

export type Justify = "start" | "center" | "end";

export type ClInputType =
	| "text"
	| "number"
	| "idcard"
	| "digit"
	| "tel"
	| "password"
	| "safe-password"
	| "nickname";

export type ClTextType = "default" | "phone" | "name" | "amount" | "card" | "email";

export type ClButtonType = "primary" | "success" | "warn" | "error" | "info" | "light" | "dark";

export type ClRadioOption = {
	label?: string;
	value: string | number | boolean;
	disabled?: boolean;
};

export type ClCheckboxOption = {
	label?: string;
	value: string | number | boolean;
	disabled?: boolean;
};

export type ClSelectValue = string[] | number[] | number | string | null;

export type ClSelectOption = {
	label: string;
	value: any;
	children?: ClSelectOption[];
};

export type ClConfirmAction = "confirm" | "cancel" | "close";

export type ClConfirmBeforeCloseEvent = {
	close: () => void;
	showLoading: () => void;
	hideLoading: () => void;
};

export type ClConfirmOptions = {
	title: string;
	message: string;
	callback?: (action: ClConfirmAction) => void;
	beforeClose?: (action: ClConfirmAction, event: ClConfirmBeforeCloseEvent) => void;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
	duration?: number;
};

export type ClActionSheetItem = {
	label: string;
	icon?: string;
	disabled?: boolean;
	color?: string;
	callback?: () => void;
};

export type ClActionSheetOptions = {
	list: ClActionSheetItem[];
	title?: string;
	description?: string;
	cancelText?: string;
	showCancel?: boolean;
	maskClosable?: boolean;
};

export type ClToastPosition = "top" | "center" | "bottom";
export type ClToastType = "success" | "warn" | "error" | "question" | "disabled" | "stop";

export type ClToastOptions = {
	type?: ClToastType;
	icon?: string;
	image?: string;
	message: string;
	position?: ClToastPosition;
	duration?: number;
	clear?: boolean;
};

export type ClTabsItem = {
	label: string;
	value: string | number;
	disabled?: boolean;
};

export type ClListItem = {
	label: string;
	content?: string;
	icon?: string;
	arrow?: boolean;
	hoverable?: boolean;
	disabled?: boolean;
};

export type ClListViewItem = {
	label?: string;
	value?: any;
	index?: string;
	children?: ClListViewItem[];
};

export type ClListViewGroup = {
	index: string;
	children: ClListViewItem[];
};

export type ClListViewVirtualItem = {
	key: string;
	type: "header" | "item";
	index: number;
	top: number;
	height: number;
	data: ClListViewItem;
};

export type ClListViewRefresherStatus = "default" | "pulling" | "refreshing";

export type ClCascaderOption = ClListViewItem;

export type ClPopupDirection = "top" | "right" | "bottom" | "center" | "left";

export type ClQrcodeMode = "rect" | "circular" | "line" | "rectSmall";

export type ClUploadItem = {
	uid: string;
	preview: string;
	url: string;
	progress: number;
};

export type ClSelectDateShortcut = {
	label: string;
	value: string[];
};

// 表单规则类型
export type ClFormRule = {
	// 是否必填
	required?: boolean;
	// 错误信息
	message?: string;
	// 最小长度
	min?: number;
	// 最大长度
	max?: number;
	// 正则验证
	pattern?: RegExp;
	// 自定义验证函数
	validator?: (value: any | null) => boolean | string;
};

export type ClFormValidateError = {
	field: string;
	message: string;
};

export type ClFormValidateResult = {
	valid: boolean;
	errors: ClFormValidateError[];
};

export type ClFormLabelPosition = "left" | "top" | "right";

export type ClFilterItemType = "switch" | "sort" | "select";

export type ClFilterItem = {
	label: string;
	value: any;
	type: ClFilterItemType;
	options?: ClSelectOption[];
};

export type ClTreeItem = {
	id: string | number;
	label: string;
	disabled?: boolean;
	children?: ClTreeItem[];
	value?: UTSJSONObject;
	isExpand?: boolean;
	isChecked?: boolean;
	isHalfChecked?: boolean;
};

export type ClTreeNodeInfo = {
	node: ClTreeItem;
	parent?: ClTreeItem;
	index: number;
};

export type ClCalendarMode = "single" | "multiple" | "range";

export type ClCalendarDateConfig = {
	date: string;
	topText?: string;
	bottomText?: string;
	disabled?: boolean;
	color?: string;
};

export type ClMarqueeDirection = "horizontal" | "vertical";

export type ClMarqueeItem = {
	url: string;
	originalIndex: number;
};

export type ClMarqueePassThrough = {
	className?: string;
	container?: PassThroughProps;
	item?: PassThroughProps;
	image?: PassThroughProps;
};

export type ClMarqueeProps = {
	className?: string;
	pt?: ClMarqueePassThrough;
	list?: string[];
	direction?: ClMarqueeDirection;
	speed?: number;
	pause?: boolean;
	pauseOnHover?: boolean;
	itemHeight?: number;
	itemWidth?: number;
	gap?: number;
};
