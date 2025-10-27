import type { PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClCheckboxPassThrough = {
	className?: string;
	icon?: ClIconProps;
	label?: PassThroughProps;
};

export type ClCheckboxProps = {
	className?: string;
	pt?: ClCheckboxPassThrough;
	modelValue?: any[] | boolean;
	label?: string;
	value?: any;
	disabled?: boolean;
	activeIcon?: string;
	inactiveIcon?: string;
	showIcon?: boolean;
};
