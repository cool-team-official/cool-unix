import type { ClCalendarDateConfig, ClCalendarMode } from "../../types";

export type ClCalendarPassThrough = {
	className?: string;
};

export type ClCalendarProps = {
	className?: string;
	pt?: ClCalendarPassThrough;
	modelValue?: string | any;
	date?: string[];
	mode?: ClCalendarMode;
	dateConfig?: ClCalendarDateConfig[];
	start?: string;
	end?: string;
	year?: number;
	month?: number;
	showOtherMonth?: boolean;
	showHeader?: boolean;
	showWeeks?: boolean;
	cellHeight?: number;
	cellGap?: number;
	color?: string;
	textColor?: string;
	textOtherMonthColor?: string;
	textDisabledColor?: string;
	textTodayColor?: string;
	textSelectedColor?: string;
	bgSelectedColor?: string;
	bgRangeColor?: string;
};
