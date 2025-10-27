import { optionsInit, updateOptions } from "./init";
import { type TouchPosition, ChartScrollOption } from "./Interface";
import { TuiChartConfig } from "./config";
import { TuiChartsEvent } from "./chartsEvent";
import {
	ChartOptionsTooltipOption,
	ChartOptions,
	ChartOptionsSeries,
	ChartOptionsTooltip,
	TextList,
	Offset,
	ChartOptionsXAxis,
	type TuiChartsInterface
} from "./type";
import {
	drawCharts,
	getTouches,
	Animation,
	findCandleChartCurrentIndex,
	getMixToolTipData,
	findMapChartCurrentIndex,
	getCandleToolTipData,
	findWordChartCurrentIndex,
	findFunnelChartCurrentIndex,
	findRadarChartCurrentIndex,
	findRoseChartCurrentIndex,
	findPieChartCurrentIndex,
	findCurrentIndex,
	getSeriesDataItem,
	getToolTipData,
	calYAxisData,
	getXAxisPoints,
	calValidDistance,
	findLegendIndex,
	findBarChartCurrentIndex
} from "./util";
import { get, isNull } from "./common";
// ChartOptionsYAxis, ChartOptionsLegend, ChartOptionsExtra,
export class TuiDrawCharts implements TuiChartsInterface {
	opts: ChartOptions;
	context: CanvasRenderingContext2D;
	uevent: TuiChartsEvent = new TuiChartsEvent();
	config: TuiChartConfig;
	scrollOption = new ChartScrollOption();
	animationInstance: Animation | null = null;
	offsetWidth: number;
	offsetHeight: number;
	constructor(option: UTSJSONObject) {
		this.context = option["context"] as CanvasRenderingContext2D;
		const _opts = optionsInit(option);
		const conf = new TuiChartConfig();
		this.offsetWidth = this.context.canvas.offsetWidth;
		this.offsetHeight = this.context.canvas.offsetHeight;
		conf.fontSize = _opts.fontSize * _opts.pixelRatio;
		if (_opts.color != null) conf.color = _opts.color!;
		if (_opts.type == "pie") {
			if (_opts.dataLabel == false) {
				conf.pieChartLinePadding = 0;
			} else {
				conf.pieChartLinePadding = _opts.extra.pie!.labelWidth * _opts.pixelRatio;
			}
		}
		if (_opts.type == "ring") {
			if (_opts.dataLabel == false) {
				conf.pieChartLinePadding = 0;
			} else {
				conf.pieChartLinePadding = _opts.extra.ring!.labelWidth * _opts.pixelRatio;
			}
		}
		if (_opts.type == "rose") {
			if (_opts.dataLabel == false) {
				conf.pieChartLinePadding = 0;
			} else {
				conf.pieChartLinePadding = _opts.extra.rose!.labelWidth * _opts.pixelRatio;
			}
		}
		if (_opts.dataLabel == false) {
			conf.pieChartTextPadding = 0;
		} else {
			conf.pieChartTextPadding = conf.pieChartTextPadding * _opts.pixelRatio;
		}
		conf.rotate = _opts.rotate;
		this.config = conf;
		this.opts = _opts;
	}
	setCoordinates(e: UTSJSONObject) {
		if (!isNull(e.height)) this.opts.height = get(e, "height") as number;
		if (!isNull(e.width)) this.opts.width = get(e, "width") as number;
		if (!isNull(e.yOffset)) this.opts.yOffset = get(e, "yOffset") as number;
		if (!isNull(e.xOffset)) this.opts.xOffset = get(e, "xOffset") as number;
	}
	draw() {
		drawCharts(this, this.opts.type, this.opts, this.config, this.context);
	}
	clearTooltip() {
		if (this.opts.tooltip != null) {
			this.opts.animation = false;
			this.opts.tooltip = null;
			this.draw();
		}
	}
	update(data: UTSJSONObject) {
		// let data = arguments.length > 0 && arguments[0] != undefined ? arguments[0] : {};
		// this.opts = assign({}, this.opts, data);
		// this.opts = UTSJSONObject.assign(this.opts, data);
		this.opts = updateOptions(this.opts, data);
		this.opts.updateData = true;
		this.opts.animation = true;
		this.opts.tooltip = null;
		let scrollPosition = get(data, "scrollPosition") ?? "current";
		switch (scrollPosition) {
			case "current":
				this.opts._scrollDistance_ = this.scrollOption.currentOffset;
				break;
			case "left":
				this.opts._scrollDistance_ = 0;
				this.scrollOption.currentOffset = 0;
				this.scrollOption.startTouchX = 0;
				this.scrollOption.distance = 0;
				this.scrollOption.lastMoveTime = 0;
				break;
			case "right":
				let _calYAxisData = calYAxisData(this.opts.series!, this.opts, this.config);
				let yAxisWidth = _calYAxisData.yAxisWidth!;
				this.config.yAxisWidth = yAxisWidth; //这里类型后续需要兼容才行
				let offsetLeft = 0;
				let _getXAxisPoints0 = getXAxisPoints(
					this.opts.categories!,
					this.opts,
					this.config
				);
				let xAxisPoints = _getXAxisPoints0.xAxisPoints;
				let startX = _getXAxisPoints0.startX!;
				let endX = _getXAxisPoints0.endX!;
				let eachSpacing = _getXAxisPoints0.eachSpacing!;
				let totalWidth = eachSpacing * (xAxisPoints.length - 1);
				let screenWidth = endX - startX;
				offsetLeft = screenWidth - totalWidth;
				this.scrollOption.currentOffset = offsetLeft;
				this.scrollOption.startTouchX = offsetLeft;
				this.scrollOption.distance = 0;
				this.scrollOption.lastMoveTime = 0;
				this.opts._scrollDistance_ = offsetLeft;
				break;
		}
		drawCharts(this, this.opts.type, this.opts, this.config, this.context);
	}
	zoom(e: ChartOptionsXAxis | null) {
		let val: ChartOptionsXAxis = e ?? this.opts.xAxis;
		if (this.opts.enableScroll != true) {
			console.log("[uCharts] 请启用滚动条后使用");
			return;
		}
		//当前屏幕中间点
		let centerPoint =
			Math.round(
				Math.abs(this.scrollOption.currentOffset) / this.opts.chartData.eachSpacing
			) + Math.round(this.opts.xAxis.itemCount / 2);
		this.opts.animation = false;
		this.opts.xAxis.itemCount = val.itemCount;
		//重新计算x轴偏移距离
		let _calYAxisData = calYAxisData(this.opts.series!, this.opts, this.config);
		let yAxisWidth = _calYAxisData.yAxisWidth!;
		this.config.yAxisWidth = yAxisWidth;
		let offsetLeft = 0;
		let _getXAxisPoints0 = getXAxisPoints(this.opts.categories!, this.opts, this.config);
		let xAxisPoints = _getXAxisPoints0.xAxisPoints;
		let startX = _getXAxisPoints0.startX!;
		let endX = _getXAxisPoints0.endX!;
		let eachSpacing = _getXAxisPoints0.eachSpacing!;
		let centerLeft = eachSpacing * centerPoint;
		let screenWidth = endX - startX;
		let MaxLeft = screenWidth - eachSpacing * (xAxisPoints.length - 1);
		offsetLeft = screenWidth / 2 - centerLeft;
		if (offsetLeft > 0) {
			offsetLeft = 0;
		}
		if (offsetLeft < MaxLeft) {
			offsetLeft = MaxLeft;
		}
		this.scrollOption.currentOffset = offsetLeft;
		this.scrollOption.startTouchX = 0;
		this.scrollOption.distance = 0;
		this.scrollOption.lastMoveTime = 0;
		calValidDistance(this, offsetLeft, this.opts.chartData, this.opts);
		this.opts._scrollDistance_ = offsetLeft;
		drawCharts(this, this.opts.type, this.opts, this.config, this.context);
	}
	dobuleZoom(e: UniTouchEvent) {
		//问题有点多暂时不翻译
		// if (this.opts.enableScroll != true) {
		// 	console.log('[uCharts] 请启用滚动条后使用')
		// 	return;
		// }
		// const tcs : Touch[] = e.changedTouches;
		// if (tcs.length < 2) {
		// 	return;
		// }
		// // for (let i = 0; i < tcs.length; i++) {
		// // 	tcs[i].x = tcs[i].x ? tcs[i].x : tcs[i].clientX;
		// // 	tcs[i].y = tcs[i].y ? tcs[i].y : tcs[i].clientY;
		// // }
		// const ntcs = [getTouches(this.opts, e, 0), getTouches(this.opts, e, 1)];
		// const xlength = Math.abs(ntcs[0].x - ntcs[1].x);
		// // 记录初始的两指之间的数据
		// if (!this.scrollOption.moveCount) {
		// 	let cts0 = { changedTouches: [{ x: tcs[0].clientX, y: this.opts.area[0] / this.opts.pixelRatio + 2 }] };
		// 	let cts1 = { changedTouches: [{ x: tcs[1].clientX, y: this.opts.area[0] / this.opts.pixelRatio + 2 }] };
		// 	if (this.opts.rotate) {
		// 		cts0 = { changedTouches: [{ x: this.opts.height / this.opts.pixelRatio - this.opts.area[0] / this.opts.pixelRatio - 2, y: tcs[0].clientY }] };
		// 		cts1 = { changedTouches: [{ x: this.opts.height / this.opts.pixelRatio - this.opts.area[0] / this.opts.pixelRatio - 2, y: tcs[1].clientY }] };
		// 	}
		// 	const moveCurrent1 = this.getCurrentDataIndex(cts0).index;
		// 	const moveCurrent2 = this.getCurrentDataIndex(cts1).index;
		// 	const moveCount = Math.abs(moveCurrent1 - moveCurrent2);
		// 	this.scrollOption.moveCount = moveCount;
		// 	this.scrollOption.moveCurrent1 = Math.min(moveCurrent1, moveCurrent2);
		// 	this.scrollOption.moveCurrent2 = Math.max(moveCurrent1, moveCurrent2);
		// 	return;
		// }
		// let currentEachSpacing = xlength / this.scrollOption.moveCount;
		// let itemCount = (this.opts.width - this.opts.area[1] - this.opts.area[3]) / currentEachSpacing;
		// itemCount = itemCount <= 2 ? 2 : itemCount;
		// itemCount = itemCount >= this.opts.categories.length ? this.opts.categories.length : itemCount;
		// this.opts.animation = false;
		// this.opts.xAxis.itemCount = itemCount;
		// // 重新计算滚动条偏移距离
		// let offsetLeft = 0;
		// let _getXAxisPoints0 = getXAxisPoints(this.opts.categories, this.opts, this.config),
		// 	xAxisPoints = _getXAxisPoints0.xAxisPoints,
		// 	startX = _getXAxisPoints0.startX,
		// 	endX = _getXAxisPoints0.endX,
		// 	eachSpacing = _getXAxisPoints0.eachSpacing;
		// let currentLeft = eachSpacing * this.scrollOption.moveCurrent1;
		// let screenWidth = endX - startX;
		// let MaxLeft = screenWidth - eachSpacing * (xAxisPoints.length - 1);
		// offsetLeft = -currentLeft + Math.min(ntcs[0].x, ntcs[1].x) - this.opts.area[3] - eachSpacing;
		// if (offsetLeft > 0) {
		// 	offsetLeft = 0;
		// }
		// if (offsetLeft < MaxLeft) {
		// 	offsetLeft = MaxLeft;
		// }
		// this.scrollOption.currentOffset = offsetLeft;
		// this.scrollOption.startTouchX = 0;
		// this.scrollOption.distance = 0;
		// calValidDistance(this, offsetLeft, this.opts.chartData, this.config, this.opts);
		// this.opts._scrollDistance_ = offsetLeft;
		// drawCharts(this, this.opts.type, this.opts, this.config, this.context);
	}
	// stopAnimation() {
	// 	this.animationInstance && this.animationInstance.stop();
	// }
	// addEventListener(type, listener) {
	// 	this.uevent.addEventListener(type, listener);
	// }
	// delEventListener(type) {
	// 	this.uevent.delEventListener(type);
	// }
	getLegendDataIndex(e: UniEvent): number {
		let touches = getTouches(this.opts, e);
		touches.x = touches.x - this.opts.xOffset;
		touches.y = touches.y - this.opts.yOffset;
		return findLegendIndex(touches, this.opts.chartData.legendData);
	}
	touchLegend(e: UniEvent): number {
		let index = this.getLegendDataIndex(e);
		if (index >= 0) {
			this.clearTooltip();
			if (this.opts.type == "candle") {
				this.opts.seriesMA![index].show = !this.opts.seriesMA![index].show;
			} else {
				this.opts.series![index].show = !this.opts.series![index].show;
			}
			this.opts.animation = true;
			this.opts._scrollDistance_ = this.scrollOption.currentOffset;
			drawCharts(this, this.opts.type, this.opts, this.config, this.context);
		}
		return index;
	}
	// translate(distance) {
	// this.scrollOption = {
	// 	currentOffset: distance,
	// 	startTouchX: distance,
	// 	distance: 0,
	// 	lastMoveTime: 0
	// };
	// let opts = assign({}, this.opts, {
	// 	_scrollDistance_: distance,
	// 	animation: false
	// });
	// drawCharts.call(this, this.opts.type, opts, this.config, this.context);
	// }
	scrollStart(e: UniEvent) {
		let touches = getTouches(this.opts, e);
		if (this.opts.enableScroll == true) {
			this.scrollOption.startTouchX = touches.x;
		}
	}
	scroll(e: UniEvent) {
		this.opts.showTooltip = false;
		if (this.scrollOption.lastMoveTime == 0) {
			this.scrollOption.lastMoveTime = Date.now();
		}
		let Limit = this.opts.touchMoveLimit;
		let currMoveTime = Date.now();
		let duration = currMoveTime - this.scrollOption.lastMoveTime;
		if (duration < Math.floor(1000 / Limit)) return;
		if (this.scrollOption.startTouchX == 0) return;
		this.scrollOption.lastMoveTime = currMoveTime;
		if (this.opts.enableScroll == true) {
			let touches = getTouches(this.opts, e);
			let _distance = touches.x - this.scrollOption.startTouchX;
			let currentOffset = this.scrollOption.currentOffset;
			let validDistance = calValidDistance(
				this,
				currentOffset + _distance,
				this.opts.chartData,
				this.opts
			);
			_distance = validDistance - currentOffset;
			// 将计算出的滚动距离赋值给this.scrollOption.distance
			this.scrollOption.distance = _distance;
			this.opts._scrollDistance_ = currentOffset + _distance;
			this.opts.animation = false;
			drawCharts(this, this.opts.type, this.opts, this.config, this.context);
			// return currentOffset + _distance;
		}
	}
	scrollEnd(e: UniEvent) {
		if (this.opts.enableScroll == true) {
			let _scrollOption = this.scrollOption;
			let currentOffset = _scrollOption.currentOffset;
			let distance = _scrollOption.distance;
			this.scrollOption.currentOffset = currentOffset + distance;
			this.scrollOption.distance = 0;
			this.scrollOption.moveCount = 0;
		}
	}
	showToolTip(...args: any[]): number {
		let tipsIndex: number = -1;
		const opts: ChartOptions = this.opts;
		if (opts.extra.tooltip != null) {
			this.opts.showTooltip = true;
			const e = args[0] as UniEvent;
			const option: ChartOptionsTooltipOption =
				args.length > 1 && args[1] != null
					? (args[1] as ChartOptionsTooltipOption)
					: new ChartOptionsTooltipOption();
			const _touches$: TouchPosition = getTouches(this.opts, e);
			const currentOffset: number = this.scrollOption.currentOffset;
			opts._scrollDistance_ = currentOffset;
			opts.animation = false;
			if (
				this.opts.type == "line" ||
				this.opts.type == "area" ||
				this.opts.type == "column" ||
				this.opts.type == "scatter" ||
				this.opts.type == "bubble"
			) {
				let current: ChartOptionsTooltip = this.getCurrentDataIndex(e);
				let index: any | null = option.index == null ? current.index : option.index;
				if (index != null && (index as number) > -1) {
					tipsIndex = index as number;
					let seriesData = getSeriesDataItem(this.opts.series!, index, current.group);
					if (seriesData.length != 0) {
						const _getToolTipData: ChartOptionsTooltipOption = getToolTipData(
							seriesData,
							this.opts,
							index,
							current.group,
							this.opts.categories!,
							option
						);
						const textList: TextList[] = _getToolTipData.textList!;
						const offset: Offset = _getToolTipData.offset!;
						offset.y = _touches$.y;
						opts.tooltip = new ChartOptionsTooltip();
						opts.tooltip!.textList =
							option.textList != null ? option.textList! : textList;
						opts.tooltip!.offset = option.offset != null ? option.offset! : offset;
						opts.tooltip!.option = option;
						opts.tooltip!.index = index;
						opts.tooltip!.group = current.group;
					}
				} else {
					this.clearTooltip();
				}
				drawCharts(this, opts.type, opts, this.config, this.context);
			}
			if (this.opts.type == "mount") {
				let index: any | null =
					option.index == null ? this.getCurrentDataIndex(e).index : option.index;
				if (index != null) {
					tipsIndex = index as number;
					if ((index as number) > -1) {
						this.opts.animation = false;
						let opts = this.opts;
						let seriesData = opts._series_![index as number];
						const textlist: TextList = new TextList();
						if (option.formatter != null) {
							const fun = option.formatter as (
								seriesData: ChartOptionsSeries,
								index: number,
								opts: ChartOptions
							) => string;
							textlist.text = fun(seriesData, index, opts);
						} else {
							textlist.text = seriesData.name + ": " + seriesData.data![0].value;
						}
						textlist.color = seriesData.color!;
						textlist.legendShape =
							this.opts.extra.tooltip!.legendShape == "auto"
								? seriesData.legendShape!
								: this.opts.extra.tooltip!.legendShape;
						const textList: TextList[] = [textlist];
						const offset = new Offset();
						offset.x = opts.chartData.calPoints![0][index].x;
						offset.y = _touches$.y;
						opts.tooltip = new ChartOptionsTooltip();
						opts.tooltip!.textList =
							option.textList != null ? option.textList! : textList;
						opts.tooltip!.offset = option.offset != null ? option.offset! : offset;
						opts.tooltip!.option = option;
						opts.tooltip!.index = index;
					}
				} else {
					this.clearTooltip();
				}
				drawCharts(this, opts.type, opts, this.config, this.context);
			}
			if (this.opts.type == "bar") {
				let current = this.getCurrentDataIndex(e);
				let index: any | null = option.index == null ? current.index : option.index;
				if (index != null) {
					tipsIndex = index as number;
					if ((index as number) > -1) {
						let seriesData = getSeriesDataItem(this.opts.series!, index, current.group);
						if (seriesData.length != 0) {
							let _getToolTipData = getToolTipData(
								seriesData,
								this.opts,
								index,
								current.group,
								this.opts.categories!,
								option
							);
							let textList = _getToolTipData.textList!;
							let offset = _getToolTipData.offset!;
							offset.x = _touches$.x;
							offset.y = offset.y + this.opts.yOffset;
							opts.tooltip = new ChartOptionsTooltip();
							opts.tooltip!.textList =
								option.textList != null ? option.textList! : textList;
							opts.tooltip!.offset = option.offset != null ? option.offset! : offset;
							opts.tooltip!.option = option;
							opts.tooltip!.index = index;
						}
					}
				} else {
					this.clearTooltip();
				}
				drawCharts(this, opts.type, opts, this.config, this.context);
			}
			if (this.opts.type == "mix") {
				let current = this.getCurrentDataIndex(e);
				let index: any | null = option.index == null ? current.index : option.index;
				if (index != null) {
					tipsIndex = index as number;
					if ((index as number) > -1) {
						let currentOffset = this.scrollOption.currentOffset;
						let opts = this.opts;
						opts._scrollDistance_ = currentOffset;
						opts.animation = false;
						let seriesData = getSeriesDataItem(this.opts.series!, index, current.group);
						if (seriesData.length != 0) {
							let _getMixToolTipData = getMixToolTipData(
								seriesData,
								this.opts,
								index,
								this.opts.categories!,
								option
							);
							let textList = _getMixToolTipData.textList!;
							let offset = _getMixToolTipData.offset!;
							offset.y = _touches$.y;
							opts.tooltip = new ChartOptionsTooltip();
							opts.tooltip!.textList =
								option.textList != null ? option.textList! : textList;
							opts.tooltip!.offset = option.offset != null ? option.offset! : offset;
							opts.tooltip!.option = option;
							opts.tooltip!.index = index;
						}
					}
				} else {
					this.clearTooltip();
				}
				drawCharts(this, opts.type, opts, this.config, this.context);
			}
			if (this.opts.type == "candle") {
				let current = this.getCurrentDataIndex(e);
				let index: any | null = option.index == null ? current.index : option.index;
				if (index != null) {
					tipsIndex = index as number;
					if ((index as number) > -1) {
						let currentOffset = this.scrollOption.currentOffset;
						let opts = this.opts;
						opts._scrollDistance_ = currentOffset;
						opts.animation = false;
						let seriesData = getSeriesDataItem(this.opts.series!, index, current.group);
						if (seriesData.length != 0) {
							let _getToolTipData = getCandleToolTipData(
								this.opts.series![0].dataArr,
								seriesData,
								this.opts,
								index,
								this.opts.categories!,
								this.opts.extra.candle!,
								option
							);
							let textList = _getToolTipData.textList!;
							let offset = _getToolTipData.offset!;
							offset.y = _touches$.y;
							opts.tooltip = new ChartOptionsTooltip();
							opts.tooltip!.textList = option.textList ?? textList;
							opts.tooltip!.offset = option.offset ?? offset;
							opts.tooltip!.option = option;
							opts.tooltip!.index = index;
						}
					}
				} else {
					this.clearTooltip();
				}
				drawCharts(this, opts.type, opts, this.config, this.context);
			}
			if (
				this.opts.type == "pie" ||
				this.opts.type == "ring" ||
				this.opts.type == "rose" ||
				this.opts.type == "funnel"
			) {
				let index: any | null =
					option.index == null ? this.getCurrentDataIndex(e).index! : option.index;
				if (index != null) {
					tipsIndex = index as number;
					if ((index as number) > -1) {
						let opts = this.opts;
						opts.animation = false;
						let seriesData: ChartOptionsSeries = opts._series_![index as number];
						const textlist: TextList = new TextList();
						if (option.formatter != null) {
							const fun = option.formatter as (
								seriesData: ChartOptionsSeries,
								index: any,
								opts: ChartOptions
							) => string;
							textlist.text = fun(seriesData, index, opts);
						} else {
							textlist.text = seriesData.name + ": " + seriesData.data![0].value;
						}
						textlist.color = seriesData.color!;
						textlist.legendShape =
							this.opts.extra.tooltip!.legendShape == "auto"
								? seriesData.legendShape!
								: this.opts.extra.tooltip!.legendShape;
						const textList: TextList[] = [textlist];

						let offset = new Offset();
						offset.x = _touches$.x;
						offset.y = _touches$.y;
						opts.tooltip = new ChartOptionsTooltip();
						opts.tooltip!.textList =
							option.textList != null ? option.textList! : textList;
						opts.tooltip!.offset = option.offset != null ? option.offset! : offset;
						opts.tooltip!.option = option;
						opts.tooltip!.index = index;
					} else {
						this.clearTooltip();
					}
					drawCharts(this, opts.type, opts, this.config, this.context);
				}
			}
			if (this.opts.type == "map") {
				let index: any | null =
					option.index == null ? this.getCurrentDataIndex(e).index : option.index;
				if (index != null) {
					tipsIndex = index as number;
					if ((index as number) > -1) {
						let opts = this.opts;
						opts.animation = false;
						let seriesData = this.opts.series![index];
						seriesData.name = seriesData.properties.name;
						const textList: TextList[] = [];
						const text = new TextList();
						if (option.formatter != null) {
							const fun = option.formatter as (
								item: ChartOptionsSeries,
								index: number,
								opts: ChartOptions
							) => string;
							text.text = fun(seriesData, index, this.opts);
						} else {
							text.text = seriesData.name!;
						}

						text.color = seriesData.color!;
						text.legendShape =
							this.opts.extra.tooltip!.legendShape == "auto"
								? seriesData.legendShape!
								: this.opts.extra.tooltip!.legendShape;
						textList.push(text);
						const offset = new Offset();
						offset.x = _touches$.x - this.opts.xOffset;
						offset.y = _touches$.y - this.opts.yOffset;
						opts.tooltip = new ChartOptionsTooltip();
						opts.tooltip!.textList =
							option.textList != null ? option.textList! : textList;
						opts.tooltip!.offset = option.offset != null ? option.offset! : offset;
						opts.tooltip!.option = option;
						opts.tooltip!.index = index;
					} else {
						this.clearTooltip();
					}
					opts.updateData = false;
					drawCharts(this, opts.type, opts, this.config, this.context);
				}
			}
			if (this.opts.type == "word") {
				let index: any | null =
					option.index == null ? this.getCurrentDataIndex(e).index : option.index;
				if (index != null) {
					tipsIndex = index as number;
					if ((index as number) > -1) {
						let opts = this.opts;
						opts.animation = false;
						let seriesData = this.opts.series![index as number];
						const textlist: TextList = new TextList();
						if (option.formatter != null) {
							const fun = option.formatter as (
								seriesData: ChartOptionsSeries,
								index: any,
								opts: ChartOptions
							) => string;
							textlist.text = fun(seriesData, index, opts);
						} else {
							textlist.text = seriesData.name!;
						}
						textlist.color = seriesData.color!;
						textlist.legendShape =
							this.opts.extra.tooltip!.legendShape == "auto"
								? seriesData.legendShape!
								: this.opts.extra.tooltip!.legendShape;
						const textList: TextList[] = [textlist];

						let offset = new Offset();
						offset.x = _touches$.x;
						offset.y = _touches$.y;
						opts.tooltip = new ChartOptionsTooltip();
						opts.tooltip!.textList =
							option.textList != null ? option.textList! : textList;
						opts.tooltip!.offset = option.offset != null ? option.offset! : offset;
						opts.tooltip!.option = option;
						opts.tooltip!.index = index;
					} else {
						this.clearTooltip();
					}
					opts.updateData = false;
					drawCharts(this, opts.type, opts, this.config, this.context);
				}
			}
			if (this.opts.type == "radar") {
				const current = this.getCurrentDataIndex(e);
				let index = option.index == null ? current.index : option.index;
				if (index != null) {
					tipsIndex = index as number;
					if ((index as number) > -1) {
						let opts = this.opts;
						opts.animation = false;
						let seriesData = getSeriesDataItem(this.opts.series!, index, current.group);
						if (seriesData.length != 0) {
							let textList: TextList[] = seriesData.map(
								(item: ChartOptionsSeries): TextList => {
									const list = new TextList();
									if (option.formatter != null) {
										const fun = option.formatter as (
											item: ChartOptionsSeries,
											categories: string,
											index: number,
											opts: ChartOptions
										) => string;
										list.text = fun(
											item,
											this.opts.categories![index],
											index,
											this.opts
										);
									} else {
										list.text = item.name + ": " + item.data![0].value!;
									}
									list.color = item.color!;
									list.legendShape =
										this.opts.extra.tooltip!.legendShape == "auto"
											? item.legendShape!
											: this.opts.extra.tooltip!.legendShape;
									return list;
								}
							);
							let offset = new Offset();
							offset.x = _touches$.x;
							offset.y = _touches$.y;
							opts.tooltip = new ChartOptionsTooltip();
							opts.tooltip!.textList =
								option.textList != null ? option.textList! : textList;
							opts.tooltip!.offset = option.offset != null ? option.offset! : offset;
							opts.tooltip!.option = option;
							opts.tooltip!.index = index;
						}
					} else {
						this.clearTooltip();
					}
					drawCharts(this, opts.type, opts, this.config, this.context);
				}
			}
		}
		return tipsIndex;
	}
	getCurrentDataIndex(e: UniEvent): ChartOptionsTooltip {
		let tooltip: ChartOptionsTooltip = new ChartOptionsTooltip();
		let _touches$: TouchPosition = getTouches(this.opts, e);
		_touches$.x = _touches$.x - this.opts.xOffset;
		_touches$.y = _touches$.y - this.opts.yOffset;
		if (this.opts.type == "pie" || this.opts.type == "ring") {
			return findPieChartCurrentIndex(_touches$, this.opts.chartData.pieData!, this.opts);
		} else if (this.opts.type == "rose") {
			return findRoseChartCurrentIndex(_touches$, this.opts.chartData.pieData!, this.opts);
		} else if (this.opts.type == "radar") {
			return findRadarChartCurrentIndex(
				_touches$,
				this.opts.chartData.radarData!,
				this.opts.categories!.length
			);
		} else if (this.opts.type == "funnel") {
			_touches$.x = _touches$.x + this.opts.xOffset;
			_touches$.y = _touches$.y + this.opts.yOffset;
			return findFunnelChartCurrentIndex(_touches$, this.opts.chartData.funnelData!);
		} else if (this.opts.type == "map") {
			return findMapChartCurrentIndex(_touches$, this.opts);
		} else if (this.opts.type == "word") {
			return findWordChartCurrentIndex(_touches$, this.opts.chartData.wordCloudData!);
		} else if (this.opts.type == "bar") {
			tooltip = findBarChartCurrentIndex(
				_touches$,
				this.opts.chartData.calPoints,
				this.opts,
				Math.abs(this.scrollOption.currentOffset)
			);
		} else if (this.opts.type == "candle") {
			tooltip = findCandleChartCurrentIndex(
				_touches$,
				this.opts.chartData.calMapPoints!,
				this.opts,
				Math.abs(this.scrollOption.currentOffset)
			);
		} else {
			tooltip = findCurrentIndex(
				_touches$,
				this.opts.chartData.calPoints!,
				this.opts,
				Math.abs(this.scrollOption.currentOffset)
			);
		}
		return tooltip;
	}
}
