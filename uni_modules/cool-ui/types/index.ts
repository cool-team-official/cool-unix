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
	label: string;
	value?: any;
	index?: string;
	children?: ClListViewItem[];
};

export type ClCascaderOption = ClListViewItem;

export type ClPopupDirection = "top" | "right" | "bottom" | "center" | "left";

export type ClQrcodeMode = "rect" | "circular" | "line" | "rectSmall";

export type ClUploadItem = {
	uid: string;
	preview: string;
	url: string;
	progress: number;
};
