import type { PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClRadioPassThrough = {
	className?: string;
	icon?: ClIconProps;
	label?: PassThroughProps;
};

export type ClRadioProps = {
	className?: string;
	pt?: ClRadioPassThrough;
	modelValue?: any;
	activeIcon?: string;
	inactiveIcon?: string;
	showIcon?: boolean;
	label?: string;
	value?: any;
	disabled?: boolean;
};
