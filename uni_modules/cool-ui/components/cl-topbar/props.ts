import type { PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClTopbarPassThrough = {
	classNames?: string;
	title?: PassThroughProps;
	back?: ClIconProps;
};

export type ClTopbarProps = {
	className?: string;
	pt?: ClTopbarPassThrough;
	title?: string;
	color?: string;
	backgroundColor?: string;
	showBack?: boolean;
	backPath?: string;
	backIcon?: string;
	safeAreaTop?: boolean;
	fixed?: boolean;
	height?: number | string | any;
};
