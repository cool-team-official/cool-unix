export type ChartsEvent = () => void;
export type TouchPosition = {
	x: number;
	y: number;
};
export class ChartScrollOption {
	currentOffset: number = 0;
	startTouchX: number = 0;
	distance: number = 0;
	lastMoveTime: number = 0;
	position: string = "";
	moveCount: number = 0;
}

export type ChartAnimationOption = {
	canvasContext: CanvasContext;
	timing: string;
	duration: number;
	onProcess: (process: number) => void;
	onAnimationFinish: () => void;
};
