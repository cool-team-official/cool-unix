import type { PassThroughProps } from "../../types";

export type ClWatermarkPassThrough = {
	className?: string;
	container?: PassThroughProps;
};

export type ClWatermarkProps = {
	className?: string;
	pt?: ClWatermarkPassThrough;
	text?: string;
	fontSize?: number;
	color?: string;
	darkColor?: string;
	opacity?: number;
	rotate?: number;
	width?: number;
	height?: number;
	gapX?: number;
	gapY?: number;
	zIndex?: number;
	fontWeight?: string;
	fontFamily?: string;
};
