import { isNull, set } from "./common";
import { TuiDrawCharts } from "./xcharts";
export class TuiCharts {
	chartsMap = new Map<number, TuiDrawCharts>();
	option: UTSJSONObject = {};
	canvasContext: CanvasContext | null = null;
	context: CanvasRenderingContext2D | null = null;
	dpr: number = uni.getWindowInfo().pixelRatio;
	offsetWidth: number = 0;
	offsetHeight: number = 0;
	ins: ComponentPublicInstance | null = null;
	setSize: boolean = false;
	baseX: number = 0;
	baseY: number = 0;
	oldTipsName: number = -1;
	canvasRect: DOMRect | null = null;
	constructor() {}
	getTouchCurrent(e: UniEvent): number {
		let curArea: number = -1;
		let x: number;
		let y: number;
		const top = this.canvasRect!.y;
		const left = this.canvasRect!.x;
		if (e.type == "click") {
			x = (e as UniPointerEvent).clientX - this.baseX + (this.baseX - left);
			y = (e as UniPointerEvent).clientY - this.baseY + (this.baseY - top);
		} else {
			x = (e as UniTouchEvent).changedTouches[0].clientX - this.baseX + (this.baseX - left);
			y = (e as UniTouchEvent).changedTouches[0].clientY - this.baseY + (this.baseY - top);
		}

		this.chartsMap.forEach((item: TuiDrawCharts, key: number) => {
			if (
				x > item.opts.xOffset &&
				y > item.opts.yOffset &&
				x < item.opts.xOffset + item.opts.width &&
				y < item.opts.yOffset + item.opts.height
			) {
				curArea = key;
			}
		});
		return curArea;
	}
	tap(e: UniPointerEvent) {
		if (this.oldTipsName != -1) {
			const curDraw = this.getDrawCharts(this.oldTipsName)!;
			curDraw.opts.DOMRect = this.canvasRect;
			const tipsIndex = curDraw.showToolTip(e);
			let legendIndex = -1;
			if (curDraw.opts.tapLegend) legendIndex = curDraw.touchLegend(e);
			this.ins?.$emit("select", { tipsIndex, legendIndex, index: this.oldTipsName });
		}
	}
	touchStart(e: UniTouchEvent) {
		e.target!.getBoundingClientRectAsync()!.then((res: DOMRect) => {
			this.canvasRect = res;
			const curBar = this.getTouchCurrent(e);
			if (curBar != -1) {
				if (curBar != this.oldTipsName && this.oldTipsName != -1) {
					const oldDraw = this.getDrawCharts(this.oldTipsName)!;
					oldDraw.opts.DOMRect = null;
					oldDraw.clearTooltip();
				}
				this.oldTipsName = curBar;
				const curDraw = this.getDrawCharts(this.oldTipsName)!;
				if (curDraw.opts.enableScroll) {
					curDraw.opts.DOMRect = res;
					curDraw.scrollStart(e);
				}
			}
		});
	}
	touchMove(e: UniTouchEvent) {
		if (this.oldTipsName != -1) {
			const curDraw = this.getDrawCharts(this.oldTipsName)!;
			if (curDraw.opts.enableScroll) {
				curDraw.scroll(e);
			}
		}
	}
	touchEnd(e: UniTouchEvent) {
		if (this.oldTipsName != -1) {
			const curDraw = this.getDrawCharts(this.oldTipsName)!;
			if (curDraw.opts.enableScroll) {
				curDraw.scrollEnd(e);
			}
		}
	}
	setInsMethod(e: ComponentPublicInstance, rect: DOMRect) {
		this.ins = e;
		this.baseX = rect.x;
		this.baseY = rect.y;
	}
	setContext(context: CanvasContext) {
		this.canvasContext = context;
		const ctx = context.getContext("2d")!;
		this.context = ctx;
		const canvas = ctx.canvas;
		this.offsetWidth = canvas.offsetWidth;
		this.offsetHeight = canvas.offsetHeight;
	}
	getDrawCharts(name: number): TuiDrawCharts | null {
		return this.chartsMap.get(name)!;
	}
	add(name: number, option: UTSJSONObject): TuiDrawCharts {
		const ctx = this.context!;
		set(option, "context", ctx);
		if (isNull(option.width)) {
			set(option, "width", ctx.canvas.offsetWidth);
		}
		if (isNull(option.height)) {
			set(option, "height", ctx.canvas.offsetHeight);
		}
		set(option, "pixelRatio", 1);
		set(option, "canvas2d", true);
		set(option, "canvasContext", this.canvasContext);
		if (isNull(option.padding)) {
			set(option, "padding", [0, 0, 0, 0]);
		}
		if (isNull(option.series)) {
			set(option, "series", [] as UTSJSONObject[]);
		}
		const charts = new TuiDrawCharts(option);
		this.chartsMap.set(name, charts);
		this.option = option;
		return charts;
	}
}
