import type { ClCalendarDateConfig, ClCalendarMode } from "../../types";
import type { ClSelectTriggerPassThrough } from "../cl-select-trigger/props";
import type { ClPopupPassThrough } from "../cl-popup/props";

export type ClCalendarSelectPassThrough = {
	trigger?: ClSelectTriggerPassThrough;
	popup?: ClPopupPassThrough;
};

export type ClCalendarSelectProps = {
	className?: string;
	pt?: ClCalendarSelectPassThrough;
	modelValue?: string | any;
	date?: string[];
	mode?: ClCalendarMode;
	dateConfig?: ClCalendarDateConfig[];
	start?: string;
	end?: string;
	title?: string;
	placeholder?: string;
	showTrigger?: boolean;
	disabled?: boolean;
	splitor?: string;
	rangeSplitor?: string;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
};
