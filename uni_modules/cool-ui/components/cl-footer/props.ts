import type { PassThroughProps } from "../../types";

export type ClFooterPassThrough = {
	className?: string;
	content?: PassThroughProps;
};

export type ClFooterProps = {
	className?: string;
	pt?: ClFooterPassThrough;
	minHeight?: number;
	vt?: number;
};
