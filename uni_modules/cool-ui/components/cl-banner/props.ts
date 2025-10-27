import type { PassThroughProps } from "../../types";

export type ClBannerPassThrough = {
	className?: string;
	item?: PassThroughProps;
	itemActive?: PassThroughProps;
	image?: PassThroughProps;
	dots?: PassThroughProps;
	dot?: PassThroughProps;
	dotActive?: PassThroughProps;
};

export type ClBannerProps = {
	className?: string;
	pt?: ClBannerPassThrough;
	list?: string[];
	previousMargin?: number;
	nextMargin?: number;
	autoplay?: boolean;
	interval?: number;
	showDots?: boolean;
	disableTouch?: boolean;
	height?: any;
	imageMode?: string;
};
