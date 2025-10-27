import type {
	ChartRange,
	ChartColumnDataPoints,
	ChartsCandleDataPoints,
	TuiChartsInterface
} from "./type";
import {
	ChartOptionsTooltipOption,
	ChartOptionsTooltip,
	ChartOptionsExtraCandleAverage,
	ChartOptionsExtraMarkLineData,
	ChartOptionsExtraTooltip,
	ChartOptionsSeriesData,
	ChartOptionsChartDataYAxisDataYAxisWidth,
	ChartOptionsChartDataCalPoints,
	ChartOptionsChartDataCategoriesData,
	ChartOptionsChartDataXAxisData,
	ChartOptionsChartDataYAxisData,
	ChartOptions,
	ChartOptionsChartData,
	ChartOptionsChartDataLegendData,
	ChartOptionsExtraColumn,
	ChartOptionsExtraMarkLine,
	ChartOptionsSeries,
	ChartOptionsYAxisData,
	TextList,
	Offset,
	ChartOptionsChartDataLegendDataArea,
	ChartOptionsExtraMount,
	ChartOptionsExtra,
	ChartOptionsExtraBar,
	ChartOptionsChartDataToolTiPData,
	ChartOptionsExtraLine,
	ChartOptionsExtraRadar,
	ChartOptionsExtraFunnel,
	ChartCurveControlPoints,
	ChartOptionsChartDataLegendDataAreaXY,
	ChartOptionsExtraArcbar,
	ChartOptionsExtraArea,
	ChartOptionsExtraPie,
	ChartOptionsExtraMixLine,
	ChartOptionsExtraMixArea,
	ChartOptionsExtraMixColumn,
	ChartOptionsExtraCandle,
	ChartOptionsExtraGauge,
	ChartMapBounds,
	ChartOptionsChartDataMapData
} from "./type";
import { TuiChartConfig } from "./config";
import type { ChartAnimationOption, TouchPosition, ChartScrollOption } from "./Interface";
export function getToolTipData(
	seriesData: ChartOptionsSeries[],
	opts: ChartOptions,
	index: any,
	group: number[],
	categories: string[],
	option: ChartOptionsTooltipOption
): ChartOptionsTooltipOption {
	let calPoints: ChartOptionsChartDataCalPoints[][] =
		opts.chartData.calPoints != null ? opts.chartData.calPoints! : [];
	let points: ChartOptionsChartDataCalPoints = new ChartOptionsChartDataCalPoints();
	if (group.length > 0) {
		let filterPoints: ChartOptionsChartDataCalPoints[][] = [];
		for (let i = 0; i < group.length; i++) {
			filterPoints.push(calPoints[group[i]]);
		}
		points = filterPoints[0][(index as number[])[0]];
	} else {
		for (let i = 0; i < calPoints.length; i++) {
			const ix = index as number;
			const posArr: ChartOptionsChartDataCalPoints[] = calPoints[i];
			if (posArr.length > ix) {
				points = posArr[ix];
				break;
			}
		}
	}
	let textList: TextList[] = seriesData.map((item: ChartOptionsSeries): TextList => {
		let titleText = "";
		if (opts.categories != null && opts.categories!.length > 0) {
			titleText = categories[index as number];
		}
		const textitem = new TextList();
		// textitem.text = option.formatter != null ? option.formatter(item, titleText, index, opts) : titleText + ' ' + item.name + ': ' + (`${item.data.value}`)
		if (option.formatter != null) {
			const fun = option.formatter as (
				item: ChartOptionsSeries,
				titleText: string,
				index: any,
				opts: ChartOptions
			) => string;
			textitem.text = fun(item, titleText, index, opts);
		} else {
			textitem.text = titleText + " " + item.name + ": " + `${item.data![0].value}`;
		}
		textitem.color = item.color!;
		textitem.legendShape =
			opts.extra.tooltip!.legendShape == "auto"
				? item.legendShape!
				: opts.extra.tooltip!.legendShape;
		return textitem;
	});
	const offset = new Offset();
	offset.x = Math.round(points.x);
	offset.y = Math.round(points.y);
	const tooltipOption = new ChartOptionsTooltipOption();
	tooltipOption.textList = textList;
	tooltipOption.offset = offset;
	return tooltipOption;
}
function filterSeries(series: ChartOptionsSeries[]): ChartOptionsSeries[] {
	let tempSeries: ChartOptionsSeries[] = [];
	for (let i = 0; i < series.length; i++) {
		if (series[i].show == true) {
			tempSeries.push(series[i]);
		}
	}
	return tempSeries;
}
export function getSeriesDataItem(
	series: ChartOptionsSeries[],
	index: any,
	group: number[]
): ChartOptionsSeries[] {
	let data: ChartOptionsSeries[] = [];
	let newSeries: ChartOptionsSeries[] = [];
	let indexIsArr = Array.isArray(index);
	if (indexIsArr) {
		let tempSeries = filterSeries(series);
		for (let i = 0; i < group.length; i++) {
			newSeries.push(tempSeries[group[i]]);
		}
	} else {
		newSeries = series;
	}
	for (let i = 0; i < newSeries.length; i++) {
		let item: ChartOptionsSeries = newSeries[i];
		let tmpindex: number;
		if (indexIsArr) {
			tmpindex = (index as number[])[i];
		} else {
			tmpindex = index as number;
		}

		if (item.data != null && item.data!.length > 0 && item.show) {
			let seriesItem = new ChartOptionsSeries();
			seriesItem.color = item.color;
			seriesItem.type = item.type;
			seriesItem.style = item.style;
			seriesItem.pointShape = item.pointShape;
			seriesItem.disableLegend = item.disableLegend;
			seriesItem.legendShape = item.legendShape;
			seriesItem.name = item.name;
			seriesItem.show = item.show;
			// seriesItem.data = item.formatter ? item.formatter(item.data![tmpindex]) : item.data![tmpindex];
			if (item.formatter != null) {
				const fun = item.formatter as (
					e: ChartOptionsSeriesData
				) => ChartOptionsSeriesData[];
				seriesItem.data = fun(item.data![tmpindex]);
			} else {
				seriesItem.data = [item.data![tmpindex]];
			}
			data.push(seriesItem);
		}
		if (item.dataArr.length > 0 && item.show) {
			let seriesItem = new ChartOptionsSeries();
			seriesItem.color = item.color;
			seriesItem.type = item.type;
			seriesItem.style = item.style;
			seriesItem.pointShape = item.pointShape;
			seriesItem.disableLegend = item.disableLegend;
			seriesItem.legendShape = item.legendShape;
			seriesItem.name = item.name;
			seriesItem.show = item.show;
			// seriesItem.data = item.formatter ? item.formatter(item.data![tmpindex]) : item.data![tmpindex];
			if (item.formatter != null) {
				const fun = item.formatter as (e: number[]) => number[][];
				seriesItem.dataArr = fun(item.dataArr[tmpindex]);
			} else {
				seriesItem.dataArr = [item.dataArr[tmpindex]];
			}
			data.push(seriesItem);
		}
	}
	return data;
}
function isInExactChartArea(currentPoints: TouchPosition, opts: ChartOptions): boolean {
	return (
		currentPoints.x <= opts.width - opts.area[1] + 10 &&
		currentPoints.x >= opts.area[3] - 10 &&
		currentPoints.y >= opts.area[0] &&
		currentPoints.y <= opts.height - opts.area[2]
	);
}
export function findCandleChartCurrentIndex(
	currentPoints: TouchPosition,
	calPoints: ChartOptionsChartDataCalPoints[][][],
	opts: ChartOptions,
	offset: number = 0
): ChartOptionsTooltip {
	// let current = { index: -1, group: [] };
	let current: ChartOptionsTooltip = new ChartOptionsTooltip();
	let spacing: number = opts.chartData.eachSpacing / 2;
	let xAxisPoints: number[] = [];
	if (calPoints.length > 0) {
		if (opts.categories == null) {
			spacing = 0;
		} else {
			for (let i = 1; i < opts.chartData.xAxisPoints!.length; i++) {
				xAxisPoints.push(opts.chartData.xAxisPoints![i] - spacing);
			}
		}
		if (isInExactChartArea(currentPoints, opts)) {
			if (opts.categories == null) {
				// let timePoints = Array(calPoints.length);
				let timePoints: number[][] = [];
				for (let i = 0; i < calPoints.length; i++) {
					// timePoints[i] = Array(calPoints[i].length)
					const timePointsChild: number[] = [];
					for (let j = 0; j < calPoints[i].length; j++) {
						// timePoints[i][j] = (Math.abs(calPoints[i][j].x - currentPoints.x));
						// timePointsChild.push(Math.abs(calPoints[i][j].x - currentPoints.x))
					}
					timePoints.push(timePointsChild);
				}
				// let pointValue = Array(timePoints.length);
				let pointValue: number[] = [];
				let pointIndex: number[] = [];
				for (let i = 0; i < timePoints.length; i++) {
					pointValue[i] = Math.min(...timePoints[i]);
					pointIndex[i] = timePoints[i].indexOf(pointValue[i]);
				}
				let minValue = Math.min(...pointValue);
				const currentindex: number[] = [];
				for (let i = 0; i < pointValue.length; i++) {
					if (pointValue[i] == minValue) {
						current.group.push(i);
						currentindex.push(pointIndex[i]);
					}
				}
				current.index = currentindex;
			} else {
				xAxisPoints.forEach(function (item, index) {
					if (currentPoints.x + offset + spacing > item) {
						current.index = index;
					}
				});
			}
		}
	}
	return current;
}
export function findCurrentIndex(
	currentPoints: TouchPosition,
	calPoints: ChartOptionsChartDataCalPoints[][],
	opts: ChartOptions,
	offset: number = 0
): ChartOptionsTooltip {
	// let current = { index: -1, group: [] };
	let current: ChartOptionsTooltip = new ChartOptionsTooltip();
	let spacing: number = opts.chartData.eachSpacing / 2;
	let xAxisPoints: number[] = [];
	if (calPoints.length > 0) {
		if (opts.categories == null) {
			spacing = 0;
		} else {
			for (let i = 1; i < opts.chartData.xAxisPoints!.length; i++) {
				xAxisPoints.push(opts.chartData.xAxisPoints![i] - spacing);
			}
			if (
				(opts.type == "line" || opts.type == "area") &&
				opts.xAxis.boundaryGap == "justify"
			) {
				xAxisPoints = opts.chartData.xAxisPoints!;
			}
		}
		if (isInExactChartArea(currentPoints, opts)) {
			if (opts.categories == null) {
				// let timePoints = Array(calPoints.length);
				let timePoints: number[][] = [];
				for (let i = 0; i < calPoints.length; i++) {
					// timePoints[i] = Array(calPoints[i].length)
					const timePointsChild: number[] = [];
					for (let j = 0; j < calPoints[i].length; j++) {
						// timePoints[i][j] = (Math.abs(calPoints[i][j].x - currentPoints.x));
						timePointsChild.push(Math.abs(calPoints[i][j].x - currentPoints.x));
					}
					timePoints.push(timePointsChild);
				}
				// let pointValue = Array(timePoints.length);
				let pointValue: number[] = [];
				let pointIndex: number[] = [];
				for (let i = 0; i < timePoints.length; i++) {
					pointValue[i] = Math.min(...timePoints[i]);
					pointIndex[i] = timePoints[i].indexOf(pointValue[i]);
				}
				let minValue = Math.min(...pointValue);
				const currentindex: number[] = [];
				for (let i = 0; i < pointValue.length; i++) {
					if (pointValue[i] == minValue) {
						current.group.push(i);
						currentindex.push(pointIndex[i]);
					}
				}
				current.index = currentindex;
			} else {
				xAxisPoints.forEach(function (item, index) {
					if (currentPoints.x + offset + spacing > item) {
						current.index = index;
					}
				});
			}
		}
	}
	return current;
}
// function isInExactChartArea(currentPoints : TouchPosition, opts : ChartOptions, config : TuiChartConfig) : boolean {
// 	return currentPoints.x <= opts.width - opts.area[1] + 10 && currentPoints.x >= opts.area[3] - 10 && currentPoints.y >= opts.area[0] && currentPoints.y <= opts.height - opts.area[2];
// }
export function findBarChartCurrentIndex(
	currentPoints: TouchPosition,
	calPoints: ChartOptionsChartDataCalPoints[][] | null,
	opts: ChartOptions,
	offset: number = 0
): ChartOptionsTooltip {
	let current: ChartOptionsTooltip = new ChartOptionsTooltip();
	let spacing = opts.chartData.eachSpacing / 2;
	let yAxisPoints = opts.chartData.yAxisPoints!;
	if (calPoints != null && calPoints.length > 0) {
		if (isInExactChartArea(currentPoints, opts)) {
			yAxisPoints.forEach(function (item, index) {
				if (currentPoints.y + offset + spacing > item) {
					current.index = index;
				}
			});
		}
	}
	return current;
}
function isInExactLegendArea(
	currentPoints: TouchPosition,
	area: ChartOptionsChartDataLegendDataArea
): boolean {
	return (
		currentPoints.x > area.start.x &&
		currentPoints.x < area.end.x &&
		currentPoints.y > area.start.y &&
		currentPoints.y < area.end.y
	);
}
export function findLegendIndex(
	currentPoints: TouchPosition,
	legendData: ChartOptionsChartDataLegendData
): number {
	let currentIndex = -1;
	let gap = 0;
	if (isInExactLegendArea(currentPoints, legendData.area)) {
		let points: ChartOptionsSeries[][] = legendData.points;
		let index = -1;
		for (let i = 0, len = points.length; i < len; i++) {
			let item = points[i];
			for (let j = 0; j < item.length; j++) {
				index += 1;
				let area = item[j].area;
				if (
					area != null &&
					currentPoints.x > area[0] - gap &&
					currentPoints.x < area[2] + gap &&
					currentPoints.y > area[1] - gap &&
					currentPoints.y < area[3] + gap
				) {
					currentIndex = index;
					break;
				}
			}
		}
		return currentIndex;
	}
	return currentIndex;
}

export function calValidDistance(
	self: TuiChartsInterface,
	distance: number,
	chartData: ChartOptionsChartData,
	opts: ChartOptions
): number {
	let dataChartAreaWidth = opts.width - opts.area[1] - opts.area[3];
	let dataChartWidth = chartData.eachSpacing * (opts.chartData.xAxisData.xAxisPoints.length - 1);
	if (opts.type == "mount" && opts.extra.mount != null && opts.extra.mount!.widthRatio > 1) {
		if (opts.extra.mount!.widthRatio > 2) opts.extra.mount!.widthRatio = 2;
		dataChartWidth += (opts.extra.mount!.widthRatio - 1) * chartData.eachSpacing;
	}
	let validDistance = distance;
	if (distance >= 0) {
		validDistance = 0;
		self.uevent.trigger("scrollLeft");
		self.scrollOption.position = "left";
		opts.xAxis.scrollPosition = "left";
	} else if (Math.abs(distance) >= dataChartWidth - dataChartAreaWidth) {
		validDistance = dataChartAreaWidth - dataChartWidth;
		self.uevent.trigger("scrollRight");
		self.scrollOption.position = "right";
		opts.xAxis.scrollPosition = "right";
	} else {
		self.scrollOption.position = `${distance}`;
		opts.xAxis.scrollPosition = `${distance}`; //类型问题暂时还未找到翻译逻辑
	}
	return validDistance;
}

function drawToolTipSplitLine(
	offsetX: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	let toolTipOption = opts.extra.tooltip ?? new ChartOptionsExtraTooltip();
	let startY = opts.area[0] + opts.yOffset;
	let endY = opts.height - opts.area[2] + opts.yOffset;
	const xOffset = opts.xOffset;

	if (toolTipOption.gridType == "dash") {
		context.setLineDash([toolTipOption.dashLength, toolTipOption.dashLength]);
	}
	context.strokeStyle = toolTipOption.gridColor;
	context.lineWidth = 1 * opts.pixelRatio;
	context.beginPath();
	context.moveTo(offsetX + xOffset, startY);
	context.lineTo(offsetX + xOffset, endY);
	context.stroke();
	context.setLineDash([]);

	if (toolTipOption.xAxisLabel) {
		let labelText = opts.categories![opts.tooltip!.index! as number];
		context.font = `${config.fontSize}px sans-serif`;
		let textWidth = measureText(labelText, config.fontSize);
		let textX = offsetX + xOffset - 0.5 * textWidth;
		let textY = endY + 2 * opts.pixelRatio;

		context.beginPath();
		context.fillStyle = hexToRgb(toolTipOption.labelBgColor, toolTipOption.labelBgOpacity);
		context.strokeStyle = toolTipOption.labelBgColor;
		context.lineWidth = 1 * opts.pixelRatio;
		context.rect(
			textX - toolTipOption.boxPadding * opts.pixelRatio,
			textY,
			textWidth + 2 * toolTipOption.boxPadding * opts.pixelRatio,
			config.fontSize + 2 * toolTipOption.boxPadding * opts.pixelRatio
		);
		context.closePath();
		context.stroke();
		context.fill();

		context.beginPath();
		context.font = `${config.fontSize}px sans-serif`;
		context.fillStyle = toolTipOption.labelFontColor;
		context.fillText(
			labelText,
			textX,
			textY + toolTipOption.boxPadding * opts.pixelRatio + config.fontSize
		);
		context.closePath();
		context.stroke();
	}
}

function drawToolTip(
	textList: TextList[],
	offset: Offset,
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	let toolTipOption = opts.extra.tooltip!;
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	if (toolTipOption.showCategory == true && opts.categories != null) {
		const addtext = new TextList();
		addtext.text = opts.categories![parseInt(`${opts.tooltip!.index}`)];
		textList.unshift(addtext);
	}
	let fontSize = toolTipOption.fontSize * opts.pixelRatio;
	let lineHeight = toolTipOption.lineHeight * opts.pixelRatio;
	let boxPadding = toolTipOption.boxPadding * opts.pixelRatio;
	let legendWidth = fontSize;
	let legendMarginRight = 5 * opts.pixelRatio;
	if (toolTipOption.legendShow == false) {
		legendWidth = 0;
		legendMarginRight = 0;
	}
	let arrowWidth = toolTipOption.showArrow ? 8 * opts.pixelRatio : 0;
	let isOverRightBorder = false;
	if (
		opts.type == "line" ||
		opts.type == "mount" ||
		opts.type == "area" ||
		opts.type == "candle" ||
		opts.type == "mix"
	) {
		if (toolTipOption.splitLine == true) {
			// 2. 工具提示分割线添加偏移
			drawToolTipSplitLine(opts.tooltip!.offset.x, opts, config, context);
		}
	}
	offset.y -= 8 * opts.pixelRatio;
	let textWidth = textList.map(function (item: TextList): number {
		return measureText(item.text, fontSize);
	});
	let toolTipWidth = legendWidth + legendMarginRight + 4 * boxPadding + Math.max(...textWidth);
	let toolTipHeight = 2 * boxPadding + textList.length * lineHeight;
	if (toolTipOption.showBox == false) {
		return;
	}
	// 3. 边界检查添加偏移
	if (
		offset.x - Math.abs(opts._scrollDistance_ ?? 0) + arrowWidth + toolTipWidth >
		opts.width + xOffset
	) {
		isOverRightBorder = true;
	}
	if (toolTipHeight + offset.y > opts.height + yOffset) {
		offset.y = opts.height + yOffset - toolTipHeight;
	}
	// 绘制背景矩形
	context.beginPath();
	context.fillStyle = hexToRgb(toolTipOption.bgColor, toolTipOption.bgOpacity);
	context.lineWidth = toolTipOption.borderWidth * opts.pixelRatio;
	context.strokeStyle = hexToRgb(toolTipOption.borderColor, toolTipOption.borderOpacity);
	let radius = toolTipOption.borderRadius;
	if (isOverRightBorder) {
		// 4. 右侧边界处理添加偏移
		if (toolTipWidth + arrowWidth > opts.width) {
			offset.x =
				opts.width +
				Math.abs(opts._scrollDistance_ ?? 0) +
				arrowWidth +
				(toolTipWidth - opts.width) +
				xOffset;
		}
		if (toolTipWidth > offset.x) {
			offset.x =
				opts.width +
				Math.abs(opts._scrollDistance_ ?? 0) +
				arrowWidth +
				(toolTipWidth - opts.width) +
				xOffset;
		}
		if (toolTipOption.showArrow) {
			context.moveTo(offset.x, offset.y + 10 * opts.pixelRatio);
			context.lineTo(
				offset.x - arrowWidth,
				offset.y + 10 * opts.pixelRatio + 5 * opts.pixelRatio
			);
		}
		context.arc(
			offset.x - arrowWidth - radius,
			offset.y + toolTipHeight - radius,
			radius,
			0,
			Math.PI / 2,
			false
		);
		context.arc(
			offset.x - arrowWidth - Math.round(toolTipWidth) + radius,
			offset.y + toolTipHeight - radius,
			radius,
			Math.PI / 2,
			Math.PI,
			false
		);
		context.arc(
			offset.x - arrowWidth - Math.round(toolTipWidth) + radius,
			offset.y + radius,
			radius,
			-Math.PI,
			-Math.PI / 2,
			false
		);
		context.arc(
			offset.x - arrowWidth - radius,
			offset.y + radius,
			radius,
			-Math.PI / 2,
			0,
			false
		);
		if (toolTipOption.showArrow) {
			context.lineTo(
				offset.x - arrowWidth,
				offset.y + 10 * opts.pixelRatio - 5 * opts.pixelRatio
			);
			context.lineTo(offset.x, offset.y + 10 * opts.pixelRatio);
		}
	} else {
		if (toolTipOption.showArrow) {
			context.moveTo(offset.x, offset.y + 10 * opts.pixelRatio);
			context.lineTo(
				offset.x + arrowWidth,
				offset.y + 10 * opts.pixelRatio - 5 * opts.pixelRatio
			);
		}
		context.arc(
			offset.x + arrowWidth + radius,
			offset.y + radius,
			radius,
			-Math.PI,
			-Math.PI / 2,
			false
		);
		context.arc(
			offset.x + arrowWidth + Math.round(toolTipWidth) - radius,
			offset.y + radius,
			radius,
			-Math.PI / 2,
			0,
			false
		);
		context.arc(
			offset.x + arrowWidth + Math.round(toolTipWidth) - radius,
			offset.y + toolTipHeight - radius,
			radius,
			0,
			Math.PI / 2,
			false
		);
		context.arc(
			offset.x + arrowWidth + radius,
			offset.y + toolTipHeight - radius,
			radius,
			Math.PI / 2,
			Math.PI,
			false
		);
		if (toolTipOption.showArrow) {
			context.lineTo(
				offset.x + arrowWidth,
				offset.y + 10 * opts.pixelRatio + 5 * opts.pixelRatio
			);
			context.lineTo(offset.x, offset.y + 10 * opts.pixelRatio);
		}
	}
	context.closePath();
	context.fill();
	if (toolTipOption.borderWidth > 0) {
		context.stroke();
	}
	// 绘制图例
	if (toolTipOption.legendShow) {
		textList.forEach(function (item, index) {
			if (item.color != "") {
				context.beginPath();
				context.fillStyle = item.color;
				let startX = offset.x + arrowWidth + 2 * boxPadding;
				let startY =
					offset.y + (lineHeight - fontSize) / 2 + lineHeight * index + boxPadding + 1;
				if (isOverRightBorder) {
					startX = offset.x - toolTipWidth - arrowWidth + 2 * boxPadding;
				}
				switch (item.legendShape) {
					case "line":
						context.moveTo(startX, startY + 0.5 * legendWidth - 2 * opts.pixelRatio);
						context.fillRect(
							startX,
							startY + 0.5 * legendWidth - 2 * opts.pixelRatio,
							legendWidth,
							4 * opts.pixelRatio
						);
						break;
					case "triangle":
						context.moveTo(
							startX + 7.5 * opts.pixelRatio,
							startY + 0.5 * legendWidth - 5 * opts.pixelRatio
						);
						context.lineTo(
							startX + 2.5 * opts.pixelRatio,
							startY + 0.5 * legendWidth + 5 * opts.pixelRatio
						);
						context.lineTo(
							startX + 12.5 * opts.pixelRatio,
							startY + 0.5 * legendWidth + 5 * opts.pixelRatio
						);
						context.lineTo(
							startX + 7.5 * opts.pixelRatio,
							startY + 0.5 * legendWidth - 5 * opts.pixelRatio
						);
						break;
					case "diamond":
						context.moveTo(
							startX + 7.5 * opts.pixelRatio,
							startY + 0.5 * legendWidth - 5 * opts.pixelRatio
						);
						context.lineTo(startX + 2.5 * opts.pixelRatio, startY + 0.5 * legendWidth);
						context.lineTo(
							startX + 7.5 * opts.pixelRatio,
							startY + 0.5 * legendWidth + 5 * opts.pixelRatio
						);
						context.lineTo(startX + 12.5 * opts.pixelRatio, startY + 0.5 * legendWidth);
						context.lineTo(
							startX + 7.5 * opts.pixelRatio,
							startY + 0.5 * legendWidth - 5 * opts.pixelRatio
						);
						break;
					case "circle":
						context.moveTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * legendWidth);
						context.arc(
							startX + 7.5 * opts.pixelRatio,
							startY + 0.5 * legendWidth,
							5 * opts.pixelRatio,
							0,
							2 * Math.PI
						);
						break;
					case "rect":
						context.moveTo(startX, startY + 0.5 * legendWidth - 5 * opts.pixelRatio);
						context.fillRect(
							startX,
							startY + 0.5 * legendWidth - 5 * opts.pixelRatio,
							15 * opts.pixelRatio,
							10 * opts.pixelRatio
						);
						break;
					case "square":
						context.moveTo(
							startX + 2 * opts.pixelRatio,
							startY + 0.5 * legendWidth - 5 * opts.pixelRatio
						);
						context.fillRect(
							startX + 2 * opts.pixelRatio,
							startY + 0.5 * legendWidth - 5 * opts.pixelRatio,
							10 * opts.pixelRatio,
							10 * opts.pixelRatio
						);
						break;
					default:
						context.moveTo(startX, startY + 0.5 * legendWidth - 5 * opts.pixelRatio);
						context.fillRect(
							startX,
							startY + 0.5 * legendWidth - 5 * opts.pixelRatio,
							15 * opts.pixelRatio,
							10 * opts.pixelRatio
						);
				}
				context.closePath();
				context.fill();
			}
		});
	}
	// 绘制文本列表
	textList.forEach((item: TextList, index: number) => {
		let startX = offset.x + arrowWidth + 2 * boxPadding + legendWidth + legendMarginRight;
		if (isOverRightBorder) {
			startX =
				offset.x -
				toolTipWidth -
				arrowWidth +
				2 * boxPadding +
				legendWidth +
				legendMarginRight;
		}
		let startY =
			offset.y +
			lineHeight * index +
			(lineHeight - fontSize) / 2 -
			1 +
			boxPadding +
			fontSize +
			4;
		context.beginPath();
		context.font = `${fontSize}px sans-serif`;
		context.textBaseline = "bottom";
		context.fillStyle = toolTipOption.fontColor;
		context.fillText(item.text, startX, startY);
		context.closePath();
		context.stroke();
	});
}

export function getTouches(opts: ChartOptions, e: UniEvent, index: number = 0): TouchPosition {
	let x: number;
	let y: number;
	let top: number = opts.DOMRect!.top;
	if (e.type == "click") {
		x = (e as UniPointerEvent).clientX;
		y = (e as UniPointerEvent).clientY;
	} else {
		x = (e as UniTouchEvent).changedTouches[index].clientX;
		y = (e as UniTouchEvent).changedTouches[index].clientY;
	}
	if (opts.rotate) {
		y = opts.height - x * opts.pixelRatio;
		x =
			(y - top - (opts.height / opts.pixelRatio / 2) * (opts.pixelRatio - 1)) *
			opts.pixelRatio;
	} else {
		x = x * opts.pixelRatio;
		y =
			(y - top - (opts.height / opts.pixelRatio / 2) * (opts.pixelRatio - 1)) *
			opts.pixelRatio;
	}
	return {
		x: x,
		y: y
	} as TouchPosition;
}

function measureText(text: string, fontSize: number): number {
	let width: number = 0;
	let textArr: string[] = text.split("");
	for (let i = 0; i < textArr.length; i++) {
		let item = textArr[i];
		if (/[a-zA-Z]/.test(item)) {
			width += 7;
		} else if (/[0-9]/.test(item)) {
			width += 5.5;
		} else if (/\./.test(item)) {
			width += 2.7;
		} else if (/-/.test(item)) {
			width += 3.25;
		} else if (/:/.test(item)) {
			width += 2.5;
		} else if (/[\u4e00-\u9fa5]/.test(item)) {
			width += 10;
		} else if (/\(|\)/.test(item)) {
			width += 3.73;
		} else if (/\s/.test(item)) {
			width += 2.5;
		} else if (/%/.test(item)) {
			width += 8;
		} else {
			width += 10;
		}
	}
	return (width * fontSize) / 10;
}

export function hexToRgb(hex: string, opacity: number = 1): string {
	const hexVal = hex.replace(";", "");
	const hexArr = hexVal.split(":");
	const toRgba = (hexNumber: string): string => {
		return (
			"rgba(" +
			parseInt("0x" + hexNumber.slice(1, 3)) +
			"," +
			parseInt("0x" + hexNumber.slice(3, 5)) +
			"," +
			parseInt("0x" + hexNumber.slice(5, 7)) +
			"," +
			opacity +
			")"
		);
	};
	if (hexArr.length > 1) {
		return `${hexArr[0]}: ${toRgba(hexArr[1])}; `;
	} else {
		return toRgba(`${hexArr[0]} `);
	}
}
function fillSeries(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig
): ChartOptionsSeries[] {
	let index = 0;
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		if (item.color == null) {
			item.color = config.color[index];
			index = (index + 1) % config.color.length;
		}
		if (item.linearIndex == null) {
			item.linearIndex = i;
		}
		if (item.index == null) {
			item.index = 0;
		}
		if (item.type == null) {
			item.type = opts.type;
		}
		// if (item.show == null) {
		// 	item.show = true;
		// }
		if (item.type == null) {
			item.type = opts.type;
		}
		// if (item.pointShape == null) {
		// 	item.pointShape = "circle";
		// }
		if (item.legendShape == null) {
			switch (item.type) {
				case "line":
					item.legendShape = "line";
					break;
				case "column":
				case "bar":
					item.legendShape = "rect";
					break;
				case "area":
				case "mount":
					item.legendShape = "triangle";
					break;
				default:
					item.legendShape = "circle";
			}
		}
	}
	return series;
}
// function filterSeries(series : ChartOptionsSeries[]) : ChartOptionsSeries[] {
// 	let tempSeries : ChartOptionsSeries[] = [];
// 	for (let i = 0; i < series.length; i++) {
// 		if (series[i].show == true) {
// 			tempSeries.push(series[i])
// 		}
// 	}
// 	return tempSeries;
// }
function calLegendData(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	chartData: ChartOptionsChartData
): ChartOptionsChartDataLegendData {
	const legendData: ChartOptionsChartDataLegendData = new ChartOptionsChartDataLegendData();
	if (opts.legend.show == false) {
		chartData.legendData = legendData;
		return legendData;
	}
	let padding = opts.legend.padding * opts.pixelRatio;
	let margin = opts.legend.margin * opts.pixelRatio;
	let fontSize = opts.legend.fontSize;
	let shapeWidth = 15 * opts.pixelRatio;
	let shapeRight = 5 * opts.pixelRatio;
	let lineHeight = Math.max(opts.legend.lineHeight * opts.pixelRatio, fontSize);
	if (opts.legend.position == "top" || opts.legend.position == "bottom") {
		let legendList: ChartOptionsSeries[][] = [];
		let widthCount = 0;
		let widthCountArr: number[] = [];
		let currentRow: ChartOptionsSeries[] = [];
		for (let i = 0; i < series.length; i++) {
			let item = series[i];
			const legendText = item.legendText != null ? item.legendText : item.name;
			let itemWidth =
				shapeWidth +
				shapeRight +
				measureText(`${legendText}`, fontSize) +
				opts.legend.itemGap * opts.pixelRatio;
			if (widthCount + itemWidth > opts.width - opts.area[1] - opts.area[3]) {
				legendList.push(currentRow);
				widthCountArr.push(widthCount - opts.legend.itemGap * opts.pixelRatio);
				widthCount = itemWidth;
				currentRow = [item];
			} else {
				widthCount += itemWidth;
				currentRow.push(item);
			}
		}
		if (currentRow.length > 0) {
			legendList.push(currentRow);
			widthCountArr.push(widthCount - opts.legend.itemGap * opts.pixelRatio);
			legendData.widthArr = widthCountArr;
			let legendWidth = Math.max(...widthCountArr);
			switch (opts.legend.float) {
				case "left":
					legendData.area.start.x = opts.area[3];
					legendData.area.end.x = opts.area[3] + legendWidth + 2 * padding;
					break;
				case "right":
					legendData.area.start.x = opts.width - opts.area[1] - legendWidth - 2 * padding;
					legendData.area.end.x = opts.width - opts.area[1];
					break;
				default:
					legendData.area.start.x = (opts.width - legendWidth) / 2 - padding;
					legendData.area.end.x = (opts.width + legendWidth) / 2 + padding;
			}
			legendData.area.width = legendWidth + 2 * padding;
			legendData.area.wholeWidth = legendWidth + 2 * padding;
			legendData.area.height = legendList.length * lineHeight + 2 * padding;
			legendData.area.wholeHeight = legendList.length * lineHeight + 2 * padding + 2 * margin;
			legendData.points = legendList;
		}
	} else {
		let len = series.length;
		let maxHeight = opts.height - opts.area[0] - opts.area[2] - 2 * margin - 2 * padding;
		let maxLength = Math.min(Math.floor(maxHeight / lineHeight), len);
		legendData.area.height = maxLength * lineHeight + padding * 2;
		legendData.area.wholeHeight = maxLength * lineHeight + padding * 2;
		switch (opts.legend.float) {
			case "top":
				legendData.area.start.y = opts.area[0] + margin;
				legendData.area.end.y = opts.area[0] + margin + legendData.area.height;
				break;
			case "bottom":
				legendData.area.start.y =
					opts.height - opts.area[2] - margin - legendData.area.height;
				legendData.area.end.y = opts.height - opts.area[2] - margin;
				break;
			default:
				legendData.area.start.y = (opts.height - legendData.area.height) / 2;
				legendData.area.end.y = (opts.height + legendData.area.height) / 2;
		}
		let lineNum = len % maxLength == 0 ? len / maxLength : Math.floor(len / maxLength + 1);
		let currentRow: ChartOptionsSeries[][] = [];
		for (let i = 0; i < lineNum; i++) {
			let temp = series.slice(i * maxLength, i * maxLength + maxLength);
			currentRow.push(temp);
		}
		legendData.points = currentRow;
		if (currentRow.length > 0) {
			for (let i = 0; i < currentRow.length; i++) {
				let item = currentRow[i];
				let maxWidth = 0;
				for (let j = 0; j < item.length; j++) {
					let itemWidth =
						shapeWidth +
						shapeRight +
						measureText(`${item[j].name}`, fontSize) +
						opts.legend.itemGap * opts.pixelRatio;
					if (itemWidth > maxWidth) {
						maxWidth = itemWidth;
					}
				}
				legendData.widthArr.push(maxWidth);
				legendData.heightArr.push(item.length * lineHeight + padding * 2);
			}
			let legendWidth = 0;
			for (let i = 0; i < legendData.widthArr.length; i++) {
				legendWidth += legendData.widthArr[i];
			}
			legendData.area.width =
				legendWidth - opts.legend.itemGap * opts.pixelRatio + 2 * padding;
			legendData.area.wholeWidth = legendData.area.width + padding;
		}
	}
	switch (opts.legend.position) {
		case "top":
			legendData.area.start.y = opts.area[0] + margin;
			legendData.area.end.y = opts.area[0] + margin + legendData.area.height;
			break;
		case "bottom":
			legendData.area.start.y = opts.height - opts.area[2] - legendData.area.height - margin;
			legendData.area.end.y = opts.height - opts.area[2] - margin;
			break;
		case "left":
			legendData.area.start.x = opts.area[3];
			legendData.area.end.x = opts.area[3] + legendData.area.width;
			break;
		case "right":
			legendData.area.start.x = opts.width - opts.area[1] - legendData.area.width;
			legendData.area.end.x = opts.width - opts.area[1];
			break;
	}

	chartData.legendData = legendData;
	return legendData;
}
export function calYAxisData(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig
): ChartOptionsChartDataYAxisData {
	const rangesArr: string[][] = [];
	const rangesFormatArr: string[][] = [];
	const yAxisWidthArr: ChartOptionsChartDataYAxisDataYAxisWidth[] = [];
	//堆叠图重算Y轴
	let columnstyle: string = opts.extra.column != null ? opts.extra.column!.type : "";

	//如果是多Y轴，重新计算
	let YLength = opts.yAxis.data.length;
	let newSeries: ChartOptionsSeries[][] = [];
	if (YLength > 0) {
		for (let i = 0; i < YLength; i++) {
			const newSeriesChild: ChartOptionsSeries[] = [];
			for (let j = 0; j < series.length; j++) {
				if (series[j].index == i) {
					newSeriesChild.push(series[j]);
				}
			}
			newSeries.push(newSeriesChild);
		}
		for (let i = 0; i < YLength; i++) {
			let yData = opts.yAxis.data[i];
			//如果总开关不显示，强制每个Y轴为不显示
			if (opts.yAxis.disabled == true) {
				yData.disabled = true;
			}
			if (yData.type == "categories") {
				if (yData.formatter == null) {
					yData.formatter = (val: string, index: number, opts: ChartOptions): string => {
						return val + (yData.unit ?? "");
					};
				}
				yData.categories = yData.categories ?? opts.categories;
				rangesArr.push(yData.categories!);
			} else {
				if (yData.formatter == null) {
					yData.formatter = (val: string, index: number, opts: ChartOptions): string => {
						return parseFloat(val).toFixed(yData.tofix ?? 0) + (yData.unit ?? "");
					};
				}
				rangesArr.push(getYAxisTextList(newSeries[i], opts, config, columnstyle, yData));
			}
			let yAxisFontSizes =
				yData.fontSize != null ? yData.fontSize! * opts.pixelRatio : config.fontSize;
			const cocdyw = new ChartOptionsChartDataYAxisDataYAxisWidth();
			cocdyw.position = yData.position;
			cocdyw.width = 0;
			yAxisWidthArr.push(cocdyw);
			const handlranges = rangesArr[i].map(function (items, index): string {
				const fun = yData.formatter as (
					val: string,
					index: number,
					opts: ChartOptions
				) => string;
				items = fun(items, index, opts);
				cocdyw.width = Math.max(cocdyw.width, measureText(items, yAxisFontSizes) + 5);
				return items;
			});

			rangesFormatArr.push(handlranges);
			let calibration = yData.calibration ? 4 * opts.pixelRatio : 0;
			cocdyw.width = cocdyw.width + calibration + 3 * opts.pixelRatio;
			if (yData.disabled == true) {
				cocdyw.width = 0;
			}
		}
	} else {
		if (opts.type == "bar") {
			rangesArr.push(opts.categories!);
			if (opts.yAxis.formatter == null) {
				opts.yAxis.formatter = (val: string, index: number, opts: ChartOptions): string => {
					return val + opts.yAxis.unit;
				};
			}
		} else {
			if (opts.yAxis.formatter == null) {
				opts.yAxis.formatter = (val: string, index: number, opts: ChartOptions): string => {
					return parseFloat(val).toFixed(opts.yAxis.tofix) + opts.yAxis.unit;
				};
			}
			rangesArr.push(
				getYAxisTextList(series, opts, config, columnstyle, new ChartOptionsYAxisData())
			);
		}
		const cocdyw = new ChartOptionsChartDataYAxisDataYAxisWidth();
		cocdyw.position = "left";
		cocdyw.width = 0;
		yAxisWidthArr.push(cocdyw);
		let yAxisFontSize: number;
		if (opts.yAxis.fontSize == null) {
			yAxisFontSize = config.fontSize;
		} else {
			yAxisFontSize = opts.yAxis.fontSize! * opts.pixelRatio;
		}
		const handlranges = rangesArr[0].map(function (item, index): string {
			const fun = opts.yAxis.formatter as (
				val: string,
				index: number,
				opts: ChartOptions
			) => string;
			item = fun(item, index, opts);
			cocdyw.width = Math.max(cocdyw.width, measureText(item, yAxisFontSize) + 5);
			return item;
		});
		rangesFormatArr.push(handlranges);
		cocdyw.width += 3 * opts.pixelRatio;
		if (opts.yAxis.disabled == true) {
			opts.yAxis.data[0].disabled = true;
		} else {
			const yAxisData = new ChartOptionsYAxisData();
			yAxisData.disabled = false;
			yAxisData.position = "left";
			yAxisData.max = opts.yAxis.max;
			yAxisData.min = opts.yAxis.min;
			yAxisData.formatter = opts.yAxis.formatter;
			if (opts.type == "bar") {
				yAxisData.categories = opts.categories;
				yAxisData.type = "categories";
			}
			opts.yAxis.data.push(yAxisData);
		}
	}
	const cdyd: ChartOptionsChartDataYAxisData = new ChartOptionsChartDataYAxisData();
	cdyd.rangesFormat = rangesFormatArr;
	cdyd.ranges = rangesArr;
	cdyd.yAxisWidth = yAxisWidthArr;
	return cdyd;
}
function dataCombine(series: ChartOptionsSeries[]): ChartOptionsSeriesData[] {
	const newSeries: ChartOptionsSeriesData[] = [];
	series.forEach((item: ChartOptionsSeries) => {
		if (item.data != null) newSeries.push(...item.data!);
	});
	return newSeries;
}
function findRange(num: number, type: string | null, limit: number | null): number {
	if (isNaN(num)) {
		throw new Error("[TuiCharts] series数据需为Number格式");
	}
	limit = limit ?? 10;
	type = type ?? "upper";
	let multiple = 1;
	while (limit < 1) {
		limit *= 10;
		multiple *= 10;
	}
	if (type == "upper") {
		num = Math.ceil(num * multiple);
	} else {
		num = Math.floor(num * multiple);
	}
	while (num % limit != 0) {
		if (type == "upper") {
			if (num == num + 1) {
				//修复数据值过大num++无效的bug by 向日葵 @xrk_jy
				break;
			}
			num++;
		} else {
			num--;
		}
	}
	return num / multiple;
}
function getDataRange(minData: number, maxData: number): ChartRange {
	let limit: number;
	let range = maxData - minData;
	if (range >= 10000) {
		limit = 1000;
	} else if (range >= 1000) {
		limit = 100;
	} else if (range >= 100) {
		limit = 10;
	} else if (range >= 10) {
		limit = 5;
	} else if (range >= 1) {
		limit = 1;
	} else if (range >= 0.1) {
		limit = 0.1;
	} else if (range >= 0.01) {
		limit = 0.01;
	} else if (range >= 0.001) {
		limit = 0.001;
	} else if (range >= 0.0001) {
		limit = 0.0001;
	} else if (range >= 0.00001) {
		limit = 0.00001;
	} else {
		limit = 0.000001;
	}
	return {
		minRange: findRange(minData, "lower", limit),
		maxRange: findRange(maxData, "upper", limit)
	} as ChartRange;
}

function fixColumeStackData(
	points: ChartOptionsChartDataCalPoints[],
	eachSpacing: number,
	opts: ChartOptions
): ChartOptionsChartDataCalPoints[] {
	let categoryGap = opts.extra.column!.categoryGap * opts.pixelRatio;
	return points.map(
		(item: ChartOptionsChartDataCalPoints, indexn: number): ChartOptionsChartDataCalPoints => {
			// if (item == null) {
			// 	return null;
			// }
			item.width = Math.ceil(eachSpacing - 2 * categoryGap);
			if (opts.extra.column != null && opts.extra.column!.width > 0) {
				item.width = Math.min(item.width!, opts.extra.column!.width * opts.pixelRatio);
			}
			if (item.width! <= 0) {
				item.width = 1;
			}
			return item;
		}
	);
}

function dataCombineStack(series: ChartOptionsSeries[], len: number): ChartOptionsSeriesData[] {
	let sum: Map<number, number> = new Map<number, number>();
	let newseries: ChartOptionsSeriesData[] = [];
	series.forEach((item: ChartOptionsSeries) => {
		for (let j = 0; j < len; j++) {
			const val = item.data![j].value!;
			const old_number = sum.get(j) ?? 0;
			sum.set(j, val + old_number);
		}
	});
	series.forEach((item: ChartOptionsSeries, index: number) => {
		newseries.push(...item.data!);
		sum.forEach((k: number) => {
			const sumseries = new ChartOptionsSeriesData();
			sumseries.value = k;
			newseries.push(sumseries);
		});
	});
	return newseries;
}
function getArrYAxisTextList(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	stack: string,
	yData: ChartOptionsYAxisData
): string[] {
	// let index = arguments.length > 5 && arguments[5] != undefined ? arguments[5] : -1;
	let data: number[][] = [];
	series.forEach((item: ChartOptionsSeries) => {
		data.push(...item.dataArr);
	});
	let sorted: number[] = [];
	data.map((item: number[]) => {
		item.map((subitem) => {
			sorted.push(subitem);
		});
	});
	let minData = yData.min ?? 0;
	let maxData = yData.max ?? 0;
	if (sorted.length > 0) {
		minData = Math.min(...sorted);
		maxData = Math.max(...sorted);
	}
	if (minData == maxData) {
		if (maxData == 0) {
			maxData = 10;
		} else {
			minData = 0;
		}
	}
	let dataRange = getDataRange(minData, maxData);
	let minRange = yData.min == null ? dataRange.minRange : yData.min!;
	let maxRange = yData.max == null ? dataRange.maxRange : yData.max!;
	let eachRange = (maxRange - minRange) / opts.yAxis.splitNumber;
	let range: string[] = [];
	for (let i = 0; i <= opts.yAxis.splitNumber; i++) {
		range.push(`${minRange + eachRange * i}`);
	}
	return range.reverse();
}
function getYAxisTextList(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	stack: string,
	yData: ChartOptionsYAxisData
): string[] {
	if (opts.type == "candle") return getArrYAxisTextList(series, opts, config, stack, yData);
	let data: ChartOptionsSeriesData[] = [];
	if (stack == "stack") {
		data = dataCombineStack(series, opts.categories!.length);
	} else {
		data = dataCombine(series);
	}
	let sorted: number[] = [];
	// remove null from data
	data = data.filter((item): boolean => {
		return item.value != null;
	});
	data.map((item: ChartOptionsSeriesData) => {
		sorted.push(item.value!);
		// if (typeof item == 'object') {
		// 	if (item.constructor.toString().indexOf('Array') > -1) {
		// 		if (opts.type == 'candle') {
		// 			// item.map((subitem : number) => {
		// 			// 	sorted.push(subitem: number);
		// 			// })
		// 		} else {
		// 			sorted.push(item[1]);
		// 		}
		// 	} else {
		// 		sorted.push(item.value);
		// 	}
		// } else {
		// 	sorted.push(item);
		// }
	});
	let minData = yData.min ?? 0;
	let maxData = yData.max ?? 0;
	if (sorted.length > 0) {
		minData = Math.min(...sorted);
		maxData = Math.max(...sorted);
	}
	if (minData == maxData) {
		if (maxData == 0) {
			maxData = 10;
		} else {
			minData = 0;
		}
	}
	let dataRange = getDataRange(minData, maxData);
	let minRange = yData.min == null ? dataRange.minRange : yData.min!;
	let maxRange = yData.max == null ? dataRange.maxRange : yData.max!;
	let eachRange = (maxRange - minRange) / opts.yAxis.splitNumber;
	let range: string[] = [];
	for (let i = 0; i <= opts.yAxis.splitNumber; i++) {
		range.push(`${minRange + eachRange * i}`);
	}
	return range.reverse();
}
export function getXAxisPoints(
	categories: string[],
	opts: ChartOptions,
	config: TuiChartConfig
): ChartOptionsChartDataXAxisData {
	let spacingValid = opts.width - opts.area[1] - opts.area[3];
	let dataCount = opts.enableScroll
		? Math.min(opts.xAxis.itemCount, categories.length)
		: categories.length;
	if (
		(opts.type == "line" ||
			opts.type == "area" ||
			opts.type == "scatter" ||
			opts.type == "bubble" ||
			opts.type == "bar") &&
		dataCount > 1 &&
		opts.xAxis.boundaryGap == "justify"
	) {
		dataCount -= 1;
	}
	let widthRatio = 0;
	if (
		opts.type == "mount" &&
		opts.extra != null &&
		opts.extra.mount != null &&
		opts.extra.mount!.widthRatio > 1
	) {
		if (opts.extra.mount!.widthRatio > 2) opts.extra.mount!.widthRatio = 2;
		widthRatio = opts.extra.mount!.widthRatio - 1;
		dataCount += widthRatio;
	}
	let eachSpacing = spacingValid / dataCount;
	let xAxisPoints: number[] = [];
	let startX = opts.area[3];
	let endX = opts.width - opts.area[1];
	categories.forEach(function (item, index) {
		xAxisPoints.push(startX + (widthRatio / 2) * eachSpacing + index * eachSpacing);
	});
	if (opts.xAxis.boundaryGap != "justify") {
		if (opts.enableScroll == true) {
			xAxisPoints.push(startX + widthRatio * eachSpacing + categories.length * eachSpacing);
		} else {
			xAxisPoints.push(endX);
		}
	}
	const optscdxd = new ChartOptionsChartDataXAxisData();
	optscdxd.xAxisPoints = xAxisPoints;
	optscdxd.startX = startX;
	optscdxd.endX = endX;
	optscdxd.eachSpacing = eachSpacing;
	return optscdxd;
}
function calCategoriesData(
	categories: string[],
	opts: ChartOptions,
	config: TuiChartConfig,
	eachSpacing: number,
	context: CanvasRenderingContext2D
): ChartOptionsChartDataCategoriesData {
	const result: ChartOptionsChartDataCategoriesData = new ChartOptionsChartDataCategoriesData();
	result.xAxisHeight =
		opts.xAxis.lineHeight * opts.pixelRatio + opts.xAxis.marginTop * opts.pixelRatio;
	let fontSize = opts.xAxis.fontSize * opts.pixelRatio;
	let categoriesTextLenth = categories.map(function (item, index): number {
		// let xitem = opts.xAxis.formatter ? opts.xAxis.formatter(item, index, opts) : item;
		let xitem: string;
		if (opts.xAxis.formatter == null) {
			xitem = item;
		} else {
			const fun = opts.xAxis.formatter as (
				val: string,
				index: number,
				opts: ChartOptions
			) => string;
			xitem = fun(item, index, opts);
		}
		return measureText(`${xitem}`, fontSize);
	});
	let maxTextLength = Math.max(...categoriesTextLenth);
	if (opts.xAxis.rotateLabel == true) {
		result.angle = (opts.xAxis.rotateAngle * Math.PI) / 180;
		let tempHeight =
			opts.xAxis.marginTop * opts.pixelRatio * 2 +
			Math.abs(maxTextLength * Math.sin(result.angle));
		tempHeight =
			tempHeight < fontSize + opts.xAxis.marginTop * opts.pixelRatio * 2
				? tempHeight + opts.xAxis.marginTop * opts.pixelRatio * 2
				: tempHeight;
		result.xAxisHeight = tempHeight;
	}
	if (opts.enableScroll && opts.xAxis.scrollShow) {
		result.xAxisHeight += 6 * opts.pixelRatio;
	}
	if (opts.xAxis.disabled) {
		result.xAxisHeight = 0;
	}
	return result;
}
class ChartsTiming {
	easeIn(pos: number): number {
		return Math.pow(pos, 3);
	}
	easeOut(pos: number): number {
		return Math.pow(pos - 1, 3) + 1;
	}
	easeInOut(pos: number): number {
		if (pos / 0.5 < 1) {
			return 0.5 * Math.pow(pos, 3);
		} else {
			return 0.5 * (Math.pow(pos - 2, 3) + 2);
		}
	}
	linear(pos: number): number {
		return pos;
	}
}

const Timing = new ChartsTiming();
function drawYAxis(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	if (opts.yAxis.disabled == true) {
		return;
	}
	let spacingValid = opts.height - opts.area[0] - opts.area[2];
	let eachSpacing = spacingValid / opts.yAxis.splitNumber;
	let startX = opts.area[3];
	let endX = opts.width - opts.area[1];
	let endY = opts.height - opts.area[2];
	// set YAxis background
	context.beginPath();
	context.fillStyle = opts.background;
	if (
		opts.enableScroll == true &&
		opts.xAxis.scrollPosition != null &&
		opts.xAxis.scrollPosition != "left"
	) {
		context.fillRect(0, 0, startX, endY + 2 * opts.pixelRatio);
	}
	if (
		opts.enableScroll == true &&
		opts.xAxis.scrollPosition != null &&
		opts.xAxis.scrollPosition != "right"
	) {
		context.fillRect(endX, 0, opts.width, endY + 2 * opts.pixelRatio);
	}
	context.closePath();
	context.stroke();

	let tStartLeft = opts.area[3];
	let tStartRight = opts.width - opts.area[1];
	let tStartCenter = opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2;
	if (opts.yAxis.data.length > 0) {
		for (let i = 0; i < opts.yAxis.data.length; i++) {
			let yData = opts.yAxis.data[i];
			let points: number[] = [];
			if (yData.type == "categories") {
				for (let i = 0; i <= yData.categories!.length; i++) {
					points.push(
						opts.area[0] +
							spacingValid / yData.categories!.length / 2 +
							(spacingValid / yData.categories!.length) * i
					);
				}
			} else {
				for (let i = 0; i <= opts.yAxis.splitNumber; i++) {
					points.push(opts.area[0] + eachSpacing * i);
				}
			}
			if (yData.disabled != true) {
				let rangesFormat = opts.chartData.yAxisData.rangesFormat![i];
				let yAxisFontSize =
					yData.fontSize != null ? yData.fontSize! * opts.pixelRatio : config.fontSize;
				let yAxisWidth = opts.chartData.yAxisData.yAxisWidth![i];
				let textAlign = yData.textAlign ?? "right";
				//画Y轴刻度及文案
				rangesFormat.forEach(function (item, index) {
					let pos = points[index];
					context.beginPath();
					context.font = `${yAxisFontSize}px sans-serif`;
					context.lineWidth = 1 * opts.pixelRatio;
					context.strokeStyle = yData.axisLineColor ?? "#cccccc";
					context.fillStyle = yData.fontColor ?? opts.fontColor;
					let tmpstrat = 0;
					let gapwidth = 4 * opts.pixelRatio;
					if (yAxisWidth.position == "left") {
						//画刻度线
						if (yData.calibration == true) {
							context.moveTo(opts.xOffset + tStartLeft, pos + opts.yOffset);
							context.lineTo(
								opts.xOffset + tStartLeft - 3 * opts.pixelRatio,
								pos + opts.yOffset
							);
							gapwidth += 3 * opts.pixelRatio;
						}
						//画文字
						switch (textAlign) {
							case "left":
								context.textAlign = "left";
								tmpstrat = tStartLeft - yAxisWidth.width;
								break;
							case "right":
								context.textAlign = "right";
								tmpstrat = tStartLeft - gapwidth;
								break;
							default:
								context.textAlign = "center";
								tmpstrat = tStartLeft - yAxisWidth.width / 2;
						}
						context.fillText(
							`${item}`,
							opts.xOffset + tmpstrat,
							opts.yOffset + pos + yAxisFontSize / 2 - 3 * opts.pixelRatio
						);
					} else if (yAxisWidth.position == "right") {
						//画刻度线
						if (yData.calibration == true) {
							context.moveTo(opts.xOffset + tStartRight, pos + opts.yOffset);
							context.lineTo(
								opts.xOffset + tStartRight + 3 * opts.pixelRatio,
								pos + opts.yOffset
							);
							gapwidth += 3 * opts.pixelRatio;
						}
						switch (textAlign) {
							case "left":
								context.textAlign = "left";
								tmpstrat = tStartRight + gapwidth;
								break;
							case "right":
								context.textAlign = "right";
								tmpstrat = tStartRight + yAxisWidth.width;
								break;
							default:
								context.textAlign = "center";
								tmpstrat = tStartRight + yAxisWidth.width / 2;
						}
						context.fillText(
							`${item}`,
							opts.xOffset + tmpstrat,
							opts.yOffset + pos + yAxisFontSize / 2 - 3 * opts.pixelRatio
						);
					} else if (yAxisWidth.position == "center") {
						//画刻度线
						if (yData.calibration == true) {
							context.moveTo(opts.xOffset + tStartCenter, pos + opts.yOffset);
							context.lineTo(
								opts.xOffset + tStartCenter - 3 * opts.pixelRatio,
								pos + opts.yOffset
							);
							gapwidth += 3 * opts.pixelRatio;
						}
						//画文字
						switch (textAlign) {
							case "left":
								context.textAlign = "left";
								tmpstrat = tStartCenter - yAxisWidth.width;
								break;
							case "right":
								context.textAlign = "right";
								tmpstrat = tStartCenter - gapwidth;
								break;
							default:
								context.textAlign = "center";
								tmpstrat = tStartCenter - yAxisWidth.width / 2;
						}
						context.fillText(
							`${item}`,
							opts.xOffset + tmpstrat,
							opts.yOffset + pos + yAxisFontSize / 2 - 3 * opts.pixelRatio
						);
					}
					context.closePath();
					context.stroke();
					context.textAlign = "left";
				});
				//画Y轴轴线
				if (yData.axisLine != false) {
					context.beginPath();
					context.strokeStyle = yData.axisLineColor ?? "#cccccc";
					context.lineWidth = 1 * opts.pixelRatio;
					if (yAxisWidth.position == "left") {
						context.moveTo(
							opts.xOffset + tStartLeft,
							opts.height - opts.area[2] + opts.yOffset
						);
						context.lineTo(opts.xOffset + tStartLeft, opts.area[0] + opts.yOffset);
					} else if (yAxisWidth.position == "right") {
						context.moveTo(
							opts.xOffset + tStartRight,
							opts.height - opts.area[2] + opts.yOffset
						);
						context.lineTo(opts.xOffset + tStartRight, opts.area[0] + opts.yOffset);
					} else if (yAxisWidth.position == "center") {
						context.moveTo(
							opts.xOffset + tStartCenter,
							opts.height - opts.area[2] + opts.yOffset
						);
						context.lineTo(opts.xOffset + tStartCenter, opts.area[0] + opts.yOffset);
					}
					context.stroke();
				}
				//画Y轴标题
				if (opts.yAxis.showTitle) {
					let titleFontSize =
						yData.titleFontSize != null
							? yData.titleFontSize! * opts.pixelRatio
							: config.fontSize;
					let title = yData.title!;
					context.beginPath();
					context.font = `${titleFontSize}px sans-serif`;
					context.fillStyle = yData.titleFontColor ?? opts.fontColor;
					if (yAxisWidth.position == "left") {
						context.fillText(
							title,
							opts.xOffset +
								tStartLeft -
								measureText(title, titleFontSize) / 2 +
								(yData.titleOffsetX ?? 0),
							opts.yOffset +
								opts.area[0] -
								(10 - (yData.titleOffsetY ?? 0)) * opts.pixelRatio
						);
					} else if (yAxisWidth.position == "right") {
						context.fillText(
							title,
							opts.xOffset +
								tStartRight -
								measureText(title, titleFontSize) / 2 +
								(yData.titleOffsetX ?? 0),
							opts.yOffset +
								opts.area[0] -
								(10 - (yData.titleOffsetY ?? 0)) * opts.pixelRatio
						);
					} else if (yAxisWidth.position == "center") {
						context.fillText(
							title,
							opts.xOffset +
								tStartCenter -
								measureText(title, titleFontSize) / 2 +
								(yData.titleOffsetX ?? 0),
							opts.yOffset +
								opts.area[0] -
								(10 - (yData.titleOffsetY ?? 0)) * opts.pixelRatio
						);
					}
					context.closePath();
					context.stroke();
				}
				if (yAxisWidth.position == "left") {
					tStartLeft -= yAxisWidth.width + opts.yAxis.padding * opts.pixelRatio;
				} else {
					tStartRight += yAxisWidth.width + opts.yAxis.padding * opts.pixelRatio;
				}
			}
		}
	}
}
function drawYAxisGrid(
	categories: string[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	if (opts.yAxis.disableGrid == true) {
		return;
	}
	let spacingValid = opts.height - opts.area[0] - opts.area[2];
	let eachSpacing = spacingValid / opts.yAxis.splitNumber;
	let startX = opts.area[3];
	let xAxisPoints = opts.chartData.xAxisData.xAxisPoints!,
		xAxiseachSpacing = opts.chartData.xAxisData.eachSpacing!;
	let TotalWidth = xAxiseachSpacing * (xAxisPoints.length - 1);
	if (
		opts.type == "mount" &&
		opts.extra != null &&
		opts.extra.mount != null &&
		opts.extra.mount!.widthRatio != null &&
		opts.extra.mount!.widthRatio > 1
	) {
		if (opts.extra.mount!.widthRatio > 2) opts.extra.mount!.widthRatio = 2;
		TotalWidth += (opts.extra.mount!.widthRatio - 1) * xAxiseachSpacing;
	}
	let endX = startX + TotalWidth;
	let points: number[] = [];
	let startY = 1;
	if (opts.xAxis.axisLine == false) {
		startY = 0;
	}
	for (let i = startY; i < opts.yAxis.splitNumber + 1; i++) {
		points.push(opts.height - opts.area[2] - eachSpacing * i);
	}
	context.save();
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0) {
		context.translate(opts._scrollDistance_!, 0);
	}
	if (opts.yAxis.gridType == "dash") {
		context.setLineDash([
			opts.yAxis.dashLength * opts.pixelRatio,
			opts.yAxis.dashLength * opts.pixelRatio
		]);
	}
	context.strokeStyle = opts.yAxis.gridColor;
	context.lineWidth = 1 * opts.pixelRatio;
	points.forEach(function (item, index) {
		context.beginPath();
		context.moveTo(startX + opts.xOffset, item + opts.yOffset);
		context.lineTo(endX + opts.xOffset, item + opts.yOffset);
		context.stroke();
	});
	context.setLineDash([]);
	context.restore();
}
function fillCustomColor(
	linearType: string,
	customColor: string[] | null,
	series: ChartOptionsSeries[],
	config: TuiChartConfig
): string[] {
	let newcolor = customColor ?? [];
	if (linearType == "custom" && newcolor.length == 0) {
		newcolor = config.linearColor;
	}
	if (linearType == "custom" && newcolor.length < series.length) {
		let chazhi = series.length - newcolor.length;
		for (let i = 0; i < chazhi; i++) {
			newcolor.push(config.linearColor[(i + 1) % config.linearColor.length]);
		}
	}
	return newcolor;
}
function drawXAxis(
	categories: string[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	let xAxisData = opts.chartData.xAxisData,
		xAxisPoints = xAxisData.xAxisPoints!,
		startX = xAxisData.startX!,
		endX = xAxisData.endX!,
		eachSpacing = xAxisData.eachSpacing!;
	let boundaryGap = "center";
	if (
		opts.type == "bar" ||
		opts.type == "line" ||
		opts.type == "area" ||
		opts.type == "scatter" ||
		opts.type == "bubble"
	) {
		boundaryGap = opts.xAxis.boundaryGap;
	}
	let startY = opts.height - opts.area[2];
	let endY = opts.area[0];

	//绘制滚动条
	if (opts.enableScroll && opts.xAxis.scrollShow) {
		let scrollY = opts.height - opts.area[2] + config.xAxisHeight;
		let scrollScreenWidth = endX - startX;
		let scrollTotalWidth = eachSpacing * (xAxisPoints.length - 1);
		if (
			opts.type == "mount" &&
			opts.extra != null &&
			opts.extra.mount != null &&
			opts.extra.mount!.widthRatio != null &&
			opts.extra.mount!.widthRatio > 1
		) {
			if (opts.extra.mount!.widthRatio > 2) opts.extra.mount!.widthRatio = 2;
			scrollTotalWidth += (opts.extra.mount!.widthRatio - 1) * eachSpacing;
		}
		let scrollWidth = (scrollScreenWidth * scrollScreenWidth) / scrollTotalWidth;
		let scrollLeft = 0;
		if (opts._scrollDistance_ != null) {
			scrollLeft = (-opts._scrollDistance_! * scrollScreenWidth) / scrollTotalWidth;
		}
		context.beginPath();
		context.lineCap = "round";
		context.lineWidth = 6 * opts.pixelRatio;
		context.strokeStyle = opts.xAxis.scrollBackgroundColor ?? "#EFEBEF";
		context.moveTo(startX + opts.xOffset, scrollY + opts.yOffset);
		context.lineTo(endX + opts.xOffset, scrollY + opts.yOffset);
		context.stroke();
		context.closePath();
		context.beginPath();
		context.lineCap = "round";
		context.lineWidth = 6 * opts.pixelRatio;
		context.strokeStyle = opts.xAxis.scrollColor ?? "#A6A6A6";
		context.moveTo(opts.xOffset + startX + scrollLeft, scrollY + opts.yOffset);
		context.lineTo(opts.xOffset + startX + scrollLeft + scrollWidth, scrollY + opts.yOffset);
		context.stroke();
		context.closePath();
		context.lineCap = "butt";
	}
	context.save();
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0) {
		context.translate(opts._scrollDistance_!, 0);
	}
	//绘制X轴刻度线
	if (opts.xAxis.calibration == true) {
		context.strokeStyle = opts.xAxis.gridColor ?? "#cccccc";
		context.lineCap = "butt";
		context.lineWidth = 1 * opts.pixelRatio;
		xAxisPoints.forEach(function (item, index) {
			if (index > 0) {
				context.beginPath();
				context.moveTo(opts.xOffset + item - eachSpacing / 2, startY + opts.yOffset);
				context.lineTo(
					opts.xOffset + item - eachSpacing / 2,
					startY + 3 * opts.pixelRatio + opts.yOffset
				);
				context.closePath();
				context.stroke();
			}
		});
	}
	//绘制X轴网格
	if (opts.xAxis.disableGrid != true) {
		context.strokeStyle = opts.xAxis.gridColor ?? "#cccccc";
		context.lineCap = "butt";
		context.lineWidth = 1 * opts.pixelRatio;
		if (opts.xAxis.gridType == "dash") {
			context.setLineDash([
				opts.xAxis.dashLength * opts.pixelRatio,
				opts.xAxis.dashLength * opts.pixelRatio
			]);
		}
		opts.xAxis.gridEval = opts.xAxis.gridEval ?? 1;
		xAxisPoints.forEach(function (item, index) {
			if (index % opts.xAxis.gridEval == 0) {
				context.beginPath();
				context.moveTo(item + opts.xOffset, startY + opts.yOffset);
				context.lineTo(item + opts.xOffset, endY + opts.yOffset);
				context.stroke();
			}
		});
		context.setLineDash([]);
	}
	//绘制X轴文案
	if (opts.xAxis.disabled != true) {
		// 对X轴列表做抽稀处理
		//默认全部显示X轴标签
		let maxXAxisListLength = categories.length;
		//如果设置了X轴单屏数量
		if (opts.xAxis.labelCount != null) {
			//如果设置X轴密度
			if (opts.xAxis.itemCount != null) {
				maxXAxisListLength = Math.ceil(
					(categories.length / opts.xAxis.itemCount) * opts.xAxis.labelCount!
				);
			} else {
				maxXAxisListLength = opts.xAxis.labelCount!;
			}
			maxXAxisListLength -= 1;
		}

		let ratio = Math.ceil(categories.length / maxXAxisListLength);

		let newCategories: string[] = [];
		let cgLength = categories.length;
		for (let i = 0; i < cgLength; i++) {
			if (i % ratio != 0) {
				newCategories.push("");
			} else {
				newCategories.push(categories[i]);
			}
		}
		newCategories[cgLength - 1] = categories[cgLength - 1];
		let xAxisFontSize =
			opts.xAxis.fontSize != null ? opts.xAxis.fontSize * opts.pixelRatio : config.fontSize;
		if (config._xAxisTextAngle_ == 0) {
			newCategories.forEach(function (item, index) {
				let xitem: string = item;
				if (opts.xAxis.formatter != null) {
					const fun = opts.xAxis.formatter as (
						val: string,
						index: number,
						opts: ChartOptions
					) => string;
					xitem = fun(item, index, opts);
				}
				let offset = -measureText(`${xitem}`, xAxisFontSize) / 2;
				if (boundaryGap == "center") {
					offset += eachSpacing / 2;
				}
				let scrollHeight = 0;
				if (opts.xAxis.scrollShow) {
					scrollHeight = 6 * opts.pixelRatio;
				}
				// 如果在主视图区域内
				let _scrollDistance_ = opts._scrollDistance_ ?? 0;
				let truePoints =
					boundaryGap == "center"
						? xAxisPoints[index] + eachSpacing / 2
						: xAxisPoints[index];
				if (
					xitem != "" &&
					truePoints - Math.abs(_scrollDistance_) >= opts.area[3] - 1 &&
					truePoints - Math.abs(_scrollDistance_) <= opts.width - opts.area[1] + 1
				) {
					context.beginPath();
					context.font = `${xAxisFontSize}px sans-serif`;
					context.fillStyle = opts.xAxis.fontColor ?? opts.fontColor;
					context.fillText(
						`${xitem}`,
						opts.xOffset + xAxisPoints[index] + offset,
						opts.yOffset +
							startY +
							opts.xAxis.marginTop * opts.pixelRatio +
							((opts.xAxis.lineHeight - opts.xAxis.fontSize) * opts.pixelRatio) / 2 +
							opts.xAxis.fontSize * opts.pixelRatio
					);
					context.closePath();
					context.stroke();
				}
			});
		} else {
			newCategories.forEach(function (item, index) {
				// let xitem = opts.xAxis.formatter ? opts.xAxis.formatter(item) : item;
				let xitem: string = item;
				if (opts.xAxis.formatter != null) {
					const fun = opts.xAxis.formatter as (val: string) => string;
					xitem = fun(item);
				}
				// 如果在主视图区域内
				let _scrollDistance_ = opts._scrollDistance_ ?? 0;
				let truePoints =
					boundaryGap == "center"
						? xAxisPoints[index] + eachSpacing / 2
						: xAxisPoints[index];
				if (
					xitem != "" &&
					truePoints - Math.abs(_scrollDistance_) >= opts.area[3] - 1 &&
					truePoints - Math.abs(_scrollDistance_) <= opts.width - opts.area[1] + 1
				) {
					context.save();
					context.beginPath();
					context.font = `${xAxisFontSize}px sans-serif`;
					context.fillStyle = opts.xAxis.fontColor ?? opts.fontColor;
					let textWidth = measureText(`${xitem}`, xAxisFontSize);
					let offsetX = xAxisPoints[index];
					if (boundaryGap == "center") {
						offsetX = xAxisPoints[index] + eachSpacing / 2;
					}
					let scrollHeight = 0;
					if (opts.xAxis.scrollShow) {
						scrollHeight = 6 * opts.pixelRatio;
					}
					let offsetY =
						startY +
						opts.xAxis.marginTop * opts.pixelRatio +
						xAxisFontSize -
						xAxisFontSize * Math.abs(Math.sin(config._xAxisTextAngle_));
					if (opts.xAxis.rotateAngle < 0) {
						offsetX -= xAxisFontSize / 2;
						textWidth = 0;
					} else {
						offsetX += xAxisFontSize / 2;
						textWidth = -textWidth;
					}
					context.translate(offsetX, offsetY);
					context.rotate(-1 * config._xAxisTextAngle_);
					context.fillText(`${xitem}`, textWidth + opts.xOffset, 0 + opts.yOffset);
					context.closePath();
					context.stroke();
					context.restore();
				}
			});
		}
	}
	context.restore();

	//画X轴标题
	if (opts.xAxis.title != null) {
		context.beginPath();
		context.font = `${opts.xAxis.titleFontSize * opts.pixelRatio}px sans-serif`;
		context.fillStyle = opts.xAxis.titleFontColor;
		context.fillText(
			`${opts.xAxis.title}`,
			opts.xOffset + opts.width - opts.area[1] + opts.xAxis.titleOffsetX * opts.pixelRatio,
			opts.height -
				opts.area[2] +
				opts.xAxis.marginTop * opts.pixelRatio +
				((opts.xAxis.lineHeight - opts.xAxis.titleFontSize) * opts.pixelRatio) / 2 +
				(opts.xAxis.titleFontSize + opts.xAxis.titleOffsetY) * opts.pixelRatio +
				opts.yOffset
		);
		context.closePath();
		context.stroke();
	}

	//绘制X轴轴线
	if (opts.xAxis.axisLine) {
		context.beginPath();
		context.strokeStyle = opts.xAxis.axisLineColor;
		context.lineWidth = 1 * opts.pixelRatio;
		context.moveTo(startX + opts.xOffset, opts.height - opts.area[2] + opts.yOffset);
		context.lineTo(endX + opts.xOffset, opts.height - opts.area[2] + opts.yOffset);
		context.stroke();
	}
}
function getColumnDataPoints(
	data: ChartOptionsSeriesData[],
	minRange: number,
	maxRange: number,
	xAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	zeroPoints: number,
	process: number = 1
): ChartOptionsChartDataCalPoints[] {
	// let process = arguments.length > 8 && arguments[8] != undefined ? arguments[8] : 1;
	let points: ChartOptionsChartDataCalPoints[] = [];
	let validHeight = opts.height - opts.area[0] - opts.area[2];
	let validWidth = opts.width - opts.area[1] - opts.area[3];
	data.forEach(function (item, index) {
		if (item == null) {
			// points.push(null);
		} else {
			const point = new ChartOptionsChartDataCalPoints();
			point.color = item.color;
			point.x = xAxisPoints[index];
			let value = item.value!;
			// if (typeof item == 'object' && item != null) {
			// 	if (Array.isArray(item)) {
			// 		let xranges = [...opts.chartData.xAxisData.ranges!];
			// 		let xminRange = xranges.shift()!;
			// 		let xmaxRange = xranges.pop()!;
			// 		// value = item[1];
			// 		point.x = opts.area[3] + validWidth * (item[0] - xminRange) / (xmaxRange - xminRange);
			// 	} else {
			// 		// value = item.value;
			// 	}
			// }
			point.x += eachSpacing / 2;
			let height = (validHeight * (value * process - minRange)) / (maxRange - minRange);
			point.y = opts.height - height - opts.area[2];
			points.push(point);
		}
	});
	return points;
}

function getStackDataPoints(
	data: ChartOptionsSeriesData[],
	minRange: number,
	maxRange: number,
	xAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	seriesIndex: number,
	stackSeries: ChartOptionsSeries[],
	process: number = 1
): ChartOptionsChartDataCalPoints[] {
	// let process = arguments.length > 9 && arguments[9] != undefined ? arguments[9] : 1;
	let points: ChartOptionsChartDataCalPoints[] = [];
	let validHeight = opts.height - opts.area[0] - opts.area[2];
	data.forEach(function (item: ChartOptionsSeriesData, index: number) {
		if (item == null) {
			// points.push(null);
		} else {
			let point = new ChartOptionsChartDataCalPoints();
			point.color = item.color;
			point.x = xAxisPoints[index] + Math.round(eachSpacing / 2);
			let height0: number;
			let height: number;
			if (seriesIndex > 0) {
				let value = 0;
				for (let i = 0; i <= seriesIndex; i++) {
					const val = stackSeries[i].data![index]!.value!;
					value += val;
				}
				let value0 = value - item.value!;
				height = (validHeight * (value - minRange)) / (maxRange - minRange);
				height0 = (validHeight * (value0 - minRange)) / (maxRange - minRange);
			} else {
				let value: number = item.value!;
				height = (validHeight * (value - minRange)) / (maxRange - minRange);
				height0 = 0;
			}
			let heightc = height0;
			height *= process;
			heightc *= process;
			point.y = opts.height - Math.round(height) - opts.area[2];
			// if (index == 0) console.log(point.y, opts.height, Math.round(height), opts.area)
			point.y0 = opts.height - Math.round(heightc) - opts.area[2];
			points.push(point);
		}
	});
	return points;
}
function fixColumeData(
	points: ChartOptionsChartDataCalPoints[],
	eachSpacing: number,
	columnLen: number,
	index: number,
	config: TuiChartConfig,
	opts: ChartOptions
): ChartOptionsChartDataCalPoints[] {
	return points.map(function (
		item: ChartOptionsChartDataCalPoints
	): ChartOptionsChartDataCalPoints {
		// if (item == null) {
		// 	return null;
		// }
		let seriesGap = 0;
		let categoryGap = 0;
		if (opts.type == "mix") {
			seriesGap = (opts.extra.mix?.column?.seriesGap ?? 0) * opts.pixelRatio;
			categoryGap = (opts.extra.mix?.column?.categoryGap ?? 0) * opts.pixelRatio;
		} else {
			// @ts-ignore
			seriesGap = opts.extra.column!.seriesGap * opts.pixelRatio ?? 0;
			// @ts-ignore
			categoryGap = opts.extra.column!.categoryGap * opts.pixelRatio ?? 0;
		}
		seriesGap = Math.min(seriesGap, eachSpacing / columnLen);
		categoryGap = Math.min(categoryGap, eachSpacing / columnLen);
		item.width = Math.ceil(
			(eachSpacing - 2 * categoryGap - seriesGap * (columnLen - 1)) / columnLen
		);
		if (
			opts.extra.mix != null &&
			opts.extra.mix!.column!.width != null &&
			opts.extra.mix!.column!.width! > 0
		) {
			item.width = Math.min(item.width!, opts.extra.mix!.column!.width! * opts.pixelRatio);
		}
		if (
			opts.extra.column != null &&
			opts.extra.column!.width != null &&
			opts.extra.column!.width > 0
		) {
			item.width = Math.min(item.width!, opts.extra.column!.width * opts.pixelRatio);
		}
		if (item.width! <= 0) {
			item.width = 1;
		}
		item.x += (index + 0.5 - columnLen / 2) * (item.width! + seriesGap);
		return item;
	});
}
function drawColumePointText(
	points: ChartOptionsChartDataCalPoints[],
	series: ChartOptionsSeries,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	opts: ChartOptions
) {
	// 绘制数据文案
	let data: ChartOptionsSeriesData[] = series.data!;
	let textOffset = series.textOffset != null ? series.textOffset! : 0;
	let Position = opts.extra.column!.labelPosition;
	points.forEach(function (item, index) {
		if (item != null) {
			context.beginPath();
			let fontSize =
				series.textSize != null ? series.textSize! * opts.pixelRatio : config.fontSize;
			context.font = `${fontSize}px sans-serif`;
			context.fillStyle = series.textColor ?? opts.fontColor;
			let value: number = data[index].value!;
			// if (typeof data[index] == 'object' && data[index] != null) {
			// 	if (Array.isArray(data[index])) {
			// 		value = data[index][1];
			// 	} else {
			// 		value = data[index].value!
			// 	}
			// }
			// let formatVal = series.formatter ? series.formatter(value, index, series, opts) : value;
			// let formatVal : number = value
			// if (series.formatter != null) {
			// 	const fun = series.formatter as (value, index, series, opts) => number
			// }
			//后续需要传入函数进行内容格式显示
			let formatVal = value;
			context.textAlign = "center";
			let startY = item.y - 4 * opts.pixelRatio + textOffset * opts.pixelRatio;
			if (item.y > series.zeroPoints!) {
				startY = item.y + textOffset * opts.pixelRatio + fontSize;
			}
			if (Position == "insideTop") {
				startY = item.y + fontSize + textOffset * opts.pixelRatio;
				if (item.y > series.zeroPoints!) {
					startY = item.y - textOffset * opts.pixelRatio - 4 * opts.pixelRatio;
				}
			}
			if (Position == "center") {
				startY =
					item.y +
					textOffset * opts.pixelRatio +
					(opts.height - opts.area[2] - item.y + fontSize) / 2;
				if (series.zeroPoints! < opts.height - opts.area[2]) {
					startY =
						item.y +
						textOffset * opts.pixelRatio +
						(series.zeroPoints! - item.y + fontSize) / 2;
				}
				if (item.y > series.zeroPoints!) {
					startY =
						item.y -
						textOffset * opts.pixelRatio -
						(item.y - series.zeroPoints! - fontSize) / 2;
				}
				if (opts.extra.column!.type == "stack") {
					startY =
						item.y + textOffset * opts.pixelRatio + (item.y0 - item.y + fontSize) / 2;
				}
			}
			if (Position == "bottom") {
				startY =
					opts.height - opts.area[2] + textOffset * opts.pixelRatio - 4 * opts.pixelRatio;
				if (series.zeroPoints! < opts.height - opts.area[2]) {
					startY =
						series.zeroPoints! + textOffset * opts.pixelRatio - 4 * opts.pixelRatio;
				}
				if (item.y > series.zeroPoints!) {
					startY =
						series.zeroPoints! -
						textOffset * opts.pixelRatio +
						fontSize +
						2 * opts.pixelRatio;
				}
				if (opts.extra.column!.type == "stack") {
					startY = item.y0 + textOffset * opts.pixelRatio - 4 * opts.pixelRatio;
				}
			}
			context.fillText(`${formatVal}`, item.x + opts.xOffset, startY + opts.yOffset);
			context.closePath();
			context.stroke();
			context.textAlign = "left";
		}
	});
}
function drawToolTipSplitArea(
	offsetX: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	eachSpacing: number
) {
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	let toolTipOption = opts.extra.column!;
	if (toolTipOption.activeWidth == -1) toolTipOption.activeWidth = eachSpacing;
	toolTipOption.activeWidth =
		toolTipOption.activeWidth > eachSpacing ? eachSpacing : toolTipOption.activeWidth;
	let startY = opts.area[0];
	let endY = opts.height - opts.area[2];
	context.beginPath();
	context.fillStyle = hexToRgb(toolTipOption.activeBgColor, toolTipOption.activeBgOpacity);
	context.rect(
		offsetX - toolTipOption.activeWidth / 2 + xOffset,
		startY + yOffset,
		toolTipOption.activeWidth + xOffset,
		endY - startY
	);
	context.closePath();
	context.fill();
	context.fillStyle = "#FFFFFF";
}
function fixColumeMeterData(
	points: ChartOptionsChartDataCalPoints[],
	eachSpacing: number,
	columnLen: number,
	index: number,
	config: TuiChartConfig,
	opts: ChartOptions,
	border: number
): ChartOptionsChartDataCalPoints[] {
	// @ts-ignore
	let categoryGap: number = opts.extra.column!.categoryGap * opts.pixelRatio ?? 0;
	return points.map((item: ChartOptionsChartDataCalPoints): ChartOptionsChartDataCalPoints => {
		// if (item == null) {
		// 	return null;
		// }
		item.width = eachSpacing - 2 * categoryGap;
		if (opts.extra.column != null && +opts.extra.column!.width > 0) {
			item.width = Math.min(item.width!, +opts.extra.column!.width * opts.pixelRatio);
		}
		if (index > 0) {
			item.width = item.width! - border;
		}
		return item;
	});
}
function getArrDataPoints(
	data: number[][],
	minRange: number,
	maxRange: number,
	xAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	process: number = 1
): ChartOptionsChartDataCalPoints[] {
	let boundaryGap = opts.xAxis.boundaryGap;
	let points: ChartOptionsChartDataCalPoints[] = [];
	let validHeight = opts.height - opts.area[0] - opts.area[2];
	let validWidth = opts.width - opts.area[1] - opts.area[3];
	data.forEach((item, index) => {
		const point = new ChartOptionsChartDataCalPoints();
		const xranges = [...opts.chartData.xAxisData.ranges!];
		const xminRange = xranges.shift()!;
		const xmaxRange = xranges.pop()!;
		let value = item[1];
		point.x = opts.area[3] + (validWidth * (item[0] - xminRange)) / (xmaxRange - xminRange);
		if (opts.type == "bubble") {
			point.r = item[2];
			point.t = item[3];
		}
		if (boundaryGap == "center") {
			point.x += eachSpacing / 2;
		}
		let height = (validHeight * (value - minRange)) / (maxRange - minRange);
		height *= process;
		point.y = opts.height - height - opts.area[2];
		points.push(point);
	});
	return points;
}
function getDataPoints(
	data: ChartOptionsSeriesData[],
	minRange: number,
	maxRange: number,
	xAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	process: number = 1
): ChartOptionsChartDataCalPoints[] {
	let boundaryGap = "center";
	if (opts.type == "line" || opts.type == "area" || opts.type == "bubble") {
		boundaryGap = opts.xAxis.boundaryGap;
	}
	let points: ChartOptionsChartDataCalPoints[] = [];
	let validHeight = opts.height - opts.area[0] - opts.area[2];
	let validWidth = opts.width - opts.area[1] - opts.area[3];
	data.forEach((item, index) => {
		if (item.value == null) {
			// points.push(null);
		} else {
			const point = new ChartOptionsChartDataCalPoints();
			point.color = item.color;
			point.x = xAxisPoints[index];
			let value: number = item.value!;
			//暂时未发现有这种方式的使用场景后续在看是否保留
			// console.log(Array.isArray(item))
			// if (typeof item == 'object' && item != null) {
			// 	if (Array.isArray(item)) {
			// 		const xranges = [...opts.chartData.xAxisData.ranges!];
			// 		const xminRange = xranges.shift()!;
			// 		const xmaxRange = xranges.pop()!;
			// 		value = item[1];
			// 		point.x = opts.area[3] + validWidth * (item[0] - xminRange) / (xmaxRange - xminRange);
			// 		if (opts.type == 'bubble') {
			// 			point.r = item[2];
			// 			point.t = item[3];
			// 		}
			// 	} else {
			// 		value = item.value;
			// 	}
			// }

			if (boundaryGap == "center") {
				point.x += eachSpacing / 2;
			}
			let height = (validHeight * (value - minRange)) / (maxRange - minRange);
			height *= process;
			point.y = opts.height - height - opts.area[2];
			points.push(point);
		}
	});
	return points;
}
function drawColumnDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartColumnDataPoints {
	let xAxisData = opts.chartData.xAxisData,
		xAxisPoints = xAxisData.xAxisPoints!,
		eachSpacing = xAxisData.eachSpacing!;
	let columnOption = opts.extra.column!;
	let calPoints: ChartOptionsChartDataCalPoints[][] = [];
	context.save();
	let leftNum = -2;
	let rightNum = xAxisPoints.length + 2;
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		context.translate(opts._scrollDistance_!, 0);
		const scrollDistance = -opts._scrollDistance_!;
		leftNum = Math.floor(scrollDistance / eachSpacing) - 2;
		rightNum = leftNum + opts.xAxis.itemCount + 4;
	}
	//这里注释的代码后序需要使用到
	if (opts.tooltip != null && opts.tooltip!.textList.length > 0 && process == 1) {
		drawToolTipSplitArea(opts.tooltip!.offset.x, opts, config, context, eachSpacing);
	}
	columnOption.customColor = fillCustomColor(
		columnOption.linearType,
		columnOption.customColor,
		series,
		config
	);
	series.forEach(function (eachSeries, seriesIndex) {
		let ranges: string[] = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
		let minRange: number = parseFloat(ranges.pop()!);
		let maxRange: number = parseFloat(ranges.shift()!);
		// 计算0轴坐标
		let spacingValid = opts.height - opts.area[0] - opts.area[2];
		let zeroHeight = (spacingValid * (0 - minRange)) / (maxRange - minRange);
		let zeroPoints = opts.height - Math.round(zeroHeight) - opts.area[2];
		eachSeries.zeroPoints = zeroPoints;
		let data = eachSeries.data!;
		let points: ChartOptionsChartDataCalPoints[];
		switch (columnOption.type) {
			case "group":
				points = getColumnDataPoints(
					data,
					minRange,
					maxRange,
					xAxisPoints,
					eachSpacing,
					opts,
					config,
					zeroPoints,
					process
				);
				let tooltipPoints = getStackDataPoints(
					data,
					minRange,
					maxRange,
					xAxisPoints,
					eachSpacing,
					opts,
					config,
					seriesIndex,
					series,
					process
				);
				calPoints.push(tooltipPoints);
				points = fixColumeData(
					points,
					eachSpacing,
					series.length,
					seriesIndex,
					config,
					opts
				);
				for (let i = 0; i < points.length; i++) {
					let item = points[i];
					if (item != null && i > leftNum && i < rightNum) {
						let itemWidth = item.width!;
						let startX = item.x - itemWidth / 2;
						let height = opts.height - item.y - opts.area[2];
						context.beginPath();
						let fillColor: any = item.color ?? eachSeries.color!;
						let strokeColor = item.color ?? eachSeries.color!;
						if (columnOption.linearType != "none") {
							let grd: CanvasGradient = context.createLinearGradient(
								startX + opts.xOffset,
								item.y + opts.yOffset,
								startX + opts.xOffset,
								zeroPoints + opts.yOffset
							);
							//透明渐变
							if (columnOption.linearType == "opacity") {
								grd.addColorStop(
									0,
									hexToRgb(`${fillColor}`, columnOption.linearOpacity)
								);
								grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
							} else {
								grd.addColorStop(
									0,
									hexToRgb(
										columnOption.customColor[eachSeries.linearIndex!],
										columnOption.linearOpacity
									)
								);
								grd.addColorStop(
									columnOption.colorStop,
									hexToRgb(
										columnOption.customColor[eachSeries.linearIndex!],
										columnOption.linearOpacity
									)
								);
								grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
							}
							fillColor = grd;
						}
						// 圆角边框
						if (
							columnOption.barBorderRadius.length == 4 ||
							columnOption.barBorderCircle == true
						) {
							const left = startX;
							const top = item.y > zeroPoints ? zeroPoints : item.y;
							const width = item.width!;
							const height = Math.abs(zeroPoints - item.y);
							if (columnOption.barBorderCircle) {
								columnOption.barBorderRadius = [width / 2, width / 2, 0, 0];
							}
							if (item.y > zeroPoints) {
								columnOption.barBorderRadius = [0, 0, width / 2, width / 2];
							}
							let r0 = columnOption.barBorderRadius[0];
							let r1 = columnOption.barBorderRadius[1];
							let r2 = columnOption.barBorderRadius[2];
							let r3 = columnOption.barBorderRadius[3];
							let minRadius = Math.min(width / 2, height / 2);
							r0 = r0 > minRadius ? minRadius : r0;
							r1 = r1 > minRadius ? minRadius : r1;
							r2 = r2 > minRadius ? minRadius : r2;
							r3 = r3 > minRadius ? minRadius : r3;
							r0 = r0 < 0 ? 0 : r0;
							r1 = r1 < 0 ? 0 : r1;
							r2 = r2 < 0 ? 0 : r2;
							r3 = r3 < 0 ? 0 : r3;
							context.arc(
								opts.xOffset + left + r0,
								opts.yOffset + top + r0,
								r0,
								-Math.PI,
								-Math.PI / 2,
								false
							);
							context.arc(
								opts.xOffset + left + width - r1,
								opts.yOffset + top + r1,
								r1,
								-Math.PI / 2,
								0,
								false
							);
							context.arc(
								opts.xOffset + left + width - r2,
								opts.yOffset + top + height - r2,
								r2,
								0,
								Math.PI / 2,
								false
							);
							context.arc(
								opts.xOffset + left + r3,
								opts.yOffset + top + height - r3,
								r3,
								Math.PI / 2,
								Math.PI,
								false
							);
						} else {
							context.moveTo(opts.xOffset + startX, item.y + opts.yOffset);
							context.lineTo(
								opts.xOffset + startX + item.width!,
								item.y + opts.yOffset
							);
							context.lineTo(
								opts.xOffset + startX + item.width!,
								zeroPoints + opts.yOffset
							);
							context.lineTo(opts.xOffset + startX, zeroPoints + opts.yOffset);
							context.lineTo(opts.xOffset + startX, item.y + opts.yOffset);
							context.lineWidth = 1;
							context.strokeStyle = strokeColor;
						}
						context.fillStyle = fillColor;
						context.closePath();
						context.fill();
					}
				}
				break;
			case "stack":
				// 绘制堆叠数据图
				points = getStackDataPoints(
					data,
					minRange,
					maxRange,
					xAxisPoints,
					eachSpacing,
					opts,
					config,
					seriesIndex,
					series,
					process
				);
				calPoints.push(points);
				points = fixColumeStackData(points, eachSpacing, opts);
				for (let i = 0; i < points.length; i++) {
					let item = points[i];
					if (item != null && i > leftNum && i < rightNum) {
						context.beginPath();
						let fillColor = item.color ?? eachSeries.color!;
						let itemWidth = item.width!;
						let startX = item.x - itemWidth / 2 + 1;
						let height = opts.height - item.y - opts.area[2];
						let height0 = opts.height - item.y0 - opts.area[2];
						if (seriesIndex > 0) {
							height -= height0;
						}
						context.fillStyle = fillColor;
						context.moveTo(opts.xOffset + startX, opts.yOffset + item.y);
						context.fillRect(
							opts.xOffset + startX,
							opts.yOffset + item.y,
							item.width!,
							height
						);
						context.closePath();
						context.fill();
					}
				}
				break;
			case "meter":
				// 绘制温度计数据图 以下内容暂时不翻译不能删
				points = getDataPoints(
					data,
					minRange,
					maxRange,
					xAxisPoints,
					eachSpacing,
					opts,
					config,
					process
				);
				calPoints.push(points);
				points = fixColumeMeterData(
					points,
					eachSpacing,
					series.length,
					seriesIndex,
					config,
					opts,
					columnOption.meterBorder
				);
				for (let i = 0; i < points.length; i++) {
					let item = points[i];
					if (item != null && i > leftNum && i < rightNum) {
						//画背景颜色
						context.beginPath();
						if (seriesIndex == 0 && columnOption.meterBorder > 0) {
							context.strokeStyle = eachSeries.color!;
							context.lineWidth = columnOption.meterBorder * opts.pixelRatio;
						}
						if (seriesIndex == 0) {
							context.fillStyle = columnOption.meterFillColor;
						} else {
							context.fillStyle = item.color ?? eachSeries.color!;
						}
						let itemWidth = item.width!;
						let startX = item.x - itemWidth / 2;
						let height = opts.height - item.y - opts.area[2];
						if (
							columnOption.barBorderRadius.length == 4 ||
							columnOption.barBorderCircle == true
						) {
							const left = startX;
							const top = item.y;
							const width = item.width!;
							const height = zeroPoints - item.y;
							if (columnOption.barBorderCircle) {
								columnOption.barBorderRadius = [width / 2, width / 2, 0, 0];
							}
							// let [r0, r1, r2, r3] = columnOption.barBorderRadius;
							let r0: number = columnOption.barBorderRadius[0];
							let r1: number = columnOption.barBorderRadius[1];
							let r2: number = columnOption.barBorderRadius[2];
							let r3: number = columnOption.barBorderRadius[3];
							let minRadius = Math.min(width / 2, height / 2);
							r0 = r0 > minRadius ? minRadius : r0;
							r1 = r1 > minRadius ? minRadius : r1;
							r2 = r2 > minRadius ? minRadius : r2;
							r3 = r3 > minRadius ? minRadius : r3;
							r0 = r0 < 0 ? 0 : r0;
							r1 = r1 < 0 ? 0 : r1;
							r2 = r2 < 0 ? 0 : r2;
							r3 = r3 < 0 ? 0 : r3;
							context.arc(
								opts.xOffset + left + r0,
								opts.yOffset + top + r0,
								r0,
								-Math.PI,
								-Math.PI / 2
							);
							context.arc(
								opts.xOffset + left + width - r1,
								opts.yOffset + top + r1,
								r1,
								-Math.PI / 2,
								0
							);
							context.arc(
								opts.xOffset + left + width - r2,
								opts.yOffset + top + height - r2,
								r2,
								0,
								Math.PI / 2
							);
							context.arc(
								opts.xOffset + left + r3,
								opts.yOffset + top + height - r3,
								r3,
								Math.PI / 2,
								Math.PI
							);
							context.fill();
						} else {
							context.moveTo(opts.xOffset + startX, item.y + opts.yOffset);
							context.lineTo(
								opts.xOffset + startX + item.width!,
								item.y + opts.yOffset
							);
							context.lineTo(
								opts.xOffset + startX + item.width!,
								zeroPoints + opts.yOffset
							);
							context.lineTo(opts.xOffset + startX, zeroPoints + opts.yOffset);
							context.lineTo(opts.xOffset + startX, item.y + opts.yOffset);
							context.fill();
						}
						if (seriesIndex == 0 && columnOption.meterBorder > 0) {
							context.closePath();
							context.stroke();
						}
					}
				}
				break;
		}
	});

	if (opts.dataLabel != false && process == 1) {
		series.forEach(function (eachSeries, seriesIndex) {
			let ranges: string[] = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
			let minRange: number = parseFloat(ranges.pop()!);
			let maxRange: number = parseFloat(ranges.shift()!);
			let data = eachSeries.data!;
			let points: ChartOptionsChartDataCalPoints[];
			switch (columnOption.type) {
				case "group":
					points = getColumnDataPoints(
						data,
						minRange,
						maxRange,
						xAxisPoints,
						eachSpacing,
						opts,
						config,
						process
					);
					points = fixColumeData(
						points,
						eachSpacing,
						series.length,
						seriesIndex,
						config,
						opts
					);
					drawColumePointText(points, eachSeries, config, context, opts);
					break;
				case "stack":
					points = getStackDataPoints(
						data,
						minRange,
						maxRange,
						xAxisPoints,
						eachSpacing,
						opts,
						config,
						seriesIndex,
						series,
						process
					);
					drawColumePointText(points, eachSeries, config, context, opts);
					break;
				case "meter":
					points = getDataPoints(
						data,
						minRange,
						maxRange,
						xAxisPoints,
						eachSpacing,
						opts,
						config,
						process
					);
					drawColumePointText(points, eachSeries, config, context, opts);
					break;
			}
		});
	}
	context.restore();
	return {
		yAxisPoints: [] as number[],
		xAxisPoints: xAxisPoints,
		calPoints: calPoints,
		eachSpacing: eachSpacing
	} as ChartColumnDataPoints;
}
function drawLegend(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	chartData: ChartOptionsChartData
) {
	if (opts.legend.show == false) {
		return;
	}
	let legendData = chartData.legendData;
	let legendList = legendData.points;
	let legendArea = legendData.area;
	let padding = opts.legend.padding * opts.pixelRatio;
	let fontSize = opts.legend.fontSize * opts.pixelRatio;
	let shapeWidth = 15 * opts.pixelRatio;
	let shapeRight = 5 * opts.pixelRatio;
	let itemGap = opts.legend.itemGap * opts.pixelRatio;
	let lineHeight = Math.max(opts.legend.lineHeight * opts.pixelRatio, fontSize);
	//画背景及边框
	context.beginPath();
	context.lineWidth = opts.legend.borderWidth! * opts.pixelRatio;
	context.strokeStyle = opts.legend.borderColor;
	context.fillStyle = opts.legend.backgroundColor;
	context.moveTo(opts.xOffset + legendArea.start.x, opts.yOffset + legendArea.start.y);
	context.rect(
		legendArea.start.x + opts.xOffset,
		legendArea.start.y + opts.yOffset,
		legendArea.width,
		legendArea.height
	);
	context.closePath();
	context.fill();
	context.stroke();
	legendList.forEach(function (itemList, listIndex) {
		let width = 0;
		let height = 0;
		if (listIndex < legendData.widthArr.length) width = legendData.widthArr[listIndex];
		if (listIndex < legendData.heightArr.length) height = legendData.heightArr[listIndex];
		let startX = 0;
		let startY = 0;
		if (opts.legend.position == "top" || opts.legend.position == "bottom") {
			switch (opts.legend.float) {
				case "left":
					startX = legendArea.start.x + padding;
					break;
				case "right":
					startX = legendArea.start.x + legendArea.width - width;
					break;
				default:
					startX = legendArea.start.x + (legendArea.width - width) / 2;
			}
			startY = legendArea.start.y + padding + listIndex * lineHeight;
		} else {
			if (listIndex == 0) {
				width = 0;
			} else {
				width = legendData.widthArr[listIndex - 1];
			}
			startX = legendArea.start.x + padding + width;
			startY = legendArea.start.y + padding + (legendArea.height - height) / 2;
		}
		context.font = `${config.fontSize}px sans-serif`;
		for (let i = 0; i < itemList.length; i++) {
			let item = itemList[i];
			item.area = [0, 0, 0, 0];
			item.area![0] = startX;
			item.area![1] = startY;
			item.area![3] = startY + lineHeight;
			context.beginPath();
			context.lineWidth = 1 * opts.pixelRatio;
			context.strokeStyle = item.show ? item.color! : opts.legend.hiddenColor;
			context.fillStyle = item.show ? item.color! : opts.legend.hiddenColor;
			switch (item.legendShape) {
				case "line":
					context.moveTo(
						opts.xOffset + startX,
						opts.yOffset + startY + 0.5 * lineHeight - 2 * opts.pixelRatio
					);
					context.fillRect(
						opts.xOffset + startX,
						opts.yOffset + startY + 0.5 * lineHeight - 2 * opts.pixelRatio,
						15 * opts.pixelRatio,
						4 * opts.pixelRatio
					);
					break;
				case "triangle":
					context.moveTo(
						opts.xOffset + startX + 7.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio
					);
					context.lineTo(
						opts.xOffset + startX + 2.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight + 5 * opts.pixelRatio
					);
					context.lineTo(
						opts.xOffset + startX + 12.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight + 5 * opts.pixelRatio
					);
					context.lineTo(
						opts.xOffset + startX + 7.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio
					);
					break;
				case "diamond":
					context.moveTo(
						opts.xOffset + startX + 7.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio
					);
					context.lineTo(
						opts.xOffset + startX + 2.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight
					);
					context.lineTo(
						opts.xOffset + startX + 7.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight + 5 * opts.pixelRatio
					);
					context.lineTo(
						opts.xOffset + startX + 12.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight
					);
					context.lineTo(
						opts.xOffset + startX + 7.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio
					);
					break;
				case "circle":
					context.moveTo(
						opts.xOffset + startX + 7.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight
					);
					context.arc(
						opts.xOffset + startX + 7.5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight,
						5 * opts.pixelRatio,
						0,
						2 * Math.PI
					);
					break;
				case "rect":
					context.moveTo(
						opts.xOffset + startX,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio
					);
					context.fillRect(
						opts.xOffset + startX,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio,
						15 * opts.pixelRatio,
						10 * opts.pixelRatio
					);
					break;
				case "square":
					context.moveTo(
						opts.xOffset + startX + 5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio
					);
					context.fillRect(
						opts.xOffset + startX + 5 * opts.pixelRatio,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio,
						10 * opts.pixelRatio,
						10 * opts.pixelRatio
					);
					break;
				case "none":
					break;
				default:
					context.moveTo(
						opts.xOffset + startX,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio
					);
					context.fillRect(
						opts.xOffset + startX,
						opts.yOffset + startY + 0.5 * lineHeight - 5 * opts.pixelRatio,
						15 * opts.pixelRatio,
						10 * opts.pixelRatio
					);
			}
			context.closePath();
			context.fill();
			context.stroke();
			startX += shapeWidth + shapeRight;
			let fontTrans = 0.5 * lineHeight + 0.5 * fontSize - 2;
			const legendText = item.legendText ?? item.name!;
			context.beginPath();
			context.font = `${fontSize}px sans-serif`;
			context.fillStyle = item.show ? opts.legend.fontColor : opts.legend.hiddenColor;
			context.fillText(legendText, startX + opts.xOffset, opts.yOffset + startY + fontTrans);
			context.closePath();
			context.stroke();
			if (opts.legend.position == "top" || opts.legend.position == "bottom") {
				startX += measureText(legendText, fontSize) + itemGap;
				item.area![2] = startX;
			} else {
				item.area![2] = startX + measureText(legendText, fontSize) + itemGap;
				startX -= shapeWidth + shapeRight;
				startY += lineHeight;
			}
		}
	});
}
function calTooltipYAxisData(
	point: number,
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	eachSpacing: number
): string[] {
	let ranges = [...opts.chartData.yAxisData.ranges!];
	let spacingValid = opts.height - opts.area[0] - opts.area[2];
	let minAxis = opts.area[0];
	let items: string[] = [];
	for (let i = 0; i < ranges.length; i++) {
		const numberRanges = ranges[i].map((item: string): number => parseFloat(item));
		let maxVal = Math.max(...numberRanges);
		let minVal = Math.min(...numberRanges);
		let item = maxVal - ((maxVal - minVal) * (point - minAxis)) / spacingValid;
		let val: string = "";
		if (opts.yAxis.data != null) {
			if (opts.yAxis.data[i].formatter != null) {
				const fun = opts.yAxis.data[i].formatter as (
					item: number,
					i: number,
					opts: ChartOptions
				) => string;
				val = fun(item, i, opts);
			} else {
				val = item.toFixed(0);
			}
		}
		items.push(val);
	}
	return items;
}
function drawToolTipHorizentalLine(
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	eachSpacing: number,
	xAxisPoints: number[]
) {
	let toolTipOption = opts.extra.tooltip!;
	let startX = opts.area[3];
	let endX = opts.width - opts.area[1];
	if (toolTipOption.gridType == "dash") {
		context.setLineDash([toolTipOption.dashLength, toolTipOption.dashLength]);
	}
	context.strokeStyle = toolTipOption.gridColor;
	context.lineWidth = 1 * opts.pixelRatio;
	context.beginPath();
	context.moveTo(startX, opts.tooltip!.offset.y);
	context.lineTo(endX, opts.tooltip!.offset.y);
	context.stroke();
	context.setLineDash([]);
	if (toolTipOption.yAxisLabel) {
		let boxPadding = toolTipOption.boxPadding * opts.pixelRatio;
		let labelText = calTooltipYAxisData(
			opts.tooltip!.offset.y,
			opts.series!,
			opts,
			config,
			eachSpacing
		);
		let widthArr = opts.chartData.yAxisData.yAxisWidth!;
		let tStartLeft = opts.area[3];
		let tStartRight = opts.width - opts.area[1];
		for (let i = 0; i < labelText.length; i++) {
			const fontsize = toolTipOption.fontSize * opts.pixelRatio;
			context.font = `${fontsize}px sans-serif`;
			let textWidth = measureText(labelText[i], fontsize);
			let bgStartX: number = 0;
			let bgEndX: number = 0;
			let bgWidth: number = 0;
			if (widthArr[i].position == "left") {
				bgStartX = tStartLeft - (textWidth + boxPadding * 2) - 2 * opts.pixelRatio;
				bgEndX = Math.max(bgStartX, bgStartX + textWidth + boxPadding * 2);
			} else {
				bgStartX = tStartRight + 2 * opts.pixelRatio;
				bgEndX = Math.max(
					bgStartX + widthArr[i].width,
					bgStartX + textWidth + boxPadding * 2
				);
			}
			bgWidth = bgEndX - bgStartX;
			let textX = bgStartX + (bgWidth - textWidth) / 2;
			let textY = opts.tooltip!.offset.y;
			context.beginPath();
			context.fillStyle = hexToRgb(toolTipOption.labelBgColor, toolTipOption.labelBgOpacity);
			context.strokeStyle = toolTipOption.labelBgColor;
			context.lineWidth = 1 * opts.pixelRatio;
			context.rect(
				bgStartX,
				textY - 0.5 * config.fontSize - boxPadding,
				bgWidth,
				config.fontSize + 2 * boxPadding
			);
			context.closePath();
			context.stroke();
			context.fill();
			context.beginPath();
			context.font = `${config.fontSize}px sans-serif`;
			context.fillStyle = toolTipOption.labelFontColor;
			context.fillText(labelText[i], textX, textY + 0.5 * config.fontSize);
			context.closePath();
			context.stroke();
			if (widthArr[i].position == "left") {
				tStartLeft -= widthArr[i].width + opts.yAxis.padding * opts.pixelRatio;
			} else {
				tStartRight += widthArr[i].width + opts.yAxis.padding * opts.pixelRatio;
			}
		}
	}
}
function drawToolTipBridge(
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number,
	eachSpacing: number,
	xAxisPoints: number[]
) {
	//以下代码后续需要翻译
	let toolTipOption = opts.extra.tooltip ?? new ChartOptionsExtraTooltip();
	if (
		toolTipOption.horizentalLine &&
		opts.tooltip != null &&
		process == 1 &&
		(opts.type == "line" ||
			opts.type == "area" ||
			opts.type == "column" ||
			opts.type == "mount" ||
			opts.type == "candle" ||
			opts.type == "mix")
	) {
		drawToolTipHorizentalLine(opts, config, context, eachSpacing, xAxisPoints);
	}
	context.save();
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		context.translate(opts._scrollDistance_!, 0);
	}
	if (opts.tooltip != null && opts.tooltip!.textList.length > 0 && process == 1) {
		drawToolTip(opts.tooltip!.textList, opts.tooltip!.offset, opts, config, context);
	}
	context.restore();
}
function drawCanvas(opts: ChartOptions, context: CanvasRenderingContext2D) {
	context.save();
	context.translate(0, 0.5);
	context.restore();
	// context.draw();
}
function calMarkLineData(
	points: ChartOptionsExtraMarkLineData[],
	opts: ChartOptions
): ChartOptionsExtraMarkLineData[] {
	let minRange: number, maxRange: number;
	let spacingValid = opts.height - opts.area[0] - opts.area[2];
	for (let i = 0; i < points.length; i++) {
		points[i].yAxisIndex = points[i].yAxisIndex ?? 0;
		let range = [...opts.chartData.yAxisData.ranges![points[i].yAxisIndex!]];
		minRange = parseFloat(range.pop()!);
		maxRange = parseFloat(range.shift()!);
		let height = (spacingValid * (points[i].value! - minRange)) / (maxRange - minRange);
		points[i].y = opts.height - Math.round(height) - opts.area[2];
	}
	return points;
}
function drawMarkLine(
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	const markLineOption = opts.extra.markLine!;
	let startX = opts.area[3];
	let endX = opts.width - opts.area[1];
	let points = calMarkLineData(markLineOption.data, opts);
	for (let i = 0; i < points.length; i++) {
		let item = points[i];
		if (markLineOption.type == "dash") {
			context.setLineDash([markLineOption.dashLength, markLineOption.dashLength]);
		}
		context.strokeStyle = item.lineColor;
		context.lineWidth = 1 * opts.pixelRatio;
		context.beginPath();
		context.moveTo(opts.xOffset + startX, opts.yOffset + item.y!);
		context.lineTo(opts.xOffset + endX, opts.yOffset + item.y!);
		context.stroke();
		context.setLineDash([]);
		if (item.showLabel) {
			let fontSize = item.labelFontSize * opts.pixelRatio;
			let labelText = item.labelText ?? item.value!;
			context.font = `${fontSize}px sans-serif`;
			let textWidth = measureText(`${labelText}`, fontSize);
			let bgWidth = textWidth + item.labelPadding * opts.pixelRatio * 2;
			let bgStartX =
				item.labelAlign == "left" ? opts.area[3] - bgWidth : opts.width - opts.area[1];
			bgStartX += item.labelOffsetX;
			let bgStartY = item.y! - 0.5 * fontSize - item.labelPadding * opts.pixelRatio;
			bgStartY += item.labelOffsetY;
			let textX = bgStartX + item.labelPadding * opts.pixelRatio;
			let textY = item.y;
			context.fillStyle = hexToRgb(item.labelBgColor, item.labelBgOpacity);
			context.strokeStyle = item.labelBgColor;
			context.lineWidth = 1 * opts.pixelRatio;
			context.beginPath();
			context.rect(
				bgStartX + opts.xOffset,
				bgStartY + opts.yOffset,
				bgWidth,
				fontSize + 2 * item.labelPadding * opts.pixelRatio
			);
			context.closePath();
			context.stroke();
			context.fill();
			context.font = `${fontSize}px sans-serif`;
			context.textAlign = "left";
			context.fillStyle = item.labelFontColor;
			context.fillText(
				`${labelText}`,
				opts.xOffset + textX,
				opts.yOffset + bgStartY + fontSize + (item.labelPadding * opts.pixelRatio) / 2
			);
			context.stroke();
			context.textAlign = "left";
		}
	}
}
function contextRotate(context: CanvasRenderingContext2D, opts: ChartOptions) {
	if (opts.rotateLock != true) {
		context.translate(opts.height, 0);
		context.rotate((90 * Math.PI) / 180);
	} else if (opts._rotate_ != true) {
		context.translate(opts.height, 0);
		context.rotate((90 * Math.PI) / 180);
		opts._rotate_ = true;
	}
}
export class Animation {
	animationFrameId: number = 0;
	isStop: boolean = false;
	duration: number;
	timing: string;
	delay: number = 17;
	startTimeStamp: number = 0;
	opts: ChartAnimationOption;
	canvasContext: CanvasContext;
	constructor(opts: ChartAnimationOption) {
		this.canvasContext = opts.canvasContext;
		this.duration = opts.duration ?? 1000;
		this.timing = opts.timing ?? "easeInOut";
		this.delay = 17;
		this.opts = opts;
		this.startTimeStamp = new Date().getTime();
		this.step();
	}
	step() {
		if (this.isStop == true) {
			if (this.animationFrameId != 0)
				// @ts-ignore
				this.canvasContext.cancelAnimationFrame(this.animationFrameId);
			this.opts.onProcess(1);
			this.opts.onAnimationFinish();
			return;
		}
		const curdata = new Date().getTime();
		if (curdata - this.startTimeStamp < this.duration) {
			let process = (curdata - this.startTimeStamp) / this.duration;
			switch (this.timing) {
				case "easeIn":
					process = Timing.easeIn(process);
					break;
				case "easeOut":
					process = Timing.easeOut(process);
					break;
				case "easeInOut":
					process = Timing.easeInOut(process);
					break;
				case "linear":
					process = Timing.linear(process);
					break;
				default:
					break;
			}
			this.opts.onProcess(process);
			if (this.animationFrameId != 0)
				// @ts-ignore
				this.canvasContext.cancelAnimationFrame(this.animationFrameId);
			// @ts-ignore
			this.animationFrameId = this.canvasContext.requestAnimationFrame((_: number) => {
				this.step();
			});
		} else {
			if (this.animationFrameId != 0)
				// @ts-ignore
				this.canvasContext.cancelAnimationFrame(this.animationFrameId);
			this.opts.onProcess(1);
			this.opts.onAnimationFinish();
		}
	}

	stop() {
		this.isStop = true;
	}
}
// function fixPieSeries(series : ChartOptionsSeries[], opts : ChartOptions, config : TuiChartConfig) : ChartOptionsSeries[] {
// 	let pieSeriesArr : ChartOptionsSeries[] = [];
// 	if (series.length > 0 && Array.isArray(series[0].data)) {
// 		opts._pieSeries_ = series;
// 		let oldseries : ChartOptionsSeriesData[] = series[0].data;
// 		for (let i = 0; i < oldseries.length; i++) {
// 			const newseries = new ChartOptionsSeriesData()
// 			oldseries[i].formatter = series[0].formatter;
// 			oldseries[i].data = oldseries[i].value;
// 			pieSeriesArr.push(oldseries[i]);
// 		}
// 		// opts.series = pieSeriesArr;
// 	} else {
// 		// pieSeriesArr = series;
// 	}
// 	return pieSeriesArr;
// }
function getMountDataPoints(
	series: ChartOptionsSeries[],
	minRange: number,
	maxRange: number,
	xAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	mountOption: ChartOptionsExtraMount,
	zeroPoints: number,
	process: number = 1
): ChartOptionsChartDataCalPoints[] {
	// let process = arguments.length > 8 && arguments[8] != undefined ? arguments[8] : 1;
	let points: ChartOptionsChartDataCalPoints[] = [];
	let validHeight = opts.height - opts.area[0] - opts.area[2];
	let validWidth = opts.width - opts.area[1] - opts.area[3];
	let mountWidth = eachSpacing * mountOption.widthRatio;
	series.forEach((item, index) => {
		if (item == null) {
			// points.push(null);
		} else {
			// let point = {};
			let point = new ChartOptionsChartDataCalPoints();
			point.color = item.color;
			point.x = xAxisPoints[index];
			point.x += eachSpacing / 2;
			let value = item.data![0].value!;
			let height = (validHeight * (value * process - minRange)) / (maxRange - minRange);
			point.y = opts.height - height - opts.area[2];
			point.value = value;
			point.width = mountWidth;
			points.push(point);
		}
	});
	return points;
}
function drawMountPointText(
	points: ChartOptionsChartDataCalPoints[],
	series: ChartOptionsSeries[],
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	opts: ChartOptions,
	zeroPoints: number
) {
	// 绘制数据文案
	// let data = series.data!;发现是无用代码，如果后续代码不出问题删除这行代码
	// let Position = opts.extra.mount!.labelPosition;发现是无用代码，如果后续代码不出问题删除这行代码
	points.forEach(function (item, index) {
		if (item != null) {
			let itemseries: ChartOptionsSeries = series[index];
			let textOffset = itemseries.textOffset ?? 0;
			context.beginPath();
			let fontSize =
				itemseries.textSize != null
					? itemseries.textSize! * opts.pixelRatio
					: config.fontSize;
			context.font = `${fontSize}px sans-serif`;
			context.fillStyle = itemseries.textColor ?? opts.fontColor;
			let value = item.value;
			// let formatVal = series[index].formatter ? series[index].formatter(value, index, series, opts) : value;
			let formatVal: string = `${value}`;
			if (itemseries.formatter != null) {
				const fun = itemseries.formatter as (
					value: number,
					index: number,
					series: ChartOptionsSeries[],
					opts: ChartOptions
				) => string;
				formatVal = fun(value, index, series, opts);
			}
			context.textAlign = "center";
			let startY = item.y - 4 * opts.pixelRatio + textOffset * opts.pixelRatio;
			if (item.y > zeroPoints) {
				startY = item.y + textOffset * opts.pixelRatio + fontSize;
			}
			context.fillText(formatVal, item.x + opts.xOffset, startY + opts.yOffset);
			context.closePath();
			context.stroke();
			context.textAlign = "left";
		}
	});
}
function drawMountDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartColumnDataPoints {
	let xAxisData = opts.chartData.xAxisData;
	let xAxisPoints = xAxisData.xAxisPoints;
	let eachSpacing = xAxisData.eachSpacing!;
	let mountOption = opts.extra.mount!;
	mountOption.widthRatio = mountOption.widthRatio <= 0 ? 0 : mountOption.widthRatio;
	mountOption.widthRatio = mountOption.widthRatio >= 2 ? 2 : mountOption.widthRatio;
	let calPoints = [];
	context.save();
	let leftNum = -2;
	let rightNum = xAxisPoints.length + 2;
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		context.translate(opts._scrollDistance_!, 0);
		const scrollDistance = -opts._scrollDistance_!;
		leftNum = Math.floor(scrollDistance / eachSpacing) - 2;
		rightNum = leftNum + opts.xAxis.itemCount + 4;
	}
	mountOption.customColor = fillCustomColor(
		mountOption.linearType,
		mountOption.customColor,
		series,
		config
	);
	let ranges = [...opts.chartData.yAxisData.ranges![0]];
	let minRange = parseInt(ranges.pop()!);
	let maxRange = parseInt(ranges.shift()!);

	// 计算0轴坐标
	let spacingValid = opts.height - opts.area[0] - opts.area[2];
	let zeroHeight = (spacingValid * (0 - minRange)) / (maxRange - minRange);
	let zeroPoints = opts.height - Math.round(zeroHeight) - opts.area[2];

	let points = getMountDataPoints(
		series,
		minRange,
		maxRange,
		xAxisPoints,
		eachSpacing,
		opts,
		mountOption,
		zeroPoints,
		process
	);
	let xOffset = opts.xOffset;
	let yOffset = opts.yOffset;

	switch (mountOption.type) {
		case "bar":
			for (let i = 0; i < points.length; i++) {
				let item = points[i];
				if (item != null && i > leftNum && i < rightNum) {
					let startX = item.x - (eachSpacing * mountOption.widthRatio) / 2;
					let height = opts.height - item.y - opts.area[2];
					context.beginPath();
					let fillColor: any = item.color! ?? series[i].color!;
					let strokeColor = item.color ?? series[i].color;
					if (mountOption.linearType != "none") {
						let grd = context.createLinearGradient(
							startX + opts.xOffset,
							item.y + opts.yOffset,
							startX + opts.xOffset,
							zeroPoints + opts.yOffset
						);
						//透明渐变
						if (mountOption.linearType == "opacity") {
							grd.addColorStop(
								0,
								hexToRgb(`${fillColor}`, mountOption.linearOpacity)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						} else {
							grd.addColorStop(
								0,
								hexToRgb(
									mountOption.customColor[series[i].linearIndex!],
									mountOption.linearOpacity
								)
							);
							grd.addColorStop(
								mountOption.colorStop,
								hexToRgb(
									mountOption.customColor[series[i].linearIndex!],
									mountOption.linearOpacity
								)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						}
						fillColor = grd;
					}
					// 圆角边框
					if (
						mountOption.barBorderRadius.length == 4 ||
						mountOption.barBorderCircle == true
					) {
						const left = startX;
						const top = item.y > zeroPoints ? zeroPoints : item.y;
						const width = item.width!;
						const height = Math.abs(zeroPoints - item.y);
						if (mountOption.barBorderCircle) {
							mountOption.barBorderRadius = [width / 2, width / 2, 0, 0];
						}
						if (item.y > zeroPoints) {
							mountOption.barBorderRadius = [0, 0, width / 2, width / 2];
						}
						let r0 = mountOption.barBorderRadius[0];
						let r1 = mountOption.barBorderRadius[1];
						let r2 = mountOption.barBorderRadius[2];
						let r3 = mountOption.barBorderRadius[3];
						let minRadius = Math.min(width / 2, height / 2);
						r0 = r0 > minRadius ? minRadius : r0;
						r1 = r1 > minRadius ? minRadius : r1;
						r2 = r2 > minRadius ? minRadius : r2;
						r3 = r3 > minRadius ? minRadius : r3;
						r0 = r0 < 0 ? 0 : r0;
						r1 = r1 < 0 ? 0 : r1;
						r2 = r2 < 0 ? 0 : r2;
						r3 = r3 < 0 ? 0 : r3;
						context.arc(
							opts.xOffset + left + r0,
							opts.yOffset + top + r0,
							r0,
							-Math.PI,
							-Math.PI / 2
						);
						context.arc(
							opts.xOffset + left + width - r1,
							opts.yOffset + top + r1,
							r1,
							-Math.PI / 2,
							0
						);
						context.arc(
							opts.xOffset + left + width - r2,
							opts.yOffset + top + height - r2,
							r2,
							0,
							Math.PI / 2
						);
						context.arc(
							opts.xOffset + left + r3,
							opts.yOffset + top + height - r3,
							r3,
							Math.PI / 2,
							Math.PI
						);
					} else {
						context.moveTo(opts.xOffset + startX, item.y + opts.yOffset);
						context.lineTo(opts.xOffset + startX + item.width!, item.y + opts.yOffset);
						context.lineTo(
							opts.xOffset + startX + item.width!,
							zeroPoints + opts.yOffset
						);
						context.lineTo(opts.xOffset + startX, zeroPoints + opts.yOffset);
						context.lineTo(opts.xOffset + startX, item.y + opts.yOffset);
					}
					context.strokeStyle = `${strokeColor}`;
					context.fillStyle = fillColor;
					if (mountOption.borderWidth > 0) {
						context.lineWidth = mountOption.borderWidth * opts.pixelRatio;
						context.closePath();
						context.stroke();
					}
					context.fill();
				}
			}
			break;
		case "triangle":
			for (let i = 0; i < points.length; i++) {
				let item = points[i];
				if (item != null && i > leftNum && i < rightNum) {
					let startX = item.x - (eachSpacing * mountOption.widthRatio) / 2;
					let height = opts.height - item.y - opts.area[2];
					context.beginPath();
					let fillColor: any = item.color ?? series[i].color!;
					let strokeColor = item.color ?? series[i].color;
					if (mountOption.linearType != "none") {
						let grd = context.createLinearGradient(
							startX + opts.xOffset,
							item.y + opts.yOffset,
							startX + opts.xOffset,
							zeroPoints + opts.yOffset
						);
						//透明渐变
						if (mountOption.linearType == "opacity") {
							grd.addColorStop(
								0,
								hexToRgb(`${fillColor}`, mountOption.linearOpacity)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						} else {
							grd.addColorStop(
								0,
								hexToRgb(
									mountOption.customColor[series[i].linearIndex!],
									mountOption.linearOpacity
								)
							);
							grd.addColorStop(
								mountOption.colorStop,
								hexToRgb(
									mountOption.customColor[series[i].linearIndex!],
									mountOption.linearOpacity
								)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						}
						fillColor = grd;
					}
					context.moveTo(opts.xOffset + startX, zeroPoints + opts.yOffset);
					context.lineTo(opts.xOffset + item.x, item.y + opts.yOffset);
					context.lineTo(opts.xOffset + startX + item.width!, zeroPoints + opts.yOffset);
					context.strokeStyle = `${strokeColor}`;
					context.fillStyle = fillColor;
					if (mountOption.borderWidth > 0) {
						context.lineWidth = mountOption.borderWidth * opts.pixelRatio;
						context.stroke();
					}
					context.fill();
				}
			}
			break;
		case "mount":
			for (let i = 0; i < points.length; i++) {
				let item = points[i];
				if (item != null && i > leftNum && i < rightNum) {
					let startX = item.x - (eachSpacing * mountOption.widthRatio) / 2;
					let height = opts.height - item.y - opts.area[2];
					context.beginPath();
					let fillColor: any = item.color ?? series[i].color!;
					let strokeColor = item.color ?? series[i].color;
					if (mountOption.linearType != "none") {
						let grd = context.createLinearGradient(
							opts.xOffset + startX,
							item.y + opts.yOffset,
							startX + opts.xOffset,
							zeroPoints + opts.yOffset
						);
						//透明渐变
						if (mountOption.linearType == "opacity") {
							grd.addColorStop(
								0,
								hexToRgb(`${fillColor}`, mountOption.linearOpacity)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						} else {
							grd.addColorStop(
								0,
								hexToRgb(
									mountOption.customColor[series[i].linearIndex!],
									mountOption.linearOpacity
								)
							);
							grd.addColorStop(
								mountOption.colorStop,
								hexToRgb(
									mountOption.customColor[series[i].linearIndex!],
									mountOption.linearOpacity
								)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						}
						fillColor = grd;
					}
					context.moveTo(opts.xOffset + startX, zeroPoints + opts.yOffset);
					// 假设 opts.xOffset 和 opts.yOffset 是你的偏移量
					let itemWidth = item.width!;
					// 绘制第一条贝塞尔曲线
					context.bezierCurveTo(
						item.x - itemWidth / 4 + xOffset,
						zeroPoints + yOffset, // 控制点1的x和y坐标
						item.x - itemWidth / 4 + xOffset,
						item.y + yOffset, // 控制点2的x和y坐标
						item.x + xOffset,
						item.y + yOffset // 终点的x和y坐标
					);

					// 绘制第二条贝塞尔曲线
					context.bezierCurveTo(
						item.x + itemWidth / 4 + xOffset,
						item.y + yOffset, // 控制点1的x和y坐标
						item.x + itemWidth / 4 + xOffset,
						zeroPoints + yOffset, // 控制点2的x和y坐标
						startX + itemWidth + xOffset,
						zeroPoints + yOffset // 终点的x和y坐标
					);
					context.strokeStyle = `${strokeColor}`;
					context.fillStyle = fillColor;
					if (mountOption.borderWidth > 0) {
						context.lineWidth = mountOption.borderWidth * opts.pixelRatio;
						context.stroke();
					}
					context.fill();
				}
			}
			break;
		case "sharp":
			for (let i = 0; i < points.length; i++) {
				let item = points[i];
				if (item != null && i > leftNum && i < rightNum) {
					let startX = item.x - (eachSpacing * mountOption.widthRatio) / 2;
					let height = opts.height - item.y - opts.area[2];
					context.beginPath();
					let fillColor: any = item.color ?? series[i].color!;
					let strokeColor = item.color ?? series[i].color;
					if (mountOption.linearType != "none") {
						let grd = context.createLinearGradient(
							opts.xOffset + startX,
							item.y + opts.yOffset,
							startX + opts.xOffset,
							zeroPoints + opts.yOffset
						);
						//透明渐变
						if (mountOption.linearType == "opacity") {
							grd.addColorStop(
								0,
								hexToRgb(`${fillColor}`, mountOption.linearOpacity)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						} else {
							grd.addColorStop(
								0,
								hexToRgb(
									mountOption.customColor[series[i].linearIndex!],
									mountOption.linearOpacity
								)
							);
							grd.addColorStop(
								mountOption.colorStop,
								hexToRgb(
									mountOption.customColor[series[i].linearIndex!],
									mountOption.linearOpacity
								)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						}
						fillColor = grd;
					}
					context.moveTo(startX + opts.xOffset, zeroPoints + opts.yOffset);
					context.quadraticCurveTo(
						item.x - 0 + xOffset,
						zeroPoints - height / 4 + yOffset,
						item.x + xOffset,
						item.y + yOffset
					);
					context.quadraticCurveTo(
						item.x + 0 + xOffset,
						zeroPoints - height / 4 + yOffset,
						startX + item.width! + xOffset,
						zeroPoints + yOffset
					);
					context.strokeStyle = `${strokeColor}`;
					context.fillStyle = fillColor;
					if (mountOption.borderWidth > 0) {
						context.lineWidth = mountOption.borderWidth * opts.pixelRatio;
						context.stroke();
					}
					context.fill();
				}
			}
			break;
	}

	if (opts.dataLabel != false && process == 1) {
		let ranges = [...opts.chartData.yAxisData.ranges![0]];
		let minRange = parseInt(ranges.pop()!);
		let maxRange = parseInt(ranges.shift()!);
		let points = getMountDataPoints(
			series,
			minRange,
			maxRange,
			xAxisPoints,
			eachSpacing,
			opts,
			mountOption,
			zeroPoints,
			process
		);
		drawMountPointText(points, series, config, context, opts, zeroPoints);
	}
	context.restore();
	return {
		xAxisPoints: xAxisPoints,
		yAxisPoints: [] as number[],
		calPoints: [points],
		eachSpacing: eachSpacing
	} as ChartColumnDataPoints;
}
function getArrXAxisTextList(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	stack: string,
	index: number = -1
): number[] {
	let data: number[][] = [];
	series.forEach((item) => {
		data.push(...item.dataArr);
	});
	let sorted: number[] = [];
	data.forEach((item: number[]) => {
		sorted.push(item[0]);
	});
	let minData = 0;
	let maxData = 0;
	if (sorted.length > 0) {
		minData = Math.min(...sorted);
		maxData = Math.max(...sorted);
	}
	//为了兼容v1.9.0之前的项目
	if (index > -1) {
		if (opts.xAxis.data[index].min != null) {
			minData = Math.min(opts.xAxis.data![index].min!, minData);
		}
		if (opts.xAxis.data[index].max != null) {
			maxData = Math.max(opts.xAxis.data[index].max!, maxData);
		}
	} else {
		if (opts.xAxis.min != null) {
			minData = Math.min(opts.xAxis.min!, minData);
		}
		if (opts.xAxis.max != null) {
			maxData = Math.max(opts.xAxis.max!, maxData);
		}
	}
	if (minData == maxData) {
		let rangeSpan = maxData ?? 10;
		maxData += rangeSpan;
	}
	//let dataRange = getDataRange(minData, maxData);
	let minRange = minData;
	let maxRange = maxData;
	let range: number[] = [];
	let eachRange = (maxRange - minRange) / opts.xAxis.splitNumber!;
	for (let i = 0; i <= opts.xAxis.splitNumber!; i++) {
		range.push(minRange + eachRange * i);
	}
	return range;
}
function getXAxisTextList(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	stack: string,
	index: number = -1
): number[] {
	// let index = arguments.length > 4 && arguments[4] != undefined ? arguments[4] : -1;
	let data: ChartOptionsSeriesData[];
	if (stack == "stack") {
		data = dataCombineStack(series, opts.categories!.length);
	} else {
		data = dataCombine(series);
	}
	let sorted: number[] = [];
	// remove null from data
	data = data.filter((item: ChartOptionsSeriesData): boolean => {
		//return item != null;
		if (typeof item == "object" && item != null) {
			if (Array.isArray(item)) {
				return item != null;
			} else {
				return item.value != null;
			}
		} else {
			return item != null;
		}
	});
	data.forEach((item: ChartOptionsSeriesData) => {
		sorted.push(item.value!);
		// console.log(item)
		// if (typeof item == 'object') {
		// 	if (Array.isArray(item)) {
		// 		if (opts.type == 'candle') {
		// 			item.map(function (subitem) {
		// 				sorted.push(subitem);
		// 			})
		// 		} else {
		// 			sorted.push(item[0]);
		// 		}
		// 	} else {
		// 		sorted.push(item.value!);
		// 	}
		// } else {
		// 	sorted.push(item);
		// }
	});

	let minData = 0;
	let maxData = 0;
	if (sorted.length > 0) {
		minData = Math.min(...sorted);
		maxData = Math.max(...sorted);
	}
	//为了兼容v1.9.0之前的项目
	if (index > -1) {
		if (typeof opts.xAxis.data[index].min == "number") {
			minData = Math.min(opts.xAxis.data![index].min!, minData);
		}
		if (typeof opts.xAxis.data[index].max == "number") {
			maxData = Math.max(opts.xAxis.data[index].max!, maxData);
		}
	} else {
		if (typeof opts.xAxis.min == "number") {
			minData = Math.min(opts.xAxis.min!, minData);
		}
		if (typeof opts.xAxis.max == "number") {
			maxData = Math.max(opts.xAxis.max!, maxData);
		}
	}
	if (minData == maxData) {
		let rangeSpan = maxData ?? 10;
		maxData += rangeSpan;
	}
	//let dataRange = getDataRange(minData, maxData);
	let minRange = minData;
	let maxRange = maxData;
	let range: number[] = [];
	let eachRange = (maxRange - minRange) / opts.xAxis.splitNumber!;
	for (let i = 0; i <= opts.xAxis.splitNumber!; i++) {
		range.push(minRange + eachRange * i);
	}
	return range;
}
function calXAxisData(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
): ChartOptionsChartDataXAxisData {
	//堆叠图重算Y轴
	// let columnstyle = assign({}, {
	// 	type: ""
	// }, opts.extra.bar);
	// let columnstyle : ChartOptionsExtraBar = opts.extra.bar!
	const type = opts.extra.bar?.type ?? "";
	const result = new ChartOptionsChartDataXAxisData();
	result.angle = 0;
	result.xAxisHeight =
		opts.xAxis.lineHeight * opts.pixelRatio + opts.xAxis.marginTop * opts.pixelRatio;
	// let result = {
	// 	angle: 0,
	// 	xAxisHeight: opts.xAxis.lineHeight * opts.pixelRatio + opts.xAxis.marginTop * opts.pixelRatio
	// };
	if (opts.type == "scatter") {
		result.ranges = getArrXAxisTextList(series, opts, config, type);
	} else {
		result.ranges = getXAxisTextList(series, opts, config, type);
	}
	result.rangesFormat = result.ranges!.map((item: number): number => {
		//item = opts.xAxis.formatter ? opts.xAxis.formatter(item) : util.toFixed(item, 2);
		item = parseFloat(item.toFixed(2));
		return item;
	});
	let xAxisScaleValues = result.ranges!.map((item: number): string => {
		// 如果刻度值是浮点数,则保留两位小数
		item = parseFloat(item.toFixed(2));
		// 若有自定义格式则调用自定义的格式化函数
		//item = opts.xAxis.formatter ? opts.xAxis.formatter(Number(item)) : item;
		return `${item}`;
	});
	const xpoints = getXAxisPoints(xAxisScaleValues, opts, config);
	result.xAxisPoints = xpoints.xAxisPoints;
	result.startX = xpoints.startX;
	result.endX = xpoints.endX;
	result.eachSpacing = xpoints.eachSpacing;
	// result = Object.assign(result, getXAxisPoints(xAxisScaleValues, opts, config)); 合并翻译为上面的内容
	// 计算X轴刻度的属性譬如每个刻度的间隔,刻度的起始点\结束点以及总长
	let eachSpacing = result.eachSpacing;
	let textLength = xAxisScaleValues.map((item): number => {
		return measureText(item, opts.xAxis.fontSize * opts.pixelRatio);
	});
	if (opts.xAxis.disabled == true) {
		result.xAxisHeight = 0;
	}
	return result;
}
function drawBarToolTipSplitArea(
	offsetX: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	eachSpacing: number
) {
	let toolTipOption = opts.extra.bar!;
	let startX = opts.area[3];
	let endX = opts.width - opts.area[1];
	context.beginPath();
	context.fillStyle = hexToRgb(toolTipOption.activeBgColor, toolTipOption.activeBgOpacity);
	context.rect(startX + opts.xOffset, offsetX - eachSpacing / 2, endX - startX, eachSpacing);
	context.closePath();
	context.fill();
	context.fillStyle = "#FFFFFF";
}
function getBarDataPoints(
	data: ChartOptionsSeriesData[],
	minRange: number,
	maxRange: number,
	yAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	process: number = 1
): ChartOptionsChartDataCalPoints[] {
	let points: ChartOptionsChartDataCalPoints[] = [];
	let validHeight = opts.height - opts.area[0] - opts.area[2];
	let validWidth = opts.width - opts.area[1] - opts.area[3];
	data.forEach(function (item, index) {
		if (item == null) {
			// points.push(null);
		} else {
			let point = new ChartOptionsChartDataCalPoints();
			point.color = item.color;
			point.y = yAxisPoints[index];
			let value: number = item.value!;
			let height = (validWidth * (value - minRange)) / (maxRange - minRange);
			height *= process;
			point.height = height;
			point.value = value;
			point.x = height + opts.area[3];
			points.push(point);
		}
	});
	return points;
}
function getBarStackDataPoints(
	data: ChartOptionsSeriesData[],
	minRange: number,
	maxRange: number,
	yAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	seriesIndex: number,
	stackSeries: ChartOptionsSeries[],
	process: number = 1
): ChartOptionsChartDataCalPoints[] {
	let points: ChartOptionsChartDataCalPoints[] = [];
	let validHeight = opts.width - opts.area[1] - opts.area[3];
	data.forEach(function (item: ChartOptionsSeriesData, index: number) {
		if (item == null) {
			// points.push(null);
		} else {
			let point = new ChartOptionsChartDataCalPoints();
			point.color = item.color;
			point.y = yAxisPoints[index];
			let height: number = 0;
			let height0: number = 0;

			if (seriesIndex > 0) {
				let value = 0;
				for (let i = 0; i <= seriesIndex; i++) {
					value += stackSeries[i].data![index].value!;
				}
				let value0 = value - item.value!;
				height = (validHeight * (value - minRange)) / (maxRange - minRange);
				height0 = (validHeight * (value0 - minRange)) / (maxRange - minRange);
			} else {
				let value = item.value!;
				height = (validHeight * (value - minRange)) / (maxRange - minRange);
				height0 = 0;
			}
			let heightc = height0;
			height *= process;
			heightc *= process;
			point.height = height - heightc;
			point.x = opts.area[3] + height;
			point.x0 = opts.area[3] + heightc;
			points.push(point);
		}
	});
	return points;
}
function fixBarData(
	points: ChartOptionsChartDataCalPoints[],
	eachSpacing: number,
	columnLen: number,
	index: number,
	config: TuiChartConfig,
	opts: ChartOptions
): ChartOptionsChartDataCalPoints[] {
	return points.map((item): ChartOptionsChartDataCalPoints => {
		if (item == null) {
			// return null;
		}
		let seriesGap = 0;
		let categoryGap = 0;
		seriesGap = opts.extra.bar!.seriesGap * opts.pixelRatio;
		categoryGap = opts.extra.bar!.categoryGap * opts.pixelRatio;
		seriesGap = Math.min(seriesGap, eachSpacing / columnLen);
		categoryGap = Math.min(categoryGap, eachSpacing / columnLen);
		item.width = Math.ceil(
			(eachSpacing - 2 * categoryGap - seriesGap * (columnLen - 1)) / columnLen
		);
		if (opts.extra.bar != null && opts.extra.bar!.width != null && opts.extra.bar!.width! > 0) {
			item.width = Math.min(item.width!, +opts.extra.bar!.width! * opts.pixelRatio);
		}
		if (item.width! <= 0) {
			item.width = 1;
		}
		item.y += (index + 0.5 - columnLen / 2) * (item.width! + seriesGap);
		return item;
	});
}
function fixBarStackData(
	points: ChartOptionsChartDataCalPoints[],
	eachSpacing: number,
	columnLen: number,
	index: number,
	config: TuiChartConfig,
	opts: ChartOptions,
	series: ChartOptionsSeries[]
): ChartOptionsChartDataCalPoints[] {
	let categoryGap = opts.extra.bar!.categoryGap * opts.pixelRatio;
	return points.map(function (item): ChartOptionsChartDataCalPoints {
		if (item == null) {
			// return null;
		}
		item.width = Math.ceil(eachSpacing - 2 * categoryGap);
		if (
			opts.extra.bar != null &&
			opts.extra.bar!.width != null &&
			+opts.extra.bar!.width! > 0
		) {
			item.width = Math.min(item.width!, +opts.extra.bar!.width! * opts.pixelRatio);
		}
		if (item.width! <= 0) {
			item.width = 1;
		}
		return item;
	});
}
function drawBarPointText(
	points: ChartOptionsChartDataCalPoints[],
	series: ChartOptionsSeries,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	opts: ChartOptions
) {
	// 绘制数据文案
	let data = series.data!;
	let textOffset = series.textOffset ?? 0;
	points.forEach((item, index) => {
		if (item != null) {
			context.beginPath();
			let fontSize =
				series.textSize != null ? series.textSize! * opts.pixelRatio : config.fontSize;
			context.font = `${fontSize}px sans-serif`;
			context.fillStyle = series.textColor ?? opts.fontColor;
			let value = data[index].value!;
			// if (typeof data[index] == 'object' && data[index] != null) {
			// 	value = data[index].value;
			// }
			let formatVal: string = "";
			if (series.formatter != null) {
				const fun = series.formatter as (
					value: number,
					index: number,
					series: ChartOptionsSeries,
					opts: ChartOptions
				) => string;
				formatVal = fun(value, index, series, opts);
			} else {
				formatVal = `${value}`;
			}
			context.textAlign = "left";
			context.fillText(
				formatVal,
				opts.xOffset + item.x + 4 * opts.pixelRatio,
				opts.yOffset + item.y + fontSize / 2 - 3
			);
			context.closePath();
			context.stroke();
		}
	});
}
function drawBarDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartColumnDataPoints {
	let yAxisPoints: number[] = [];
	let eachSpacing = (opts.height - opts.area[0] - opts.area[2]) / opts.categories!.length;
	for (let i = 0; i < opts.categories!.length; i++) {
		yAxisPoints.push(opts.area[0] + eachSpacing / 2 + eachSpacing * i);
	}
	let columnOption = opts.extra.bar!;
	let calPoints: ChartOptionsChartDataCalPoints[][] = [];
	context.save();
	let leftNum = -2;
	let rightNum = yAxisPoints.length + 2;
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	if (opts.tooltip != null && opts.tooltip!.textList.length > 0 && process == 1) {
		drawBarToolTipSplitArea(opts.tooltip!.offset.y, opts, config, context, eachSpacing);
	}
	columnOption.customColor = fillCustomColor(
		columnOption.linearType,
		columnOption.customColor,
		series,
		config
	);
	series.forEach((eachSeries: ChartOptionsSeries, seriesIndex: number) => {
		let ranges: number[] = [...opts.chartData.xAxisData.ranges!];
		let maxRange = ranges.pop()!;
		let minRange = ranges.shift()!;
		let data = eachSeries.data!;
		let points: ChartOptionsChartDataCalPoints[] = [];
		switch (columnOption.type) {
			case "group":
				points = getBarDataPoints(
					data,
					minRange,
					maxRange,
					yAxisPoints,
					eachSpacing,
					opts,
					config,
					process
				);
				let tooltipPoints = getBarStackDataPoints(
					data,
					minRange,
					maxRange,
					yAxisPoints,
					eachSpacing,
					opts,
					config,
					seriesIndex,
					series,
					process
				);
				calPoints.push(tooltipPoints);
				points = fixBarData(points, eachSpacing, series.length, seriesIndex, config, opts);
				for (let i = 0; i < points.length; i++) {
					let item = points[i];
					//fix issues/I27B1N yyoinge & Joeshu
					if (item != null && i > leftNum && i < rightNum) {
						//let startX = item.x - item.width / 2;
						let itemWidth = item.width!;
						let startX = opts.area[3];
						let startY = item.y - itemWidth / 2;
						let height = item.height;
						context.beginPath();
						let fillColor: any = item.color ?? eachSeries.color!;
						let strokeColor: string = item.color ?? eachSeries.color!;
						if (columnOption.linearType != "none") {
							let grd = context.createLinearGradient(
								startX + xOffset,
								item.y + yOffset,
								item.x + xOffset,
								item.y + yOffset
							);
							//透明渐变
							if (columnOption.linearType == "opacity") {
								grd.addColorStop(
									0,
									hexToRgb(`${fillColor}`, columnOption.linearOpacity)
								);
								grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
							} else {
								grd.addColorStop(
									0,
									hexToRgb(
										columnOption.customColor![eachSeries.linearIndex!],
										columnOption.linearOpacity
									)
								);
								grd.addColorStop(
									columnOption.colorStop,
									hexToRgb(
										columnOption.customColor![eachSeries.linearIndex!],
										columnOption.linearOpacity
									)
								);
								grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
							}
							fillColor = grd;
						}
						// 圆角边框
						if (
							(columnOption.barBorderRadius != null &&
								columnOption.barBorderRadius!.length == 4) ||
							columnOption.barBorderCircle == true
						) {
							const left = startX;
							const width = item.width!;
							const top = item.y - width / 2;
							const height = item.height!;
							if (columnOption.barBorderCircle) {
								columnOption.barBorderRadius = [width / 2, width / 2, 0, 0];
							}
							let r0 = columnOption.barBorderRadius![0];
							let r1 = columnOption.barBorderRadius![1];
							let r2 = columnOption.barBorderRadius![2];
							let r3 = columnOption.barBorderRadius![3];
							let minRadius = Math.min(width / 2, height / 2);
							r0 = r0 > minRadius ? minRadius : r0;
							r1 = r1 > minRadius ? minRadius : r1;
							r2 = r2 > minRadius ? minRadius : r2;
							r3 = r3 > minRadius ? minRadius : r3;
							r0 = r0 < 0 ? 0 : r0;
							r1 = r1 < 0 ? 0 : r1;
							r2 = r2 < 0 ? 0 : r2;
							r3 = r3 < 0 ? 0 : r3;

							context.arc(
								xOffset + left + r3,
								yOffset + top + r3,
								r3,
								-Math.PI,
								-Math.PI / 2,
								false
							);
							context.arc(
								xOffset + item.x - r0,
								yOffset + top + r0,
								r0,
								-Math.PI / 2,
								0,
								false
							);
							context.arc(
								xOffset + item.x - r1,
								yOffset + top + width - r1,
								r1,
								0,
								Math.PI / 2,
								false
							);
							context.arc(
								xOffset + left + r2,
								yOffset + top + width - r2,
								r2,
								Math.PI / 2,
								Math.PI,
								false
							);
						} else {
							context.moveTo(xOffset + startX, yOffset + startY);
							context.lineTo(xOffset + item.x, yOffset + startY);
							context.lineTo(xOffset + item.x, yOffset + startY + item.width!);
							context.lineTo(xOffset + startX, yOffset + startY + item.width!);
							context.lineTo(xOffset + startX, yOffset + startY);
							context.lineWidth = 1;
							context.strokeStyle = strokeColor;
						}
						context.fillStyle = fillColor;
						context.closePath();
						//context.stroke();
						context.fill();
					}
				}
				break;
			case "stack":
				// 绘制堆叠数据图
				points = getBarStackDataPoints(
					data,
					minRange,
					maxRange,
					yAxisPoints,
					eachSpacing,
					opts,
					config,
					seriesIndex,
					series,
					process
				);
				calPoints.push(points);
				points = fixBarStackData(
					points,
					eachSpacing,
					series.length,
					seriesIndex,
					config,
					opts,
					series
				);
				for (let i = 0; i < points.length; i++) {
					let item = points[i];
					if (item != null && i > leftNum && i < rightNum) {
						context.beginPath();
						let fillColor = item.color ?? eachSeries.color!;
						let startX = item.x0;
						let itemWidth = item.width!;
						let itemHeight = item.height!;
						context.fillStyle = fillColor;
						context.moveTo(xOffset + startX, yOffset + item.y - itemWidth / 2);
						context.fillRect(
							startX + xOffset,
							item.y - itemWidth / 2 + yOffset,
							itemHeight,
							itemWidth
						);
						context.closePath();
						context.fill();
					}
				}
				break;
		}
	});

	if (opts.dataLabel != false && process == 1) {
		series.forEach(function (eachSeries, seriesIndex) {
			let ranges: number[] = [...opts.chartData.xAxisData.ranges!];
			let maxRange = ranges.pop()!;
			let minRange = ranges.shift()!;
			let data = eachSeries.data!;
			let points: ChartOptionsChartDataCalPoints[] = [];
			switch (columnOption.type) {
				case "group":
					points = getBarDataPoints(
						data,
						minRange,
						maxRange,
						yAxisPoints,
						eachSpacing,
						opts,
						config,
						process
					);
					points = fixBarData(
						points,
						eachSpacing,
						series.length,
						seriesIndex,
						config,
						opts
					);
					drawBarPointText(points, eachSeries, config, context, opts);
					break;
				case "stack":
					points = getBarStackDataPoints(
						data,
						minRange,
						maxRange,
						yAxisPoints,
						eachSpacing,
						opts,
						config,
						seriesIndex,
						series,
						process
					);
					drawBarPointText(points, eachSeries, config, context, opts);
					break;
			}
		});
	}
	return {
		xAxisPoints: [] as number[],
		yAxisPoints: yAxisPoints,
		calPoints: calPoints,
		eachSpacing: eachSpacing
	} as ChartColumnDataPoints;
}
function createCurveControlPoints(
	points: ChartOptionsChartDataCalPoints[],
	i: number
): ChartCurveControlPoints {
	const curvepoints = new ChartCurveControlPoints();
	function isNotMiddlePoint(points: ChartOptionsChartDataCalPoints[], i: number): boolean {
		if (i > 0 && i < points.length - 2) {
			return (
				points[i].y >= Math.max(points[i - 1].y, points[i + 1].y) ||
				points[i].y <= Math.min(points[i - 1].y, points[i + 1].y)
			);
		} else {
			return false;
		}
	}
	function isNotMiddlePointX(points: ChartOptionsChartDataCalPoints[], i: number): boolean {
		if (i > 0 && i < points.length - 2) {
			return (
				points[i].x >= Math.max(points[i - 1].x, points[i + 1].x) ||
				points[i].x <= Math.min(points[i - 1].x, points[i + 1].x)
			);
		} else {
			return false;
		}
	}
	let a = 0.2;
	let b = 0.2;
	let pAx = 0;
	let pAy = 0;
	let pBx = 0;
	let pBy = 0;
	if (i < 1) {
		pAx = points[0].x + (points[1].x - points[0].x) * a;
		pAy = points[0].y + (points[1].y - points[0].y) * a;
	} else {
		pAx = points[i].x + (points[i + 1].x - points[i - 1].x) * a;
		pAy = points[i].y + (points[i + 1].y - points[i - 1].y) * a;
	}

	if (i > points.length - 3) {
		let last = points.length - 1;
		pBx = points[last].x - (points[last].x - points[last - 1].x) * b;
		pBy = points[last].y - (points[last].y - points[last - 1].y) * b;
	} else {
		pBx = points[i + 1].x - (points[i + 2].x - points[i].x) * b;
		pBy = points[i + 1].y - (points[i + 2].y - points[i].y) * b;
	}
	if (isNotMiddlePoint(points, i + 1)) {
		pBy = points[i + 1].y;
	}
	if (isNotMiddlePoint(points, i)) {
		pAy = points[i].y;
	}
	if (isNotMiddlePointX(points, i + 1)) {
		pBx = points[i + 1].x;
	}
	if (isNotMiddlePointX(points, i)) {
		pAx = points[i].x;
	}
	if (
		pAy >= Math.max(points[i].y, points[i + 1].y) ||
		pAy <= Math.min(points[i].y, points[i + 1].y)
	) {
		pAy = points[i].y;
	}
	if (
		pBy >= Math.max(points[i].y, points[i + 1].y) ||
		pBy <= Math.min(points[i].y, points[i + 1].y)
	) {
		pBy = points[i + 1].y;
	}
	if (
		pAx >= Math.max(points[i].x, points[i + 1].x) ||
		pAx <= Math.min(points[i].x, points[i + 1].x)
	) {
		pAx = points[i].x;
	}
	if (
		pBx >= Math.max(points[i].x, points[i + 1].x) ||
		pBx <= Math.min(points[i].x, points[i + 1].x)
	) {
		pBx = points[i + 1].x;
	}
	const ctrAOffset = new Offset();
	const ctrBOffset = new Offset();
	ctrAOffset.x = pAx;
	ctrAOffset.y = pAy;
	ctrBOffset.x = pBx;
	ctrBOffset.y = pBy;
	curvepoints.ctrA = ctrAOffset;
	curvepoints.ctrB = ctrBOffset;
	return curvepoints;
}
function drawArrPointText(
	points: ChartOptionsChartDataCalPoints[],
	series: ChartOptionsSeries,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	opts: ChartOptions
) {
	// 绘制数据文案
	let data = series.dataArr;
	let textOffset = series.textOffset ?? 0;
	points.forEach((item: ChartOptionsChartDataCalPoints, index: number) => {
		context.beginPath();
		let fontSize = (series.textSize ?? config.fontSize) * opts.pixelRatio;
		context.font = `${fontSize}px sans-serif`;
		context.fillStyle = series.textColor ?? opts.fontColor;
		let value = data[index][1];
		let formatVal: string;
		if (series.formatter != null) {
			const fun = series.formatter as (
				value: number,
				index: number,
				series: ChartOptionsSeries,
				opts: ChartOptions
			) => string;
			formatVal = fun(value, index, series, opts);
		} else {
			formatVal = `${value}`;
		}

		context.textAlign = "center";
		context.fillText(
			formatVal,
			item.x + opts.xOffset,
			opts.yOffset + item.y - 4 + textOffset * opts.pixelRatio
		);
		context.closePath();
		context.stroke();
		context.textAlign = "left";
	});
}
function drawPointText(
	points: ChartOptionsChartDataCalPoints[],
	series: ChartOptionsSeries,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	opts: ChartOptions
) {
	// 绘制数据文案
	let data = series.data!;
	let textOffset = series.textOffset ?? 0;
	points.forEach((item: ChartOptionsChartDataCalPoints, index: number) => {
		context.beginPath();
		let fontSize = (series.textSize ?? config.fontSize) * opts.pixelRatio;
		context.font = `${fontSize}px sans-serif`;
		context.fillStyle = series.textColor ?? opts.fontColor;
		let value = data[index].value;
		// if (typeof data[index] == 'object' && data[index] != null) {
		// 	if (data[index].constructor.toString().indexOf('Array') > -1) {
		// 		value = data[index][1];
		// 	} else {
		// 		value = data[index].value
		// 	}
		// }
		// let formatVal = series.formatter ? series.formatter(value, index, series, opts) : value;
		let formatVal: string;
		if (series.formatter != null) {
			const fun = series.formatter as (
				value: number,
				index: number,
				series: ChartOptionsSeries,
				opts: ChartOptions
			) => string;
			formatVal = fun(value!, index, series, opts);
		} else {
			formatVal = `${value}`;
		}

		context.textAlign = "center";
		context.fillText(
			formatVal,
			item.x + opts.xOffset,
			opts.yOffset + item.y - 4 + textOffset * opts.pixelRatio
		);
		context.closePath();
		context.stroke();
		context.textAlign = "left";
	});
}
function drawActiveAreaPoint(
	points: ChartOptionsChartDataCalPoints[],
	color: string,
	shape: string,
	context: CanvasRenderingContext2D,
	opts: ChartOptions,
	option: ChartOptionsExtraArea,
	seriesIndex: number
) {
	if (opts.tooltip == null) return;
	if (opts.tooltip!.group.length > 0 && !opts.tooltip!.group.includes(seriesIndex)) {
		return;
	}
	let pointIndex =
		Array.isArray(opts.tooltip!.index) == false
			? (opts.tooltip!.index as number)
			: ((opts.tooltip!.index as number[])[
					opts.tooltip!.group.indexOf(seriesIndex)
				] as number);
	context.beginPath();
	if (option.activeType == "hollow") {
		context.strokeStyle = color;
		context.fillStyle = opts.background;
		context.lineWidth = 2 * opts.pixelRatio;
	} else {
		context.strokeStyle = "#ffffff";
		context.fillStyle = color;
		context.lineWidth = 1 * opts.pixelRatio;
	}
	if (shape == "diamond") {
		points.forEach(function (item, index) {
			if (item != null && pointIndex == index) {
				context.moveTo(item.x, item.y - 4.5);
				context.lineTo(item.x - 4.5, item.y);
				context.lineTo(item.x, item.y + 4.5);
				context.lineTo(item.x + 4.5, item.y);
				context.lineTo(item.x, item.y - 4.5);
			}
		});
	} else if (shape == "circle") {
		points.forEach(function (item, index) {
			if (item != null && pointIndex == index) {
				context.moveTo(item.x + 2.5 * opts.pixelRatio, item.y);
				context.arc(item.x, item.y, 3 * opts.pixelRatio, 0, 2 * Math.PI, false);
			}
		});
	} else if (shape == "square") {
		points.forEach(function (item, index) {
			if (item != null && pointIndex == index) {
				context.moveTo(item.x - 3.5, item.y - 3.5);
				context.rect(item.x - 3.5, item.y - 3.5, 7, 7);
			}
		});
	} else if (shape == "triangle") {
		points.forEach(function (item, index) {
			if (item != null && pointIndex == index) {
				context.moveTo(item.x, item.y - 4.5);
				context.lineTo(item.x - 4.5, item.y + 4.5);
				context.lineTo(item.x + 4.5, item.y + 4.5);
				context.lineTo(item.x, item.y - 4.5);
			}
		});
	} else if (shape == "none") {
		return;
	}
	context.closePath();
	context.fill();
	context.stroke();
}
function drawActivePoint(
	points: ChartOptionsChartDataCalPoints[],
	color: string,
	shape: string,
	context: CanvasRenderingContext2D,
	opts: ChartOptions,
	option: ChartOptionsExtraLine,
	seriesIndex: number
) {
	if (opts.tooltip == null) return;
	if (opts.tooltip!.group.length > 0 && opts.tooltip!.group.includes(seriesIndex) == false) {
		return;
	}
	let pointIndex =
		Array.isArray(opts.tooltip!.index) == false
			? (opts.tooltip!.index as number)
			: ((opts.tooltip!.index as number[])[
					opts.tooltip!.group.indexOf(seriesIndex)
				] as number);
	context.beginPath();
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	if (option.activeType == "hollow") {
		context.strokeStyle = color;
		context.fillStyle = opts.background;
		context.lineWidth = 2 * opts.pixelRatio;
	} else {
		context.strokeStyle = "#ffffff";
		context.fillStyle = color;
		context.lineWidth = 1 * opts.pixelRatio;
	}
	if (shape == "diamond") {
		points.forEach(function (item, index) {
			if (item != null && pointIndex == index) {
				context.moveTo(item.x + xOffset, item.y - 4.5 + yOffset);
				context.lineTo(item.x - 4.5 + xOffset, item.y + yOffset);
				context.lineTo(item.x + xOffset, item.y + 4.5 + yOffset);
				context.lineTo(item.x + 4.5 + xOffset, item.y + yOffset);
				context.lineTo(item.x + xOffset, item.y - 4.5 + yOffset);
			}
		});
	} else if (shape == "circle") {
		points.forEach(function (item, index) {
			if (item != null && pointIndex == index) {
				context.moveTo(item.x + 2.5 * opts.pixelRatio + xOffset, item.y + yOffset);
				context.arc(
					item.x + xOffset,
					item.y + yOffset,
					3 * opts.pixelRatio,
					0,
					2 * Math.PI,
					false
				);
			}
		});
	} else if (shape == "square") {
		points.forEach(function (item, index) {
			if (item != null && pointIndex == index) {
				context.moveTo(item.x - 3.5 + xOffset, item.y - 3.5 + yOffset);
				context.rect(item.x - 3.5 + xOffset, item.y - 3.5 + yOffset, 7, 7);
			}
		});
	} else if (shape == "triangle") {
		points.forEach(function (item, index) {
			if (item != null && pointIndex == index) {
				context.moveTo(item.x + xOffset, item.y - 4.5 + yOffset);
				context.lineTo(item.x - 4.5 + xOffset, item.y + 4.5 + yOffset);
				context.lineTo(item.x + 4.5 + xOffset, item.y + 4.5 + yOffset);
				context.lineTo(item.x + xOffset, item.y - 4.5 + yOffset);
			}
		});
	} else if (shape == "none") {
		return;
	}
	context.closePath();
	context.fill();
	context.stroke();
}
function drawPointShape(
	points: ChartOptionsChartDataCalPoints[],
	color: string,
	shape: string,
	context: CanvasRenderingContext2D,
	opts: ChartOptions
) {
	context.beginPath();
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	if (opts.dataPointShapeType == "hollow") {
		context.strokeStyle = color;
		context.fillStyle = opts.background;
		context.lineWidth = 2 * opts.pixelRatio;
	} else {
		context.strokeStyle = "#ffffff";
		context.fillStyle = color;
		context.lineWidth = 1 * opts.pixelRatio;
	}
	if (shape == "diamond") {
		points.forEach(function (item, index) {
			if (item != null) {
				context.moveTo(item.x + xOffset, item.y - 4.5 + yOffset);
				context.lineTo(item.x - 4.5 + xOffset, item.y + yOffset);
				context.lineTo(item.x + xOffset, item.y + 4.5 + yOffset);
				context.lineTo(item.x + 4.5 + xOffset, item.y + yOffset);
				context.lineTo(item.x + xOffset, item.y - 4.5 + yOffset);
			}
		});
	} else if (shape == "circle") {
		points.forEach(function (item, index) {
			if (item != null) {
				context.moveTo(item.x + 2.5 * opts.pixelRatio + xOffset, item.y + yOffset);
				context.arc(
					item.x + xOffset,
					item.y + yOffset,
					3 * opts.pixelRatio,
					0,
					2 * Math.PI,
					false
				);
			}
		});
	} else if (shape == "square") {
		points.forEach(function (item, index) {
			if (item != null) {
				context.moveTo(item.x - 3.5 + xOffset, item.y - 3.5 + yOffset);
				context.rect(item.x - 3.5 + xOffset, item.y - 3.5 + yOffset, 7, 7);
			}
		});
	} else if (shape == "triangle") {
		points.forEach(function (item, index) {
			if (item != null) {
				context.moveTo(item.x + xOffset, item.y - 4.5 + yOffset);
				context.lineTo(item.x - 4.5 + xOffset, item.y + 4.5 + yOffset);
				context.lineTo(item.x + 4.5 + xOffset, item.y + 4.5 + yOffset);
				context.lineTo(item.x + xOffset, item.y - 4.5 + yOffset);
			}
		});
	} else if (shape == "none") {
		return;
	}
	context.closePath();
	context.fill();
	context.stroke();
}
function splitCandlePoints(
	points: ChartOptionsChartDataCalPoints[][],
	eachSeries: ChartOptionsSeries
): ChartOptionsChartDataCalPoints[][][] {
	let newPoints: ChartOptionsChartDataCalPoints[][][] = [];
	let items: ChartOptionsChartDataCalPoints[][] = [];
	points.forEach(function (item, index) {
		if (eachSeries.connectNulls) {
			if (item != null) {
				items.push(item);
			}
		} else {
			if (item != null) {
				items.push(item);
			} else {
				if (items.length > 0) {
					newPoints.push(items);
				}
				items = [];
			}
		}
	});
	if (items.length > 0) {
		newPoints.push(items);
	}
	return newPoints;
}
function splitPoints(
	points: ChartOptionsChartDataCalPoints[],
	eachSeries: ChartOptionsSeries
): ChartOptionsChartDataCalPoints[][] {
	let newPoints: ChartOptionsChartDataCalPoints[][] = [];
	let items: ChartOptionsChartDataCalPoints[] = [];
	points.forEach(function (item, index) {
		if (eachSeries.connectNulls) {
			if (item != null) {
				items.push(item);
			}
		} else {
			if (item != null) {
				items.push(item);
			} else {
				if (items.length > 0) {
					newPoints.push(items);
				}
				items = [];
			}
		}
	});
	if (items.length > 0) {
		newPoints.push(items);
	}
	return newPoints;
}
function getLineDataPoints(
	data: ChartOptionsSeriesData[],
	minRange: number,
	maxRange: number,
	xAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	lineOption: ChartOptionsExtraLine,
	process: number = 1
): ChartOptionsChartDataCalPoints[] {
	let boundaryGap = opts.xAxis.boundaryGap;
	let points: ChartOptionsChartDataCalPoints[] = [];
	let validHeight = opts.height - opts.area[0] - opts.area[2];
	let validWidth = opts.width - opts.area[1] - opts.area[3];
	data.forEach(function (item, index) {
		if (item.value == null) {
			// points.push(null);
		} else {
			let point = new ChartOptionsChartDataCalPoints();
			point.color = item.color;
			if (lineOption.animation == "vertical") {
				point.x = xAxisPoints[index];
				let value = item.value!;
				// if (typeof item == 'object' && item != null) {
				// 	if (item.constructor.toString().indexOf('Array') > -1) {
				// 		let xranges, xminRange, xmaxRange;
				// 		xranges = [].concat(opts.chartData.xAxisData.ranges);
				// 		xminRange = xranges.shift();
				// 		xmaxRange = xranges.pop();
				// 		value = item[1];
				// 		point.x = opts.area[3] + validWidth * (item[0] - xminRange) / (xmaxRange - xminRange);
				// 	} else {
				// 		value = item.value;
				// 	}
				// }
				if (boundaryGap == "center") {
					point.x += eachSpacing / 2;
				}
				let height = (validHeight * (value - minRange)) / (maxRange - minRange);
				height *= process;
				point.y = opts.height - height - opts.area[2];
				points.push(point);
			} else {
				point.x = xAxisPoints[0] + eachSpacing * index * process;
				let value = item.value!;
				if (boundaryGap == "center") {
					point.x += eachSpacing / 2;
				}
				let height = (validHeight * (value - minRange)) / (maxRange - minRange);
				point.y = opts.height - height - opts.area[2];
				points.push(point);
			}
		}
	});
	return points;
}
export function drawLineDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartColumnDataPoints {
	let lineOption = opts.extra.line!;
	lineOption.width = lineOption.width * opts.pixelRatio;
	let xAxisData = opts.chartData.xAxisData;
	let xAxisPoints = xAxisData.xAxisPoints;
	let eachSpacing = xAxisData.eachSpacing!;
	let calPoints: ChartOptionsChartDataCalPoints[][] = [];
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	context.save();
	let leftSpace = 0;
	let rightSpace = opts.width + eachSpacing;
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		context.translate(opts._scrollDistance_!, 0);
		leftSpace = -opts._scrollDistance_! - eachSpacing * 2 + opts.area[3];
		rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
	}
	series.forEach((eachSeries, seriesIndex) => {
		// 这段很神奇的代码用于解决ios16的setStrokeStyle失效的bug
		context.beginPath();
		context.strokeStyle = eachSeries.color!;
		context.moveTo(-10000, -10000);
		context.lineTo(-10001, -10001);
		context.stroke();
		let stringRanges: string[] = opts.chartData.yAxisData.ranges![eachSeries.index!];
		let ranges: number[] = [...stringRanges.map((k: string): number => parseFloat(k))];
		let minRange = ranges.pop()!;
		let maxRange = ranges.shift()!;
		let data = eachSeries.data!;
		let points = getLineDataPoints(
			data,
			minRange,
			maxRange,
			xAxisPoints,
			eachSpacing,
			opts,
			config,
			lineOption,
			process
		);
		calPoints.push(points);
		let splitPointList: ChartOptionsChartDataCalPoints[][] = splitPoints(points, eachSeries);
		if (eachSeries.lineType == "dash") {
			let dashLength = eachSeries.dashLength ?? 8;
			dashLength *= opts.pixelRatio;
			context.setLineDash([dashLength, dashLength]);
		}
		context.beginPath();
		let strokeColor: any = eachSeries.color!;
		if (
			lineOption.linearType != "none" &&
			eachSeries.linearColor != null &&
			eachSeries.linearColor!.length > 0
		) {
			let grd = context.createLinearGradient(
				opts.chartData.xAxisData!.startX! + xOffset,
				opts.height / 2 + yOffset,
				opts.chartData.xAxisData!.endX! + xOffset,
				opts.height / 2 + yOffset
			);
			for (let i = 0; i < eachSeries.linearColor!.length; i++) {
				grd.addColorStop(
					parseFloat(eachSeries.linearColor![i][0]),
					hexToRgb(eachSeries.linearColor![i][1], 1)
				);
			}
			strokeColor = grd;
		}
		context.strokeStyle = strokeColor;
		context.lineWidth = lineOption.width;
		splitPointList.forEach(function (points, index) {
			if (points.length == 1) {
				context.moveTo(points[0].x + xOffset, points[0].y + yOffset);
			} else {
				context.moveTo(points[0].x + xOffset, points[0].y + yOffset);
				let startPoint = 0;
				if (lineOption.type == "curve") {
					for (let j = 0; j < points.length; j++) {
						let item = points[j];
						if (startPoint == 0 && item.x > leftSpace) {
							context.moveTo(item.x + xOffset, item.y + yOffset);
							startPoint = 1;
						}
						if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
							let ctrlPoint = createCurveControlPoints(points, j - 1);
							context.bezierCurveTo(
								ctrlPoint.ctrA.x + xOffset,
								ctrlPoint.ctrA.y + yOffset,
								ctrlPoint.ctrB.x + xOffset,
								ctrlPoint.ctrB.y + yOffset,
								item.x + xOffset,
								item.y + yOffset
							);
						}
					}
				}
				if (lineOption.type == "straight") {
					for (let j = 0; j < points.length; j++) {
						let item = points[j];
						if (startPoint == 0 && item.x > leftSpace) {
							context.moveTo(item.x + xOffset, item.y + yOffset);
							startPoint = 1;
						}
						if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
							context.lineTo(item.x + xOffset, item.y + yOffset);
						}
					}
				}
				if (lineOption.type == "step") {
					for (let j = 0; j < points.length; j++) {
						let item = points[j];
						if (startPoint == 0 && item.x > leftSpace) {
							context.moveTo(item.x + xOffset, item.y + yOffset);
							startPoint = 1;
						}
						if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
							context.lineTo(item.x + xOffset, points[j - 1].y + yOffset);
							context.lineTo(item.x + xOffset, item.y + yOffset);
						}
					}
				}
				context.moveTo(points[0].x + xOffset, points[0].y + yOffset);
			}
		});
		context.stroke();
		context.setLineDash([]);
		if (opts.dataPointShape != false) {
			drawPointShape(points, eachSeries.color!, eachSeries.pointShape, context, opts);
		}
		drawActivePoint(
			points,
			eachSeries.color!,
			eachSeries.pointShape,
			context,
			opts,
			lineOption,
			0
		);
	});
	if (opts.dataLabel != false && process == 1) {
		series.forEach(function (eachSeries, seriesIndex) {
			let stringRanges = opts.chartData.yAxisData.ranges![eachSeries.index!];
			let ranges = stringRanges.map((k: string): number => parseFloat(k));
			let minRange = ranges.pop()!;
			let maxRange = ranges.shift()!;
			let data = eachSeries.data!;
			let points = getDataPoints(
				data,
				minRange,
				maxRange,
				xAxisPoints,
				eachSpacing,
				opts,
				config,
				process
			);
			drawPointText(points, eachSeries, config, context, opts);
		});
	}
	context.restore();
	return {
		xAxisPoints: xAxisPoints,
		yAxisPoints: [] as number[],
		calPoints: calPoints,
		eachSpacing: eachSpacing
	} as ChartColumnDataPoints;
}

function drawAreaDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartColumnDataPoints {
	let areaOption = opts.extra.area!;
	let xAxisData = opts.chartData.xAxisData;
	let xAxisPoints = xAxisData.xAxisPoints;
	let eachSpacing = xAxisData.eachSpacing!;
	let endY = opts.height - opts.area[2];
	let calPoints: ChartOptionsChartDataCalPoints[][] = [];
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	context.save();
	let leftSpace = 0;
	let rightSpace = opts.width + eachSpacing;
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		context.translate(opts._scrollDistance_!, 0);
		leftSpace = -opts._scrollDistance_! - eachSpacing * 2 + opts.area[3];
		rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
	}
	series.forEach(function (eachSeries, seriesIndex) {
		let stringRanges: string[] = opts.chartData.yAxisData.ranges![eachSeries.index!];
		let ranges = stringRanges.map((k: string): number => parseFloat(k));
		let minRange = ranges.pop()!;
		let maxRange = ranges.shift()!;
		let data = eachSeries.data!;
		let points = getDataPoints(
			data,
			minRange,
			maxRange,
			xAxisPoints,
			eachSpacing,
			opts,
			config,
			process
		);
		calPoints.push(points);
		let splitPointList = splitPoints(points, eachSeries);
		for (let i = 0; i < splitPointList.length; i++) {
			let points = splitPointList[i];
			// 绘制区域数
			context.beginPath();
			context.strokeStyle = hexToRgb(eachSeries.color!, areaOption.opacity);
			if (areaOption.gradient) {
				let gradient = context.createLinearGradient(
					0 + xOffset,
					opts.area[0] + yOffset,
					0 + xOffset,
					opts.height - opts.area[2] + yOffset
				);
				gradient.addColorStop(0, hexToRgb(eachSeries.color!, areaOption.opacity));
				gradient.addColorStop(1, hexToRgb("#FFFFFF", 0.1));
				context.fillStyle = gradient;
			} else {
				context.fillStyle = hexToRgb(eachSeries.color!, areaOption.opacity);
			}
			context.lineWidth = areaOption.width * opts.pixelRatio;
			if (points.length > 1) {
				let firstPoint = points[0];
				let lastPoint = points[points.length - 1];
				context.moveTo(firstPoint.x + xOffset, firstPoint.y + yOffset);
				let startPoint = 0;
				if (areaOption.type == "curve") {
					for (let j = 0; j < points.length; j++) {
						let item = points[j];
						if (startPoint == 0 && item.x > leftSpace) {
							context.moveTo(item.x + xOffset, item.y + yOffset);
							startPoint = 1;
						}
						if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
							let ctrlPoint = createCurveControlPoints(points, j - 1);
							context.bezierCurveTo(
								ctrlPoint.ctrA.x + xOffset,
								ctrlPoint.ctrA.y + yOffset,
								ctrlPoint.ctrB.x + xOffset,
								ctrlPoint.ctrB.y + yOffset,
								item.x + xOffset,
								item.y + yOffset
							);
						}
					}
				}
				if (areaOption.type == "straight") {
					for (let j = 0; j < points.length; j++) {
						let item = points[j];
						if (startPoint == 0 && item.x > leftSpace) {
							context.moveTo(item.x + xOffset, item.y + yOffset);
							startPoint = 1;
						}
						if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
							context.lineTo(item.x + xOffset, item.y + yOffset);
						}
					}
				}
				if (areaOption.type == "step") {
					for (let j = 0; j < points.length; j++) {
						let item = points[j];
						if (startPoint == 0 && item.x > leftSpace) {
							context.moveTo(item.x + xOffset, item.y + yOffset);
							startPoint = 1;
						}
						if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
							context.lineTo(item.x + xOffset, points[j - 1].y + yOffset);
							context.lineTo(item.x + xOffset, item.y + yOffset);
						}
					}
				}
				context.lineTo(lastPoint.x + xOffset, endY + yOffset);
				context.lineTo(firstPoint.x + xOffset, endY + yOffset);
				context.lineTo(firstPoint.x + xOffset, firstPoint.y + yOffset);
			} else {
				let item = points[0];
				context.moveTo(item.x - eachSpacing / 2 + xOffset, item.y + yOffset);
				// context.lineTo(item.x + eachSpacing / 2, item.y);
				// context.lineTo(item.x + eachSpacing / 2, endY);
				// context.lineTo(item.x - eachSpacing / 2, endY);
				// context.moveTo(item.x - eachSpacing / 2, item.y);
			}
			context.closePath();
			context.fill();
			//画连线
			if (areaOption.addLine) {
				if (eachSeries.lineType == "dash") {
					let dashLength = eachSeries.dashLength ?? 8;
					dashLength *= opts.pixelRatio;
					context.setLineDash([dashLength, dashLength]);
				}
				context.beginPath();
				context.strokeStyle = eachSeries.color!;
				context.lineWidth = areaOption.width * opts.pixelRatio;
				if (points.length == 1) {
					context.moveTo(points[0].x + xOffset, points[0].y + yOffset);
					// context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
				} else {
					context.moveTo(points[0].x + xOffset, points[0].y + yOffset);
					let startPoint = 0;
					if (areaOption.type == "curve") {
						for (let j = 0; j < points.length; j++) {
							let item = points[j];
							if (startPoint == 0 && item.x > leftSpace) {
								context.moveTo(item.x + xOffset, item.y + yOffset);
								startPoint = 1;
							}
							if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
								let ctrlPoint = createCurveControlPoints(points, j - 1);
								context.bezierCurveTo(
									ctrlPoint.ctrA.x + xOffset,
									ctrlPoint.ctrA.y + yOffset,
									ctrlPoint.ctrB.x + xOffset,
									ctrlPoint.ctrB.y + yOffset,
									item.x + xOffset,
									item.y + yOffset
								);
							}
						}
					}
					if (areaOption.type == "straight") {
						for (let j = 0; j < points.length; j++) {
							let item = points[j];
							if (startPoint == 0 && item.x > leftSpace) {
								context.moveTo(item.x + xOffset, item.y + yOffset);
								startPoint = 1;
							}
							if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
								context.lineTo(item.x + xOffset, item.y + yOffset);
							}
						}
					}
					if (areaOption.type == "step") {
						for (let j = 0; j < points.length; j++) {
							let item = points[j];
							if (startPoint == 0 && item.x > leftSpace) {
								context.moveTo(item.x + xOffset, item.y + yOffset);
								startPoint = 1;
							}
							if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
								context.lineTo(item.x + xOffset, points[j - 1].y + yOffset);
								context.lineTo(item.x + xOffset, item.y + yOffset);
							}
						}
					}
					context.moveTo(points[0].x + xOffset, points[0].y + yOffset);
				}
				context.stroke();
				context.setLineDash([]);
			}
		}
		//画点
		if (opts.dataPointShape != false) {
			drawPointShape(points, eachSeries.color!, eachSeries.pointShape, context, opts);
		}
		drawActiveAreaPoint(
			points,
			eachSeries.color!,
			eachSeries.pointShape,
			context,
			opts,
			areaOption,
			seriesIndex
		);
	});

	if (opts.dataLabel != false && process == 1) {
		series.forEach((eachSeries, seriesIndex) => {
			let stringRanges = opts.chartData.yAxisData.ranges![eachSeries.index!];
			let ranges = stringRanges.map((k: string): number => parseFloat(k));
			let minRange = ranges.pop()!;
			let maxRange = ranges.shift()!;
			let data = eachSeries.data!;
			let points = getDataPoints(
				data,
				minRange,
				maxRange,
				xAxisPoints,
				eachSpacing,
				opts,
				config,
				process
			);
			drawPointText(points, eachSeries, config, context, opts);
		});
	}
	context.restore();
	return {
		xAxisPoints: xAxisPoints,
		yAxisPoints: [],
		calPoints: calPoints,
		eachSpacing: eachSpacing
	} as ChartColumnDataPoints;
}
function getPieDataPoints(
	series: ChartOptionsSeries[],
	radius: number,
	process: number = 1
): ChartOptionsSeries[] {
	let count = 0;
	let _start_ = 0;
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		// item.data = item.data == null ? 0 : item.data;
		let val = item.data![0].value!;
		count += val;
	}
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		// item.data = item.data == null ? 0 : item.data;
		let val = item.data![0].value!;
		if (count == 0) {
			item._proportion_ = (1 / series.length) * process;
		} else {
			item._proportion_ = (val / count) * process;
		}
		item._radius_ = radius;
	}
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		item._start_ = _start_;
		_start_ += 2 * item._proportion_ * Math.PI;
	}
	return series;
}
function isSameSign(num1: number, num2: number): boolean {
	return (
		(Math.abs(num1) == num1 && Math.abs(num2) == num2) ||
		(Math.abs(num1) != num1 && Math.abs(num2) != num2)
	);
}
function isCollision(
	obj1: ChartOptionsChartDataLegendDataArea,
	obj2: ChartOptionsChartDataLegendDataArea
): boolean {
	obj1.end.x = obj1.start.x + obj1.width;
	obj1.end.y = obj1.start.y - obj1.height;
	obj2.end.x = obj2.start.x + obj2.width;
	obj2.end.y = obj2.start.y - obj2.height;
	let flag =
		obj2.start.x > obj1.end.x ||
		obj2.end.x < obj1.start.x ||
		obj2.end.y > obj1.start.y ||
		obj2.start.y < obj1.end.y;
	return !flag;
}
function avoidCollision(
	obj: ChartOptionsChartDataLegendDataArea,
	target: ChartOptionsChartDataLegendDataArea | null
): ChartOptionsChartDataLegendDataArea {
	if (target != null) {
		while (isCollision(obj, target!)) {
			if (obj.start.x > 0) {
				obj.start.y--;
			} else if (obj.start.x < 0) {
				obj.start.y++;
			} else {
				if (obj.start.y > 0) {
					obj.start.y++;
				} else {
					obj.start.y--;
				}
			}
		}
	}
	return obj;
}
function convertCoordinateOrigin(
	x: number,
	y: number,
	center: Offset
): ChartOptionsChartDataCalPoints {
	const CoordinateOrigin = new ChartOptionsChartDataCalPoints();
	CoordinateOrigin.x = center.x + x;
	CoordinateOrigin.y = center.y - y;
	return CoordinateOrigin;
}

function drawPieText(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	radius: number,
	center: Offset
) {
	let lineRadius = config.pieChartLinePadding;
	let textObjectCollection: ChartOptionsChartDataLegendDataArea[] = [];
	let lastTextObject: ChartOptionsChartDataLegendDataArea | null = null;
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	let seriesConvert = series.map(
		(item: ChartOptionsSeries, index: number): ChartOptionsSeries => {
			// let text = item.formatter ? item.formatter(item, index, series, opts) : (item._proportion_ * 100).toFixed(2) + '%';
			let text: string = "";
			if (item.formatter != null) {
				const fun = item.formatter as (
					item: ChartOptionsSeries,
					index: number,
					series: ChartOptionsSeries[],
					opts: ChartOptions
				) => string;
				text = fun(item, index, series, opts);
			} else {
				text = (item._proportion_ * 100).toFixed(2) + "%";
			}
			text = item.data![0].labelText != null ? item.data![0].labelText! : text;
			let arc = 2 * Math.PI - (item._start_ + (2 * Math.PI * item._proportion_) / 2);
			if (item._rose_proportion_ > 0) {
				arc = 2 * Math.PI - (item._start_ + (2 * Math.PI * item._rose_proportion_) / 2);
			}
			let color = item.color;
			let radius = item._radius_;
			const seriesitem = new ChartOptionsSeries();
			seriesitem.arc = arc;
			seriesitem.text = text;
			seriesitem.color = color;
			seriesitem.radius = radius;
			seriesitem.textColor = item.data![0].textColor!;
			seriesitem.textSize = item.data![0].textSize;
			seriesitem.labelShow = item.data![0].labelShow;
			return seriesitem;
		}
	);
	for (let i = 0; i < seriesConvert.length; i++) {
		let item = seriesConvert[i];
		// line end
		let orginX1 = Math.cos(item.arc) * (item.radius + lineRadius);
		let orginY1 = Math.sin(item.arc) * (item.radius + lineRadius);
		// line start
		let orginX2 = Math.cos(item.arc) * item.radius;
		let orginY2 = Math.sin(item.arc) * item.radius;
		// text start
		let orginX3 =
			orginX1 >= 0
				? orginX1 + config.pieChartTextPadding
				: orginX1 - config.pieChartTextPadding;
		let orginY3 = orginY1;
		let textWidth = measureText(
			item.text,
			(item.textSize ?? config.fontSize) * opts.pixelRatio
		);
		let startY = orginY3;

		if (lastTextObject != null && isSameSign(lastTextObject!.start.x, orginX3)) {
			if (orginX3 > 0) {
				startY = Math.min(orginY3, lastTextObject!.start.y);
			} else if (orginX1 < 0) {
				startY = Math.max(orginY3, lastTextObject!.start.y);
			} else {
				if (orginY3 > 0) {
					startY = Math.max(orginY3, lastTextObject!.start.y);
				} else {
					startY = Math.min(orginY3, lastTextObject!.start.y);
				}
			}
		}
		if (orginX3 < 0) {
			orginX3 -= textWidth;
		}
		const textObject = new ChartOptionsChartDataLegendDataArea();
		const lineStart = new ChartOptionsChartDataLegendDataAreaXY();
		const lineEnd = new ChartOptionsChartDataLegendDataAreaXY();
		const start = new ChartOptionsChartDataLegendDataAreaXY();
		lineStart.x = orginX2;
		lineStart.y = orginY2;
		lineEnd.x = orginX1;
		lineEnd.y = orginY1;
		start.x = orginX3;
		start.y = startY;
		textObject.lineStart = lineStart;
		textObject.lineEnd = lineEnd;
		textObject.start = start;
		textObject.width = textWidth;
		textObject.height = config.fontSize;
		textObject.text = item.text;
		textObject.color = item.color!;
		textObject.textColor = item.textColor;
		textObject.textSize = item.textSize ?? config.fontSize;
		lastTextObject = avoidCollision(textObject, lastTextObject);
		textObjectCollection.push(lastTextObject!);
	}

	for (let i = 0; i < textObjectCollection.length; i++) {
		if (seriesConvert[i].labelShow == false) {
			continue;
		}
		let item = textObjectCollection[i];
		let lineStartPoistion = convertCoordinateOrigin(item.lineStart.x, item.lineStart.y, center);
		let lineEndPoistion = convertCoordinateOrigin(item.lineEnd.x, item.lineEnd.y, center);
		let textPosition = convertCoordinateOrigin(item.start.x, item.start.y, center);
		context.lineWidth = 1 * opts.pixelRatio;
		context.font = `${(item.textSize ?? config.fontSize) * opts.pixelRatio}px sans-serif`;
		context.beginPath();
		context.strokeStyle = item.color;
		context.fillStyle = item.color;
		context.moveTo(xOffset + lineStartPoistion.x, lineStartPoistion.y + yOffset);
		let curveStartX = item.start.x < 0 ? textPosition.x + item.width : textPosition.x;
		let textStartX = item.start.x < 0 ? textPosition.x - 5 : textPosition.x + 5;
		context.quadraticCurveTo(
			lineEndPoistion.x + xOffset,
			lineEndPoistion.y + yOffset,
			curveStartX + xOffset,
			textPosition.y + yOffset
		);
		context.moveTo(xOffset + lineStartPoistion.x, lineStartPoistion.y + yOffset);
		context.stroke();
		context.closePath();
		context.beginPath();
		context.moveTo(xOffset + textPosition.x + item.width, textPosition.y + yOffset);
		context.arc(
			xOffset + curveStartX,
			textPosition.y + yOffset,
			2 * opts.pixelRatio,
			0,
			2 * Math.PI
		);
		context.closePath();
		context.fill();
		context.beginPath();
		context.font = `${(item.textSize ?? config.fontSize) * opts.pixelRatio}px sans-serif`;
		context.fillStyle = item.textColor ?? opts.fontColor;
		context.fillText(item.text, textStartX + xOffset, textPosition.y + 3 + yOffset);
		context.closePath();
		context.stroke();
		context.closePath();
	}
}
function drawRingTitle(
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	center: Offset
) {
	let titlefontSize = opts.title.fontSize ?? config.titleFontSize;
	let subtitlefontSize = opts.subtitle.fontSize ?? config.subtitleFontSize;
	let title = opts.title.name ?? "";
	let subtitle = opts.subtitle.name ?? "";
	let titleFontColor = opts.title.color ?? opts.fontColor;
	let subtitleFontColor = opts.subtitle.color ?? opts.fontColor;
	let titleHeight = title != "" ? titlefontSize : 0;
	let subtitleHeight = subtitle != "" ? subtitlefontSize : 0;
	let margin = 5;
	if (subtitle != "") {
		let textWidth = measureText(subtitle, subtitlefontSize * opts.pixelRatio);
		let startX = center.x - textWidth / 2 + (opts.subtitle.offsetX ?? 0) * opts.pixelRatio;
		let startY =
			center.y +
			(subtitlefontSize * opts.pixelRatio) / 2 +
			(opts.subtitle.offsetY ?? 0) * opts.pixelRatio;
		if (title != "") {
			startY += (titleHeight * opts.pixelRatio + margin) / 2;
		}
		context.beginPath();
		context.font = `${subtitlefontSize * opts.pixelRatio}px sans-serif`;
		context.fillStyle = subtitleFontColor;
		context.fillText(subtitle, startX + opts.xOffset, startY + opts.yOffset);
		context.closePath();
		context.stroke();
	}
	if (title != "") {
		let _textWidth = measureText(title, titlefontSize * opts.pixelRatio);
		let _startX = center.x - _textWidth / 2 + (opts.title.offsetX ?? 0);
		let _startY =
			center.y +
			(titlefontSize * opts.pixelRatio) / 2 +
			(opts.title.offsetY ?? 0) * opts.pixelRatio;
		if (subtitle != "") {
			_startY -= (subtitleHeight * opts.pixelRatio + margin) / 2;
		}
		context.beginPath();
		context.font = `${titlefontSize * opts.pixelRatio}px sans-serif`;
		context.fillStyle = titleFontColor;
		context.fillText(title, _startX + opts.xOffset, _startY + opts.yOffset);
		context.closePath();
		context.stroke();
	}
}
function drawRingDataPoints(
	seriese: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartOptionsChartDataToolTiPData {
	let pieOption = opts.extra.ring!;
	const centerPosition = new Offset();
	centerPosition.x = opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2;
	centerPosition.y = opts.area[0] + (opts.height - opts.area[0] - opts.area[2]) / 2;
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	if (config.pieChartLinePadding == 0) {
		config.pieChartLinePadding = pieOption.activeRadius * opts.pixelRatio;
	}

	let radius = Math.min(
		(opts.width - opts.area[1] - opts.area[3]) / 2 -
			config.pieChartLinePadding -
			config.pieChartTextPadding -
			config._pieTextMaxLength_,
		(opts.height - opts.area[0] - opts.area[2]) / 2 -
			config.pieChartLinePadding -
			config.pieChartTextPadding
	);
	radius = radius < 10 ? 10 : radius;
	if (pieOption.customRadius != null && pieOption.customRadius! > 0) {
		radius = pieOption.customRadius! * opts.pixelRatio;
	}
	let series = getPieDataPoints(seriese, radius, process);

	let activeRadius = pieOption.activeRadius * opts.pixelRatio;
	pieOption.customColor = fillCustomColor(
		pieOption.linearType,
		pieOption.customColor,
		series,
		config
	);
	series = series.map((eachSeries: ChartOptionsSeries): ChartOptionsSeries => {
		eachSeries._start_ += (pieOption.offsetAngle! * Math.PI) / 180;
		return eachSeries;
	});
	series.forEach((eachSeries: ChartOptionsSeries, seriesIndex: number) => {
		if (opts.tooltip != null) {
			if ((opts.tooltip!.index as number) == seriesIndex) {
				context.beginPath();
				context.fillStyle = hexToRgb(eachSeries.color!, pieOption.activeOpacity);
				context.moveTo(xOffset + centerPosition.x, centerPosition.y + yOffset);
				context.arc(
					xOffset + centerPosition.x,
					centerPosition.y + yOffset,
					eachSeries._radius_ + activeRadius,
					eachSeries._start_,
					eachSeries._start_ + 2 * eachSeries._proportion_ * Math.PI,
					false
				);
				context.closePath();
				context.fill();
			}
		}
		context.beginPath();
		context.lineWidth = pieOption.borderWidth * opts.pixelRatio;

		context.lineJoin = "round";
		context.strokeStyle = pieOption.borderColor;
		let fillcolor: any = eachSeries.color!;
		if (pieOption.linearType == "custom") {
			let grd = context.createRadialGradient(
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				0,
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				eachSeries._radius_
			);
			grd.addColorStop(0, hexToRgb(pieOption.customColor![eachSeries.linearIndex!], 1));
			grd.addColorStop(1, hexToRgb(eachSeries.color!, 1));
			fillcolor = grd;
		}
		context.fillStyle = fillcolor;
		context.moveTo(xOffset + centerPosition.x, centerPosition.y + yOffset);
		context.arc(
			centerPosition.x + xOffset,
			centerPosition.y + yOffset,
			eachSeries._radius_,
			eachSeries._start_,
			eachSeries._start_ + 2 * eachSeries._proportion_ * Math.PI,
			false
		);
		context.closePath();
		context.fill();
		if (pieOption.border == true) {
			context.stroke();
		}
	});

	let innerPieWidth = radius * 0.6;
	if (typeof pieOption.ringWidth == "number" && pieOption.ringWidth > 0) {
		innerPieWidth = Math.max(0, radius - pieOption.ringWidth * opts.pixelRatio);
	}
	context.beginPath();
	context.fillStyle = pieOption.centerColor!;
	context.moveTo(xOffset + centerPosition.x, centerPosition.y + yOffset);
	context.arc(
		xOffset + centerPosition.x,
		centerPosition.y + yOffset,
		innerPieWidth,
		0,
		2 * Math.PI
	);
	context.closePath();
	context.fill();

	if (opts.dataLabel != false && process == 1) {
		drawPieText(series, opts, config, context, radius, centerPosition);
	}
	if (process == 1) {
		drawRingTitle(opts, config, context, centerPosition);
	}
	const piedata = new ChartOptionsChartDataToolTiPData();
	piedata.center = centerPosition;
	piedata.radius = radius;
	piedata.series = series;
	return piedata;
}
function drawPieDataPoints(
	seriese: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartOptionsChartDataToolTiPData {
	let pieOption = opts.extra.pie!;
	const centerPosition = new Offset();
	centerPosition.x = opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2;
	centerPosition.y = opts.area[0] + (opts.height - opts.area[0] - opts.area[2]) / 2;
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	if (config.pieChartLinePadding == 0) {
		config.pieChartLinePadding = pieOption.activeRadius * opts.pixelRatio;
	}

	let radius = Math.min(
		(opts.width - opts.area[1] - opts.area[3]) / 2 -
			config.pieChartLinePadding -
			config.pieChartTextPadding -
			config._pieTextMaxLength_,
		(opts.height - opts.area[0] - opts.area[2]) / 2 -
			config.pieChartLinePadding -
			config.pieChartTextPadding
	);
	radius = radius < 10 ? 10 : radius;
	if (pieOption.customRadius != null && pieOption.customRadius! > 0) {
		radius = pieOption.customRadius! * opts.pixelRatio;
	}
	let series = getPieDataPoints(seriese, radius, process);

	let activeRadius = pieOption.activeRadius * opts.pixelRatio;
	pieOption.customColor = fillCustomColor(
		pieOption.linearType,
		pieOption.customColor,
		series,
		config
	);
	series = series.map((eachSeries: ChartOptionsSeries): ChartOptionsSeries => {
		eachSeries._start_ += (pieOption.offsetAngle! * Math.PI) / 180;
		return eachSeries;
	});
	series.forEach((eachSeries: ChartOptionsSeries, seriesIndex: number) => {
		if (opts.tooltip != null) {
			if ((opts.tooltip!.index as number) == seriesIndex) {
				context.beginPath();
				context.fillStyle = hexToRgb(eachSeries.color!, pieOption.activeOpacity);

				context.moveTo(xOffset + centerPosition.x, centerPosition.y + yOffset);
				context.arc(
					xOffset + centerPosition.x,
					centerPosition.y + yOffset,
					eachSeries._radius_ + activeRadius,
					eachSeries._start_,
					eachSeries._start_ + 2 * eachSeries._proportion_ * Math.PI,
					false
				);
				context.closePath();
				context.fill();
			}
		}
		context.beginPath();
		context.lineWidth = pieOption.borderWidth * opts.pixelRatio;

		context.lineJoin = "round";
		context.strokeStyle = pieOption.borderColor;
		let fillcolor: any = eachSeries.color!;
		if (pieOption.linearType == "custom") {
			let grd = context.createRadialGradient(
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				0,
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				eachSeries._radius_
			);
			grd.addColorStop(0, hexToRgb(pieOption.customColor![eachSeries.linearIndex!], 1));
			grd.addColorStop(1, hexToRgb(eachSeries.color!, 1));
			fillcolor = grd;
		}
		context.fillStyle = fillcolor;
		context.moveTo(xOffset + centerPosition.x, centerPosition.y + yOffset);
		context.arc(
			xOffset + centerPosition.x,
			centerPosition.y + yOffset,
			eachSeries._radius_,
			eachSeries._start_,
			eachSeries._start_ + 2 * eachSeries._proportion_ * Math.PI,
			false
		);
		context.closePath();
		context.fill();
		if (pieOption.border == true) {
			context.stroke();
		}
	});

	if (opts.dataLabel != false && process == 1) {
		drawPieText(series, opts, config, context, radius, centerPosition);
	}

	const piedata = new ChartOptionsChartDataToolTiPData();
	piedata.center = centerPosition;
	piedata.radius = radius;
	piedata.series = series;
	return piedata;
}
function getPieTextMaxLength(
	eseries: ChartOptionsSeries[],
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	opts: ChartOptions
): number {
	let series = getPieDataPoints(eseries, 0);
	let maxLength = 0;
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		// let text = item.formatter ? item.formatter(+item._proportion_.toFixed(2)) : (item._proportion_ * 100).toFixed(0) + '%';
		let text: string = "";
		if (item.formatter != null) {
			const fun = item.formatter as (proportion: string) => string;
			text = fun(item._proportion_.toFixed(2));
		} else {
			text = (item._proportion_ * 100).toFixed(0) + "%";
		}
		maxLength = Math.max(
			maxLength,
			measureText(text, (item.textSize ?? config.fontSize) * opts.pixelRatio)
		);
	}
	return maxLength;
}

function isInAngleRange(eangle: number, estartAngle: number, eendAngle: number): boolean {
	function adjust(eangle: number): number {
		let angle = eangle;
		while (angle < 0) {
			angle += 2 * Math.PI;
		}
		while (angle > 2 * Math.PI) {
			angle -= 2 * Math.PI;
		}
		return angle;
	}
	let angle = adjust(eangle);
	let startAngle = adjust(estartAngle);
	let endAngle = adjust(eendAngle);
	if (startAngle > endAngle) {
		endAngle += 2 * Math.PI;
		if (angle < startAngle) {
			angle += 2 * Math.PI;
		}
	}
	return angle >= startAngle && angle <= endAngle;
}

function isInExactPieChartArea(
	currentPoints: TouchPosition,
	center: Offset,
	radius: number
): boolean {
	return (
		Math.pow(currentPoints.x - center.x, 2) + Math.pow(currentPoints.y - center.y, 2) <=
		Math.pow(radius, 2)
	);
}

export function findPieChartCurrentIndex(
	currentPoints: TouchPosition,
	pieData: ChartOptionsChartDataToolTiPData,
	opts: ChartOptions
): ChartOptionsTooltip {
	let tooltip: ChartOptionsTooltip = new ChartOptionsTooltip();
	let currentIndex = -1;
	let series = getPieDataPoints(pieData.series, 0);
	if (isInExactPieChartArea(currentPoints, pieData.center, pieData.radius)) {
		let angle = Math.atan2(
			pieData.center.y - currentPoints.y,
			currentPoints.x - pieData.center.x
		);
		angle = -angle;

		if (opts.extra.pie != null && opts.extra.pie!.offsetAngle != null) {
			angle = angle - (opts.extra.pie!.offsetAngle! * Math.PI) / 180;
		}
		if (opts.extra.ring != null && opts.extra.ring!.offsetAngle != null) {
			angle = angle - (opts.extra.ring!.offsetAngle! * Math.PI) / 180;
		}
		for (let i = 0, len = series.length; i < len; i++) {
			if (
				isInAngleRange(
					angle,
					series[i]._start_,
					series[i]._start_ + series[i]._proportion_ * 2 * Math.PI
				)
			) {
				currentIndex = i;
				break;
			}
		}
	}
	tooltip.index = currentIndex;
	return tooltip;
}
function calCandleMA(
	dayArr: number[],
	nameArr: string[],
	colorArr: string[],
	kdata: number[][]
): ChartOptionsSeries[] {
	let seriesTemp: ChartOptionsSeries[] = [];
	for (let k = 0; k < dayArr.length; k++) {
		let seriesItem = new ChartOptionsSeries();
		seriesItem.data = [];
		seriesItem.name = nameArr[k];
		seriesItem.color = colorArr[k];
		for (let i = 0, len = kdata.length; i < len; i++) {
			const seriesdata = new ChartOptionsSeriesData();
			if (i < dayArr[k]) {
				seriesdata.value = null;
				seriesItem.data!.push(seriesdata);
				continue;
			} else {
				let sum = 0;
				for (let j = 0; j < dayArr[k]; j++) {
					sum += kdata[i - j][1];
				}
				seriesdata.value = parseFloat((sum / dayArr[k]).toFixed(3));
				seriesItem.data!.push(seriesdata);
			}
		}
		seriesTemp.push(seriesItem);
	}
	return seriesTemp;
}
function getRoseDataPoints(
	series: ChartOptionsSeries[],
	type: string,
	minRadius: number,
	radius: number,
	process: number = 1
): ChartOptionsSeries[] {
	let count = 0;
	let _start_ = 0;
	let dataArr: number[] = [];
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		count += item.data![0].value!;
		dataArr.push(item.data![0].value!);
	}
	let minData = Math.min(...dataArr);
	let maxData = Math.max(...dataArr);
	let radiusLength = radius - minRadius;
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		// item.data = item.data == null ? 0 : item.data;
		if (count == 0) {
			item._proportion_ = (1 / series.length) * process;
			item._rose_proportion_ = (1 / series.length) * process;
		} else {
			const val = item.data![0].value!;
			item._proportion_ = (val / count) * process;
			if (type == "area") {
				item._rose_proportion_ = (1 / series.length) * process;
			} else {
				item._rose_proportion_ = (val / count) * process;
			}
		}
		item._radius_ =
			// @ts-ignore
			minRadius + radiusLength * ((item.data![0].value! - minData) / (maxData - minData)) ??
			radius;
	}
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		item._start_ = _start_;
		_start_ += 2 * item._rose_proportion_ * Math.PI;
	}
	return series;
}
function drawRoseDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartOptionsChartDataToolTiPData {
	let roseOption = opts.extra.rose!;
	if (config.pieChartLinePadding == 0) {
		config.pieChartLinePadding = roseOption.activeRadius * opts.pixelRatio;
	}
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;

	let centerPosition = new Offset();
	centerPosition.x = opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2;
	centerPosition.y = opts.area[0] + (opts.height - opts.area[0] - opts.area[2]) / 2;
	// let centerPosition = {
	// 	x: opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2,
	// 	y: opts.area[0] + (opts.height - opts.area[0] - opts.area[2]) / 2
	// };
	let radius = Math.min(
		(opts.width - opts.area[1] - opts.area[3]) / 2 -
			config.pieChartLinePadding -
			config.pieChartTextPadding -
			config._pieTextMaxLength_,
		(opts.height - opts.area[0] - opts.area[2]) / 2 -
			config.pieChartLinePadding -
			config.pieChartTextPadding
	);
	radius = radius < 10 ? 10 : radius;
	let minRadius = roseOption.minRadius ?? radius * 0.5;
	if (radius < minRadius) {
		radius = minRadius + 10;
	}
	series = getRoseDataPoints(series, roseOption.type, minRadius, radius, process);
	let activeRadius = roseOption.activeRadius * opts.pixelRatio;
	roseOption.customColor = fillCustomColor(
		roseOption.linearType,
		roseOption.customColor,
		series,
		config
	);
	series = series.map((eachSeries: ChartOptionsSeries): ChartOptionsSeries => {
		eachSeries._start_ += ((roseOption.offsetAngle ?? 0) * Math.PI) / 180;
		return eachSeries;
	});
	series.forEach(function (eachSeries, seriesIndex) {
		if (opts.tooltip != null) {
			if ((opts.tooltip!.index as number) == seriesIndex) {
				context.beginPath();
				context.fillStyle = hexToRgb(eachSeries.color!, roseOption.activeOpacity);
				context.moveTo(xOffset + centerPosition.x, centerPosition.y + yOffset);
				context.arc(
					xOffset + centerPosition.x,
					centerPosition.y + yOffset,
					activeRadius + eachSeries._radius_,
					eachSeries._start_,
					eachSeries._start_ + 2 * eachSeries._rose_proportion_ * Math.PI,
					false
				);
				context.closePath();
				context.fill();
			}
		}
		context.beginPath();
		context.lineWidth = roseOption.borderWidth * opts.pixelRatio;
		context.lineJoin = "round";
		context.strokeStyle = roseOption.borderColor;
		let fillcolor: any = eachSeries.color!;
		if (roseOption.linearType == "custom") {
			// let grd;
			// if (context.createCircularGradient) {
			// 	grd = context.createCircularGradient(centerPosition.x, centerPosition.y, eachSeries._radius_)
			// } else {
			// 	grd = context.createRadialGradient(centerPosition.x, centerPosition.y, 0, centerPosition.x,
			// 		centerPosition.y, eachSeries._radius_)
			// }
			let grd = context.createRadialGradient(
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				0,
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				eachSeries._radius_
			);
			grd.addColorStop(0, hexToRgb(roseOption.customColor![eachSeries.linearIndex!], 1));
			grd.addColorStop(1, hexToRgb(eachSeries.color!, 1));
			fillcolor = grd;
		}
		context.fillStyle = fillcolor;
		context.moveTo(xOffset + centerPosition.x, centerPosition.y + yOffset);
		context.arc(
			xOffset + centerPosition.x,
			centerPosition.y + yOffset,
			eachSeries._radius_,
			eachSeries._start_,
			eachSeries._start_ + 2 * eachSeries._rose_proportion_ * Math.PI,
			false
		);
		context.closePath();
		context.fill();
		if (roseOption.border == true) {
			context.stroke();
		}
	});

	if (opts.dataLabel != false && process == 1) {
		drawPieText(series, opts, config, context, radius, centerPosition);
	}
	const tooldata = new ChartOptionsChartDataToolTiPData();
	tooldata.center = centerPosition;
	tooldata.radius = radius;
	tooldata.series = series;
	return tooldata;
}

export function findRoseChartCurrentIndex(
	currentPoints: TouchPosition,
	pieData: ChartOptionsChartDataToolTiPData,
	opts: ChartOptions
): ChartOptionsTooltip {
	let tooltip: ChartOptionsTooltip = new ChartOptionsTooltip();
	let currentIndex = -1;
	let series = getRoseDataPoints(
		opts._series_!,
		opts.extra.rose!.type,
		pieData.radius,
		pieData.radius
	);
	if (isInExactPieChartArea(currentPoints, pieData.center, pieData.radius)) {
		let angle = Math.atan2(
			pieData.center.y - currentPoints.y,
			currentPoints.x - pieData.center.x
		);
		angle = -angle;
		if (opts.extra.rose != null && opts.extra.rose!.offsetAngle != null) {
			angle = angle - (opts.extra.rose!.offsetAngle! * Math.PI) / 180;
		}
		for (let i = 0, len = series.length; i < len; i++) {
			if (
				isInAngleRange(
					angle,
					series[i]._start_,
					series[i]._start_ + series[i]._rose_proportion_ * 2 * Math.PI
				)
			) {
				currentIndex = i;
				break;
			}
		}
	}
	tooltip.index = currentIndex;
	return tooltip;
}
//雷达图
function approximatelyEqual(num1: number, num2: number): boolean {
	return Math.abs(num1 - num2) < 1e-10;
}
function drawRadarLabel(
	angleList: number[],
	radius: number,
	centerPosition: Offset,
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	let radarOption = opts.extra.radar ?? new ChartOptionsExtraRadar();
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	angleList.forEach(function (angle, index) {
		if (radarOption.labelPointShow == true && opts.categories![index] != "") {
			const posPoint = new Offset();
			posPoint.x = radius * Math.cos(angle);
			posPoint.y = radius * Math.sin(angle);
			let posPointAxis = convertCoordinateOrigin(posPoint.x, posPoint.y, centerPosition);
			context.fillStyle = radarOption.labelPointColor;
			context.beginPath();
			context.arc(
				posPointAxis.x + xOffset,
				posPointAxis.y + yOffset,
				radarOption.labelPointRadius * opts.pixelRatio,
				0,
				2 * Math.PI,
				false
			);
			context.closePath();
			context.fill();
		}
		if (radarOption.labelShow == true) {
			const pos = new Offset();
			pos.x = (radius + config.radarLabelTextMargin * opts.pixelRatio) * Math.cos(angle);
			pos.y = (radius + config.radarLabelTextMargin * opts.pixelRatio) * Math.sin(angle);
			let posRelativeCanvas = convertCoordinateOrigin(pos.x, pos.y, centerPosition);
			let startX = posRelativeCanvas.x;
			let startY = posRelativeCanvas.y;
			if (approximatelyEqual(pos.x, 0)) {
				startX -= measureText(opts.categories![index] ?? "", config.fontSize) / 2;
			} else if (pos.x < 0) {
				startX -= measureText(opts.categories![index] ?? "", config.fontSize);
			}
			context.beginPath();
			context.font = `${config.fontSize}px sans-serif`;
			context.fillStyle = radarOption.labelColor ?? opts.fontColor;
			context.fillText(
				opts.categories![index] ?? "",
				startX + xOffset,
				startY + config.fontSize / 2 + yOffset
			);
			context.closePath();
			context.stroke();
		}
	});
}
function getRadarDataPoints(
	angleList: number[],
	center: Offset,
	radius: number,
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	process: number = 1
): ChartOptionsSeries[] {
	let radarOption = opts.extra.radar ?? new ChartOptionsExtraRadar();
	radarOption.max = radarOption.max ?? 0;
	let flierSeries: ChartOptionsSeriesData[] = dataCombine(series);
	let seriesValue: number[] = flierSeries.map(
		(item: ChartOptionsSeriesData): number => item.value!
	);
	let maxData = Math.max(radarOption.max!, Math.max(...seriesValue));
	let data: ChartOptionsSeries[] = [];
	for (let i = 0; i < series.length; i++) {
		let each: ChartOptionsSeries = series[i];
		let listItem = new ChartOptionsSeries();
		listItem.color = each.color;
		listItem.legendShape = each.legendShape;
		listItem.pointShape = each.pointShape;
		listItem.data = [];
		each.data!.forEach((item: ChartOptionsSeriesData, index: number) => {
			let tmp = new ChartOptionsSeriesData();
			let value = item.value!;
			tmp.angle = angleList[index];
			tmp.proportion = value / maxData;
			tmp.value = item.value;
			tmp.position = convertCoordinateOrigin(
				radius * tmp.proportion * process * Math.cos(tmp.angle),
				radius * tmp.proportion * process * Math.sin(tmp.angle),
				center
			);
			listItem.data!.push(tmp);
		});
		data.push(listItem);
	}
	return data;
}
function getMaxTextListLength(
	list: string[],
	fontSize: number,
	context: CanvasRenderingContext2D
): number {
	let lengthList = list.map((item: string): number => {
		return measureText(item, fontSize);
	});
	return Math.max(...lengthList);
}

function getRadarCoordinateSeries(length: number): number[] {
	let eachAngle = (2 * Math.PI) / length;
	let CoordinateSeries: number[] = [];
	for (let i = 0; i < length; i++) {
		CoordinateSeries.push(eachAngle * i);
	}
	return CoordinateSeries.map((item: number): number => {
		return -1 * item + Math.PI / 2;
	});
}
function drawRadarDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartOptionsChartDataToolTiPData {
	let radarOption: ChartOptionsExtraRadar = opts.extra.radar!;
	let coordinateAngle: number[] = getRadarCoordinateSeries(opts.categories!.length);
	let centerPosition = new Offset();
	centerPosition.x = opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2;
	centerPosition.y = opts.area[0] + (opts.height - opts.area[0] - opts.area[2]) / 2;
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	let xr = (opts.width - opts.area[1] - opts.area[3]) / 2;
	let yr = (opts.height - opts.area[0] - opts.area[2]) / 2;
	let radius = Math.min(
		xr -
			(getMaxTextListLength(opts.categories!, config.fontSize, context) +
				config.radarLabelTextMargin),
		yr - config.radarLabelTextMargin
	);
	radius -= config.radarLabelTextMargin * opts.pixelRatio;
	radius = radius < 10 ? 10 : radius;
	radius = radarOption.radius != null ? radarOption.radius! : radius;
	// 画分割线
	context.beginPath();
	context.lineWidth = 1 * opts.pixelRatio;
	context.strokeStyle = radarOption.gridColor;
	coordinateAngle.forEach(function (angle, index) {
		let pos: ChartOptionsChartDataCalPoints = convertCoordinateOrigin(
			radius * Math.cos(angle),
			radius * Math.sin(angle),
			centerPosition
		);
		context.moveTo(xOffset + centerPosition.x, centerPosition.y + yOffset);
		if (index % radarOption.gridEval == 0) {
			context.lineTo(pos.x + xOffset, pos.y + yOffset);
		}
	});
	context.stroke();
	context.closePath();

	// 画背景网格
	function _loop(i: number) {
		let startPos = new ChartOptionsChartDataCalPoints();
		context.beginPath();
		context.lineWidth = 1 * opts.pixelRatio;
		context.strokeStyle = radarOption.gridColor;
		if (radarOption.gridType == "radar") {
			coordinateAngle.forEach(function (angle, index) {
				let pos = convertCoordinateOrigin(
					(radius / radarOption.gridCount) * i * Math.cos(angle),
					(radius / radarOption.gridCount) * i * Math.sin(angle),
					centerPosition
				);
				if (index == 0) {
					startPos = pos;
					context.moveTo(pos.x + xOffset, pos.y + yOffset);
				} else {
					context.lineTo(pos.x + xOffset, pos.y + yOffset);
				}
			});
			context.lineTo(startPos.x + xOffset, startPos.y + yOffset);
		} else {
			let pos = convertCoordinateOrigin(
				(radius / radarOption.gridCount) * i * Math.cos(1.5),
				(radius / radarOption.gridCount) * i * Math.sin(1.5),
				centerPosition
			);
			context.arc(
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				centerPosition.y - pos.y,
				0,
				2 * Math.PI,
				false
			);
		}
		context.stroke();
		context.closePath();
	}
	for (let i = 1; i <= radarOption.gridCount; i++) {
		_loop(i);
	}
	radarOption.customColor = fillCustomColor(
		radarOption.linearType,
		radarOption.customColor,
		series,
		config
	);
	let radarDataPoints: ChartOptionsSeries[] = getRadarDataPoints(
		coordinateAngle,
		centerPosition,
		radius,
		series,
		opts,
		process
	);
	radarDataPoints.forEach((eachSeries: ChartOptionsSeries, seriesIndex: number) => {
		// 绘制区域数据
		context.beginPath();
		context.lineWidth = radarOption.borderWidth * opts.pixelRatio;
		context.strokeStyle = eachSeries.color!;

		let fillcolor: any = hexToRgb(eachSeries.color!, radarOption.opacity);
		if (radarOption.linearType == "custom") {
			// let grd;
			// if (context.createCircularGradient) {
			// 	grd = context.createCircularGradient(centerPosition.x, centerPosition.y, radius)
			// } else {
			// 	grd = context.createRadialGradient(centerPosition.x, centerPosition.y, 0, centerPosition.x, centerPosition.y, radius)
			// }
			let grd = context.createRadialGradient(
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				0,
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				radius
			);
			grd.addColorStop(
				0,
				hexToRgb(
					radarOption.customColor![series[seriesIndex].linearIndex!],
					radarOption.opacity
				)
			);
			grd.addColorStop(1, hexToRgb(eachSeries.color!, radarOption.opacity));
			fillcolor = grd;
		}

		context.fillStyle = fillcolor;

		eachSeries.data!.forEach((item: ChartOptionsSeriesData, index: number) => {
			if (index == 0) {
				context.moveTo(item.position.x + xOffset, item.position.y + yOffset);
			} else {
				context.lineTo(item.position.x + xOffset, item.position.y + yOffset);
			}
		});
		context.closePath();
		context.fill();
		if (radarOption.border == true) {
			context.stroke();
		}
		context.closePath();
		if (opts.dataPointShape != false) {
			let points = eachSeries.data!.map(
				(item: ChartOptionsSeriesData): ChartOptionsChartDataCalPoints => {
					return item.position;
				}
			);
			drawPointShape(points, eachSeries.color!, eachSeries.pointShape, context, opts);
		}
	});
	// 画刻度值
	if (radarOption.axisLabel == true) {
		let flierSeries = dataCombine(series);
		let seriesValue = flierSeries.map((item: ChartOptionsSeriesData): number => item.value!);
		let maxData = Math.max(radarOption.max!, Math.max(...seriesValue));
		const stepLength = radius / radarOption.gridCount;
		const fontSize = opts.fontSize * opts.pixelRatio;
		context.font = `${fontSize}px sans-serif`;
		context.fillStyle = opts.fontColor;
		context.textAlign = "left";

		for (let i = 0; i < radarOption.gridCount + 1; i++) {
			let label = (i * maxData) / radarOption.gridCount;
			label = parseFloat(label.toFixed(radarOption.axisLabelTofix));
			context.fillText(
				`${label}`,
				centerPosition.x + 3 * opts.pixelRatio + xOffset,
				centerPosition.y - i * stepLength + fontSize / 2 + yOffset
			);
		}
	}

	// draw label text
	drawRadarLabel(coordinateAngle, radius, centerPosition, opts, config, context);

	// draw dataLabel
	if (opts.dataLabel && process == 1) {
		radarDataPoints.forEach(function (eachSeries, seriesIndex) {
			context.beginPath();
			let fontSize =
				eachSeries.textSize != null
					? eachSeries.textSize! * opts.pixelRatio
					: config.fontSize;
			context.font = `${fontSize}px sans-serif`;
			context.fillStyle = eachSeries.textColor ?? opts.fontColor;
			eachSeries.data!.forEach((item: ChartOptionsSeriesData, index: number) => {
				//如果是中心点垂直的上下点位
				if (Math.abs(item.position.x - centerPosition.x) < 2) {
					//如果在上面
					if (item.position.y < centerPosition.y) {
						context.textAlign = "center";
						context.fillText(
							`${item.value}`,
							item.position.x + xOffset,
							item.position.y - 4 + yOffset
						);
					} else {
						context.textAlign = "center";
						context.fillText(
							`${item.value}`,
							item.position.x + xOffset,
							item.position.y + fontSize + 2 + yOffset
						);
					}
				} else {
					//如果在左侧
					if (item.position.x < centerPosition.x) {
						context.textAlign = "right";
						context.fillText(
							`${item.value}`,
							item.position.x - 4 + xOffset,
							item.position.y + fontSize / 2 - 2 + yOffset
						);
					} else {
						context.textAlign = "left";
						context.fillText(
							`${item.value}`,
							item.position.x + 4 + xOffset,
							item.position.y + fontSize / 2 - 2 + yOffset
						);
					}
				}
			});
			context.closePath();
			context.stroke();
		});
		context.textAlign = "left";
	}
	const tooltip = new ChartOptionsChartDataToolTiPData();
	tooltip.center = centerPosition;
	tooltip.radius = radius;
	tooltip.angleList = coordinateAngle;
	return tooltip;
}
export function findRadarChartCurrentIndex(
	currentPoints: TouchPosition,
	radarData: ChartOptionsChartDataToolTiPData,
	count: number
): ChartOptionsTooltip {
	let tooltip: ChartOptionsTooltip = new ChartOptionsTooltip();
	let eachAngleArea = (2 * Math.PI) / count;
	let currentIndex = -1;
	if (isInExactPieChartArea(currentPoints, radarData.center, radarData.radius)) {
		function fixAngle(eangle: number): number {
			let angle = eangle;
			if (angle < 0) {
				angle += 2 * Math.PI;
			}
			if (angle > 2 * Math.PI) {
				angle -= 2 * Math.PI;
			}
			return angle;
		}
		let angle = Math.atan2(
			radarData.center.y - currentPoints.y,
			currentPoints.x - radarData.center.x
		);
		angle = -1 * angle;
		if (angle < 0) {
			angle += 2 * Math.PI;
		}
		let angleList = radarData.angleList.map((item): number => {
			item = fixAngle(-1 * item);
			return item;
		});
		angleList.forEach(function (item, index) {
			let rangeStart = fixAngle(item - eachAngleArea / 2);
			let rangeEnd = fixAngle(item + eachAngleArea / 2);
			if (rangeEnd < rangeStart) {
				rangeEnd += 2 * Math.PI;
			}
			if (
				(angle >= rangeStart && angle <= rangeEnd) ||
				(angle + 2 * Math.PI >= rangeStart && angle + 2 * Math.PI <= rangeEnd)
			) {
				currentIndex = index;
			}
		});
	}
	tooltip.index = currentIndex;
	return tooltip;
}
//进度条
function getArcbarDataPoints(
	series: ChartOptionsSeries[],
	arcbarOption: ChartOptionsExtraArcbar,
	eprocess: number = 1
): ChartOptionsSeries[] {
	let process = eprocess;
	if (process == 1) {
		process = 0.999999;
	}
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		// item.data = item.data == null ? 0 : item.data;
		let totalAngle: number;
		if (arcbarOption.type == "circle") {
			totalAngle = 2;
		} else {
			if (arcbarOption.direction == "ccw") {
				if (arcbarOption.startAngle < arcbarOption.endAngle) {
					totalAngle = 2 + arcbarOption.startAngle - arcbarOption.endAngle;
				} else {
					totalAngle = arcbarOption.startAngle - arcbarOption.endAngle;
				}
			} else {
				if (arcbarOption.endAngle < arcbarOption.startAngle) {
					totalAngle = 2 + arcbarOption.endAngle - arcbarOption.startAngle;
				} else {
					totalAngle = arcbarOption.startAngle - arcbarOption.endAngle;
				}
			}
		}
		const val = item.data![0].value!;
		item._proportion_ = totalAngle * val * process + arcbarOption.startAngle;
		if (arcbarOption.direction == "ccw") {
			item._proportion_ = arcbarOption.startAngle - totalAngle * val * process;
		}
		if (item._proportion_ >= 2) {
			item._proportion_ = item._proportion_ % 2;
		}
	}
	return series;
}
//漏斗图
export function findFunnelChartCurrentIndex(
	currentPoints: TouchPosition,
	funnelData: ChartOptionsChartDataToolTiPData
): ChartOptionsTooltip {
	let tooltip: ChartOptionsTooltip = new ChartOptionsTooltip();
	let currentIndex = -1;
	for (let i = 0, len = funnelData.series.length; i < len; i++) {
		let item = funnelData.series[i];
		if (
			currentPoints.x > item.funnelArea[0] &&
			currentPoints.x < item.funnelArea[2] &&
			currentPoints.y > item.funnelArea[1] &&
			currentPoints.y < item.funnelArea[3]
		) {
			currentIndex = i;
			break;
		}
	}
	tooltip.index = currentIndex;
	return tooltip;
}
function getFunnelDataPoints(
	series: ChartOptionsSeries[],
	radius: number,
	option: ChartOptionsExtraFunnel,
	eachSpacing: number,
	process: number = 1
): ChartOptionsSeries[] {
	for (let i = 0; i < series.length; i++) {
		const val = series[i].data![0].value!;
		if (option.type == "funnel") {
			series[i].radius = (val / series[0].data![0].value!) * radius * process;
		} else {
			series[i].radius =
				((eachSpacing * (series.length - i)) / (eachSpacing * series.length)) *
				radius *
				process;
		}
		series[i]._proportion_ = val / series[0].data![0].value!;
	}
	// if(option.type != 'pyramid'){
	//   series.reverse();
	// }
	return series;
}
function drawFunnelText(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	context: CanvasRenderingContext2D,
	eachSpacing: number,
	labelAlign: string,
	activeWidth: number,
	centerPosition: Offset
) {
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		if (item.labelShow == false) {
			continue;
		}
		let startX = 0;
		let endX = 0;
		let startY = 0;
		let fontSize = 0;
		// let text = item.formatter ? item.formatter(item, i, series, opts) : (item._proportion_ * 100).toFixed(0) + '%';
		let text: string = "";
		if (item.formatter != null) {
			const fun = item.formatter as (
				item: ChartOptionsSeries,
				i: number,
				series: ChartOptionsSeries[],
				opts: ChartOptions
			) => string;
			text = fun(item, i, series, opts);
		} else {
			text = (item._proportion_ * 100).toFixed(0) + "%";
		}
		text = item.labelText ?? text;
		if (labelAlign == "right") {
			if (i == series.length - 1) {
				startX = (item.funnelArea[2] + centerPosition.x) / 2;
			} else {
				startX = (item.funnelArea[2] + series[i + 1].funnelArea[2]) / 2;
			}
			endX = startX + activeWidth * 2;
			startY = item.funnelArea[1] + eachSpacing / 2;
			fontSize = (item.textSize ?? opts.fontSize) * opts.pixelRatio;
			context.lineWidth = 1 * opts.pixelRatio;
			context.strokeStyle = item.color!;
			context.fillStyle = item.color!;
			context.beginPath();
			context.moveTo(startX, startY);
			context.lineTo(endX, startY);
			context.stroke();
			context.closePath();
			context.beginPath();
			context.moveTo(endX, startY);
			context.arc(endX, startY, 2 * opts.pixelRatio, 0, 2 * Math.PI);
			context.closePath();
			context.fill();
			context.beginPath();
			context.font = `${fontSize}px sans-serif`;
			context.fillStyle = item.textColor ?? opts.fontColor;
			context.fillText(text, endX + 5, startY + fontSize / 2 - 2);
			context.closePath();
			context.stroke();
			context.closePath();
		}
		if (labelAlign == "left") {
			if (i == series.length - 1) {
				startX = (item.funnelArea[0] + centerPosition.x) / 2;
			} else {
				startX = (item.funnelArea[0] + series[i + 1].funnelArea[0]) / 2;
			}
			endX = startX - activeWidth * 2;
			startY = item.funnelArea[1] + eachSpacing / 2;
			fontSize = (item.textSize ?? opts.fontSize) * opts.pixelRatio;
			context.lineWidth = 1 * opts.pixelRatio;
			context.strokeStyle = item.color!;
			context.fillStyle = item.color!;
			context.beginPath();
			context.moveTo(startX, startY);
			context.lineTo(endX, startY);
			context.stroke();
			context.closePath();
			context.beginPath();
			context.moveTo(endX, startY);
			context.arc(endX, startY, 2, 0, 2 * Math.PI);
			context.closePath();
			context.fill();
			context.beginPath();
			context.font = `${fontSize}px sans-serif`;
			context.fillStyle = item.textColor ?? opts.fontColor;
			context.fillText(
				text,
				endX - 5 - measureText(text, fontSize),
				startY + fontSize / 2 - 2
			);
			context.closePath();
			context.stroke();
			context.closePath();
		}
	}
}
function drawFunnelCenterText(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	context: CanvasRenderingContext2D,
	eachSpacing: number,
	labelAlign: string,
	activeWidth: number,
	centerPosition: Offset
) {
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		let startY = 0;
		let fontSize = 0;
		const text = item.data![0].centerText!;
		if (text != null) {
			startY = item.funnelArea[1] + eachSpacing / 2;
			fontSize =
				item.data![0].centerTextSize != null
					? item.data![0].centerTextSize! * opts.pixelRatio
					: opts.fontSize * opts.pixelRatio;
			context.beginPath();
			context.font = `${fontSize}px sans-serif`;
			context.fillStyle = item.centerTextColor;
			context.fillText(
				text,
				centerPosition.x - measureText(text, fontSize) / 2,
				startY + fontSize / 2 - 2
			);
			context.closePath();
			context.stroke();
			context.closePath();
		}
	}
}
function drawFunnelDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartOptionsChartDataToolTiPData {
	let funnelOption: ChartOptionsExtraFunnel = opts.extra.funnel!;
	let eachSpacing: number = (opts.height - opts.area[0] - opts.area[2]) / series.length;
	let centerPosition: Offset = new Offset();
	centerPosition.x = opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2;
	centerPosition.y = opts.height - opts.area[2];
	let activeWidth = funnelOption.activeWidth * opts.pixelRatio;
	let radius = Math.min(
		(opts.width - opts.area[1] - opts.area[3]) / 2 - activeWidth,
		(opts.height - opts.area[0] - opts.area[2]) / 2 - activeWidth
	);
	let seriesNew: ChartOptionsSeries[] = getFunnelDataPoints(
		series,
		radius,
		funnelOption,
		eachSpacing,
		process
	);
	context.save();

	// 添加偏移量到平移中心
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	context.translate(centerPosition.x + xOffset, centerPosition.y + yOffset);

	funnelOption.customColor = fillCustomColor(
		funnelOption.linearType,
		funnelOption.customColor,
		series,
		config
	);

	if (funnelOption.type == "pyramid") {
		for (let i = 0; i < seriesNew.length; i++) {
			if (i == seriesNew.length - 1) {
				if (opts.tooltip != null) {
					if ((opts.tooltip!.index as number) == i) {
						context.beginPath();
						context.fillStyle = hexToRgb(
							seriesNew[i].color!,
							funnelOption.activeOpacity
						);
						context.moveTo(-activeWidth, -eachSpacing);
						context.lineTo(-seriesNew[i].radius - activeWidth, 0);
						context.lineTo(seriesNew[i].radius + activeWidth, 0);
						context.lineTo(activeWidth, -eachSpacing);
						context.lineTo(-activeWidth, -eachSpacing);
						context.closePath();
						context.fill();
					}
				}
				// 添加偏移量到区域计算
				seriesNew[i].funnelArea = [
					centerPosition.x + xOffset - seriesNew[i].radius,
					centerPosition.y + yOffset - eachSpacing * (i + 1),
					centerPosition.x + xOffset + seriesNew[i].radius,
					centerPosition.y + yOffset - eachSpacing * i
				];

				context.beginPath();
				context.lineWidth = funnelOption.borderWidth * opts.pixelRatio;
				context.strokeStyle = funnelOption.borderColor;
				let fillColor: any = hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity);
				if (funnelOption.linearType == "custom") {
					let grd = context.createLinearGradient(
						seriesNew[i].radius,
						-eachSpacing,
						-seriesNew[i].radius,
						-eachSpacing
					);
					grd.addColorStop(0, hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity));
					grd.addColorStop(
						0.5,
						hexToRgb(
							funnelOption.customColor![seriesNew[i].linearIndex!],
							funnelOption.fillOpacity
						)
					);
					grd.addColorStop(1, hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity));
					fillColor = grd;
				}
				context.fillStyle = fillColor;
				context.moveTo(0, -eachSpacing);
				context.lineTo(-seriesNew[i].radius, 0);
				context.lineTo(seriesNew[i].radius, 0);
				context.lineTo(0, -eachSpacing);
				context.closePath();
				context.fill();
				if (funnelOption.border == true) {
					context.stroke();
				}
			} else {
				if (opts.tooltip != null) {
					if ((opts.tooltip!.index as number) == i) {
						context.beginPath();
						context.fillStyle = hexToRgb(
							seriesNew[i].color!,
							funnelOption.activeOpacity
						);
						context.moveTo(0, 0);
						context.lineTo(-seriesNew[i].radius - activeWidth, 0);
						context.lineTo(-seriesNew[i + 1].radius - activeWidth, -eachSpacing);
						context.lineTo(seriesNew[i + 1].radius + activeWidth, -eachSpacing);
						context.lineTo(seriesNew[i].radius + activeWidth, 0);
						context.lineTo(0, 0);
						context.closePath();
						context.fill();
					}
				}
				// 添加偏移量到区域计算
				seriesNew[i].funnelArea = [
					centerPosition.x + xOffset - seriesNew[i].radius,
					centerPosition.y + yOffset - eachSpacing * (i + 1),
					centerPosition.x + xOffset + seriesNew[i].radius,
					centerPosition.y + yOffset - eachSpacing * i
				];

				context.beginPath();
				context.lineWidth = funnelOption.borderWidth * opts.pixelRatio;
				context.strokeStyle = funnelOption.borderColor;
				let fillColor: any = hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity);
				if (funnelOption.linearType == "custom") {
					let grd = context.createLinearGradient(
						seriesNew[i].radius,
						-eachSpacing,
						-seriesNew[i].radius,
						-eachSpacing
					);
					grd.addColorStop(0, hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity));
					grd.addColorStop(
						0.5,
						hexToRgb(
							funnelOption.customColor![seriesNew[i].linearIndex!],
							funnelOption.fillOpacity
						)
					);
					grd.addColorStop(1, hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity));
					fillColor = grd;
				}
				context.fillStyle = fillColor;
				context.moveTo(0, 0);
				context.lineTo(-seriesNew[i].radius, 0);
				context.lineTo(-seriesNew[i + 1].radius, -eachSpacing);
				context.lineTo(seriesNew[i + 1].radius, -eachSpacing);
				context.lineTo(seriesNew[i].radius, 0);
				context.lineTo(0, 0);
				context.closePath();
				context.fill();
				if (funnelOption.border == true) {
					context.stroke();
				}
			}
			context.translate(0, -eachSpacing);
		}
	} else {
		context.translate(0, -(seriesNew.length - 1) * eachSpacing);
		for (let i = 0; i < seriesNew.length; i++) {
			if (i == seriesNew.length - 1) {
				if (opts.tooltip != null) {
					if ((opts.tooltip!.index as number) == i) {
						context.beginPath();
						context.fillStyle = hexToRgb(
							seriesNew[i].color!,
							funnelOption.activeOpacity
						);
						context.moveTo(-activeWidth - funnelOption.minSize / 2, 0);
						context.lineTo(-seriesNew[i].radius - activeWidth, -eachSpacing);
						context.lineTo(seriesNew[i].radius + activeWidth, -eachSpacing);
						context.lineTo(activeWidth + funnelOption.minSize / 2, 0);
						context.lineTo(-activeWidth - funnelOption.minSize / 2, 0);
						context.closePath();
						context.fill();
					}
				}
				// 添加偏移量到区域计算
				seriesNew[i].funnelArea = [
					centerPosition.x + xOffset - seriesNew[i].radius,
					centerPosition.y + yOffset - eachSpacing,
					centerPosition.x + xOffset + seriesNew[i].radius,
					centerPosition.y + yOffset
				];

				context.beginPath();
				context.lineWidth = funnelOption.borderWidth * opts.pixelRatio;
				context.strokeStyle = funnelOption.borderColor;
				let fillColor: any = hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity);
				if (funnelOption.linearType == "custom") {
					let grd = context.createLinearGradient(
						seriesNew[i].radius,
						-eachSpacing,
						-seriesNew[i].radius,
						-eachSpacing
					);
					grd.addColorStop(0, hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity));
					grd.addColorStop(
						0.5,
						hexToRgb(
							funnelOption.customColor![seriesNew[i].linearIndex!],
							funnelOption.fillOpacity
						)
					);
					grd.addColorStop(1, hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity));
					fillColor = grd;
				}
				context.fillStyle = fillColor;
				context.moveTo(0, 0);
				context.lineTo(-funnelOption.minSize / 2, 0);
				context.lineTo(-seriesNew[i].radius, -eachSpacing);
				context.lineTo(seriesNew[i].radius, -eachSpacing);
				context.lineTo(funnelOption.minSize / 2, 0);
				context.lineTo(0, 0);
				context.closePath();
				context.fill();
				if (funnelOption.border == true) {
					context.stroke();
				}
			} else {
				if (opts.tooltip != null) {
					if ((opts.tooltip!.index as number) == i) {
						context.beginPath();
						context.fillStyle = hexToRgb(
							seriesNew[i].color!,
							funnelOption.activeOpacity
						);
						context.moveTo(0, 0);
						context.lineTo(-seriesNew[i + 1].radius - activeWidth, 0);
						context.lineTo(-seriesNew[i].radius - activeWidth, -eachSpacing);
						context.lineTo(seriesNew[i].radius + activeWidth, -eachSpacing);
						context.lineTo(seriesNew[i + 1].radius + activeWidth, 0);
						context.lineTo(0, 0);
						context.closePath();
						context.fill();
					}
				}
				// 添加偏移量到区域计算
				seriesNew[i].funnelArea = [
					centerPosition.x + xOffset - seriesNew[i].radius,
					centerPosition.y + yOffset - eachSpacing * (seriesNew.length - i),
					centerPosition.x + xOffset + seriesNew[i].radius,
					centerPosition.y + yOffset - eachSpacing * (seriesNew.length - i - 1)
				];

				context.beginPath();
				context.lineWidth = funnelOption.borderWidth * opts.pixelRatio;
				context.strokeStyle = funnelOption.borderColor;
				let fillColor: any = hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity);
				if (funnelOption.linearType == "custom") {
					let grd = context.createLinearGradient(
						seriesNew[i].radius,
						-eachSpacing,
						-seriesNew[i].radius,
						-eachSpacing
					);
					grd.addColorStop(0, hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity));
					grd.addColorStop(
						0.5,
						hexToRgb(
							funnelOption.customColor![seriesNew[i].linearIndex!],
							funnelOption.fillOpacity
						)
					);
					grd.addColorStop(1, hexToRgb(seriesNew[i].color!, funnelOption.fillOpacity));
					fillColor = grd;
				}
				context.fillStyle = fillColor;
				context.moveTo(0, 0);
				context.lineTo(-seriesNew[i + 1].radius, 0);
				context.lineTo(-seriesNew[i].radius, -eachSpacing);
				context.lineTo(seriesNew[i].radius, -eachSpacing);
				context.lineTo(seriesNew[i + 1].radius, 0);
				context.lineTo(0, 0);
				context.closePath();
				context.fill();
				if (funnelOption.border == true) {
					context.stroke();
				}
			}
			context.translate(0, eachSpacing);
		}
	}

	context.restore();

	// 创建偏移后的中心点用于文本绘制
	const offsetCenter = new Offset();
	offsetCenter.x = centerPosition.x + xOffset;
	offsetCenter.y = centerPosition.y + yOffset;

	if (opts.dataLabel != false && process == 1) {
		drawFunnelText(
			seriesNew,
			opts,
			context,
			eachSpacing,
			funnelOption.labelAlign,
			activeWidth,
			offsetCenter
		);
	}
	if (process == 1) {
		drawFunnelCenterText(
			seriesNew,
			opts,
			context,
			eachSpacing,
			funnelOption.labelAlign,
			activeWidth,
			offsetCenter
		);
	}

	const tooltip = new ChartOptionsChartDataToolTiPData();
	tooltip.center = centerPosition;
	tooltip.radius = radius;
	tooltip.series = seriesNew;
	return tooltip;
}

function drawArcbarDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartOptionsChartDataToolTiPData {
	let arcbarOption = opts.extra.arcbar!;
	series = getArcbarDataPoints(series, arcbarOption, process);
	let centerPosition: Offset = new Offset();
	if (arcbarOption.centerX != null || arcbarOption.centerY != null) {
		centerPosition.x = (arcbarOption.centerX ?? opts.width) / 2;
		centerPosition.y = (arcbarOption.centerY ?? opts.height) / 2;
	} else {
		centerPosition.x = opts.width / 2;
		centerPosition.y = opts.height / 2;
	}
	let radius: number = 0;
	if (arcbarOption.radius != null) {
		radius = arcbarOption.radius!;
	} else {
		radius = Math.min(centerPosition.x, centerPosition.y);
		radius -= 5 * opts.pixelRatio;
		radius -= arcbarOption.width / 2;
	}
	radius = radius < 10 ? 10 : radius;
	arcbarOption.customColor = fillCustomColor(
		arcbarOption.linearType,
		arcbarOption.customColor,
		series,
		config
	);

	// 应用Y坐标偏移量
	let adjustedY = centerPosition.y + opts.yOffset;
	let adjustedX = centerPosition.x + opts.xOffset;
	for (let i = 0; i < series.length; i++) {
		let eachSeries = series[i];
		// 背景颜色
		context.lineWidth = arcbarOption.width * opts.pixelRatio;
		context.strokeStyle = arcbarOption.backgroundColor;
		context.lineCap = arcbarOption.lineCap;
		context.beginPath();
		if (arcbarOption.type == "default") {
			context.arc(
				adjustedX,
				adjustedY,
				radius -
					(arcbarOption.width * opts.pixelRatio + arcbarOption.gap * opts.pixelRatio) * i,
				arcbarOption.startAngle * Math.PI,
				arcbarOption.endAngle * Math.PI,
				arcbarOption.direction == "ccw"
			);
		} else {
			context.arc(
				adjustedX,
				adjustedY,
				radius -
					(arcbarOption.width * opts.pixelRatio + arcbarOption.gap * opts.pixelRatio) * i,
				0,
				2 * Math.PI,
				arcbarOption.direction == "ccw"
			);
		}
		context.stroke();
		// 进度条
		let fillColor: any = eachSeries.color!;
		if (arcbarOption.linearType == "custom") {
			let grd = context.createLinearGradient(
				adjustedX - radius,
				adjustedY,
				adjustedX + radius,
				adjustedY
			);
			grd.addColorStop(0, hexToRgb(eachSeries.color!, 1));
			grd.addColorStop(1, hexToRgb(arcbarOption.customColor![eachSeries.linearIndex!], 1));
			fillColor = grd;
		}
		context.lineWidth = arcbarOption.width * opts.pixelRatio;
		context.strokeStyle = fillColor;
		context.lineCap = arcbarOption.lineCap;
		context.beginPath();
		context.arc(
			adjustedX,
			adjustedY,
			radius -
				(arcbarOption.width * opts.pixelRatio + arcbarOption.gap * opts.pixelRatio) * i,
			arcbarOption.startAngle * Math.PI,
			eachSeries._proportion_ * Math.PI,
			arcbarOption.direction == "ccw"
		);
		context.stroke();
	}
	drawRingTitle(opts, config, context, centerPosition);
	const tooltip = new ChartOptionsChartDataToolTiPData();
	tooltip.center = centerPosition;
	tooltip.radius = radius;
	tooltip.series = series;
	return tooltip;
}

//词图云
function collisionNew(
	area: number[],
	points: ChartOptionsSeries[],
	width: number,
	height: number
): boolean {
	let isIn = false;
	for (let i = 0; i < points.length; i++) {
		if (points[i].area != null) {
			if (
				area[3] < points[i].area![1] ||
				area[0] > points[i].area![2] ||
				area[1] > points[i].area![3] ||
				area[2] < points[i].area![0]
			) {
				if (area[0] < 0 || area[1] < 0 || area[2] > width || area[3] > height) {
					isIn = true;
					break;
				} else {
					isIn = false;
				}
			} else {
				isIn = true;
				break;
			}
		}
	}
	return isIn;
}
function normalInt(min: number, max: number, itere: number): number {
	let iter = itere == 0 ? 1 : itere;
	let arr: number[] = [];
	for (let i = 0; i < iter; i++) {
		arr.push(Math.random());
	}
	let sum = arr.reduce((i: number, j: number): number => i + j, 0);
	return Math.floor((sum / iter) * (max - min)) + min;
}
function getWordCloudPoint(
	opts: ChartOptions,
	type: string,
	context: CanvasRenderingContext2D
): ChartOptionsSeries[] {
	let points = opts.series!;
	switch (type) {
		case "normal":
			for (let i = 0; i < points.length; i++) {
				let text = points[i].name!;
				let tHeight = points[i].textSize! * opts.pixelRatio;
				let tWidth = measureText(text, tHeight);
				let x: number = 0;
				let y: number = 0;
				let area: number[] = [];
				let breaknum = 0;
				while (true) {
					breaknum++;
					x = normalInt(-opts.width / 2, opts.width / 2, 5) - tWidth / 2;
					y = normalInt(-opts.height / 2, opts.height / 2, 5) + tHeight / 2;
					area = [
						x - 5 + opts.width / 2,
						y - 5 - tHeight + opts.height / 2,
						x + tWidth + 5 + opts.width / 2,
						y + 5 + opts.height / 2
					];
					let isCollision = collisionNew(area, points, opts.width, opts.height);
					if (!isCollision) break;
					if (breaknum == 1000) {
						area = [-100, -100, -100, -100];
						break;
					}
				}
				points[i].area = area;
			}
			break;
		case "vertical":
			function Spin(): boolean {
				//获取均匀随机值，是否旋转，旋转的概率为（1-0.5）
				if (Math.random() > 0.7) {
					return true;
				} else {
					return false;
				}
			}
			for (let i = 0; i < points.length; i++) {
				let text = points[i].name!;
				let tHeight = points[i].textSize! * opts.pixelRatio;
				let tWidth = measureText(text, tHeight);
				let isSpin = Spin();
				let x = 0;
				let y = 0;
				let area: number[] = [];
				let areav: number[] = [];
				let breaknum = 0;
				while (true) {
					breaknum++;
					let isCollision: boolean;
					if (isSpin) {
						x = normalInt(-opts.width / 2, opts.width / 2, 5) - tWidth / 2;
						y = normalInt(-opts.height / 2, opts.height / 2, 5) + tHeight / 2;
						area = [
							y - 5 - tWidth + opts.width / 2,
							-x - 5 + opts.height / 2,
							y + 5 + opts.width / 2,
							-x + tHeight + 5 + opts.height / 2
						];
						areav = [
							opts.width -
								(opts.width / 2 - opts.height / 2) -
								(-x + tHeight + 5 + opts.height / 2) -
								5,
							opts.height / 2 -
								opts.width / 2 +
								(y - 5 - tWidth + opts.width / 2) -
								5,
							opts.width -
								(opts.width / 2 - opts.height / 2) -
								(-x + tHeight + 5 + opts.height / 2) +
								tHeight,
							opts.height / 2 -
								opts.width / 2 +
								(y - 5 - tWidth + opts.width / 2) +
								tWidth +
								5
						];
						isCollision = collisionNew(areav, points, opts.height, opts.width);
					} else {
						x = normalInt(-opts.width / 2, opts.width / 2, 5) - tWidth / 2;
						y = normalInt(-opts.height / 2, opts.height / 2, 5) + tHeight / 2;
						area = [
							x - 5 + opts.width / 2,
							y - 5 - tHeight + opts.height / 2,
							x + tWidth + 5 + opts.width / 2,
							y + 5 + opts.height / 2
						];
						isCollision = collisionNew(area, points, opts.width, opts.height);
					}
					if (!isCollision) break;
					if (breaknum == 1000) {
						area = [-1000, -1000, -1000, -1000];
						break;
					}
				}
				if (isSpin) {
					points[i].area = areav;
					points[i].areav = area;
				} else {
					points[i].area = area;
				}
				points[i].rotate = isSpin;
			}
			break;
	}
	return points;
}

function drawWordCloudDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
) {
	let wordOption = opts.extra.word!;
	if (opts.chartData.wordCloudData == null) {
		opts.chartData.wordCloudData = getWordCloudPoint(opts, wordOption.type, context);
	}
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	context.beginPath();
	context.fillStyle = opts.background;
	// 添加偏移到背景绘制
	context.rect(xOffset, yOffset, opts.width, opts.height);
	context.fill();
	context.save();
	let points = opts.chartData.wordCloudData!;
	// 添加偏移到坐标系平移
	context.translate(xOffset + opts.width / 2, yOffset + opts.height / 2);
	for (let i = 0; i < points.length; i++) {
		context.save();
		if (points[i].rotate) {
			context.rotate((90 * Math.PI) / 180);
		}
		let text = points[i].name!;
		let tHeight = points[i].textSize! * opts.pixelRatio;
		let tWidth = measureText(text, tHeight);
		context.beginPath();
		context.strokeStyle = points[i].color!;
		context.fillStyle = points[i].color!;
		context.font = `${tHeight}px sans-serif`;
		if (points[i].rotate) {
			if (points[i].areav[0] > 0) {
				if (opts.tooltip != null) {
					if ((opts.tooltip!.index as number) == i) {
						// 添加偏移到文字位置
						context.strokeText(
							text,
							(points[i].areav[0] + 5 - opts.width / 2) * process -
								(tWidth * (1 - process)) / 2,
							(points[i].areav[1] + 5 + tHeight - opts.height / 2) * process
						);
					} else {
						// 添加偏移到文字位置
						context.fillText(
							text,
							(points[i].areav[0] + 5 - opts.width / 2) * process -
								(tWidth * (1 - process)) / 2,
							(points[i].areav[1] + 5 + tHeight - opts.height / 2) * process
						);
					}
				} else {
					// 添加偏移到文字位置
					context.fillText(
						text,
						(points[i].areav[0] + 5 - opts.width / 2) * process -
							(tWidth * (1 - process)) / 2,
						(points[i].areav[1] + 5 + tHeight - opts.height / 2) * process
					);
				}
			}
		} else {
			if (points[i].area![0] > 0) {
				if (opts.tooltip != null) {
					if ((opts.tooltip!.index as number) == i) {
						// 添加偏移到文字位置
						context.strokeText(
							text,
							(points[i].area![0] + 5 - opts.width / 2) * process -
								(tWidth * (1 - process)) / 2,
							(points[i].area![1] + 5 + tHeight - opts.height / 2) * process
						);
					} else {
						// 添加偏移到文字位置
						context.fillText(
							text,
							(points[i].area![0] + 5 - opts.width / 2) * process -
								(tWidth * (1 - process)) / 2,
							(points[i].area![1] + 5 + tHeight - opts.height / 2) * process
						);
					}
				} else {
					// 添加偏移到文字位置
					context.fillText(
						text,
						(points[i].area![0] + 5 - opts.width / 2) * process -
							(tWidth * (1 - process)) / 2,
						(points[i].area![1] + 5 + tHeight - opts.height / 2) * process
					);
				}
			}
		}
		context.stroke();
		context.restore();
	}
	context.restore();
}
export function findWordChartCurrentIndex(
	currentPoints: TouchPosition,
	wordData: ChartOptionsSeries[]
): ChartOptionsTooltip {
	const tooltip = new ChartOptionsTooltip();
	let currentIndex = -1;
	for (let i = 0, len = wordData.length; i < len; i++) {
		let item = wordData[i];
		if (
			currentPoints.x > item.area![0] &&
			currentPoints.x < item.area![2] &&
			currentPoints.y > item.area![1] &&
			currentPoints.y < item.area![3]
		) {
			currentIndex = i;
			break;
		}
	}
	tooltip.index = currentIndex;
	return tooltip;
}
//仪表盘
function drawGaugeLabel(
	gaugeOption: ChartOptionsExtraGauge,
	eradius: number,
	centerPosition: Offset,
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	let radius = eradius;
	radius -= gaugeOption.width / 2 + gaugeOption.labelOffset * opts.pixelRatio;
	radius = radius < 10 ? 10 : radius;
	let totalAngle = 0;
	if (gaugeOption.endAngle < gaugeOption.startAngle) {
		totalAngle = 2 + gaugeOption.endAngle - gaugeOption.startAngle;
	} else {
		totalAngle = gaugeOption.startAngle - gaugeOption.endAngle;
	}
	let splitAngle = totalAngle / gaugeOption.splitLine!.splitNumber;
	let totalNumber = gaugeOption.endNumber - gaugeOption.startNumber!;
	let splitNumber = totalNumber / gaugeOption.splitLine!.splitNumber;
	let nowAngle = gaugeOption.startAngle;
	let nowNumber = gaugeOption.startNumber!;
	for (let i = 0; i < gaugeOption.splitLine!.splitNumber + 1; i++) {
		const pos = new Offset();
		pos.x = radius * Math.cos(nowAngle * Math.PI);
		pos.y = radius * Math.sin(nowAngle * Math.PI);
		let labelText: string = "";
		if (gaugeOption.formatter != null) {
			const fun = gaugeOption.formatter as (
				nowNumber: number,
				i: number,
				opts: ChartOptions
			) => string;
			labelText = fun(nowNumber, i, opts);
		} else {
			labelText = `${nowNumber}`;
		}
		pos.x += centerPosition.x - measureText(labelText, config.fontSize) / 2;
		pos.y += centerPosition.y;
		let startX = pos.x;
		let startY = pos.y;
		context.beginPath();
		context.font = `${config.fontSize}px sans-serif`;
		context.fillStyle = gaugeOption.labelColor ?? opts.fontColor;
		context.fillText(
			labelText,
			startX + opts.xOffset,
			startY + config.fontSize / 2 + opts.yOffset
		);
		context.closePath();
		context.stroke();
		nowAngle += splitAngle;
		if (nowAngle >= 2) {
			nowAngle = nowAngle % 2;
		}
		nowNumber += splitNumber;
	}
}
function getGaugeDataPoints(
	series: ChartOptionsSeries[],
	categories: ChartOptionsSeriesData[],
	gaugeOption: ChartOptionsExtraGauge,
	process: number = 1
): ChartOptionsSeries[] {
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		let val = item.data![0].value ?? 0;
		if (gaugeOption.pointer!.color == "auto") {
			for (let i = 0; i < categories.length; i++) {
				if (val <= categories[i].value!) {
					item.color = categories[i].color;
					break;
				}
			}
		} else {
			item.color = gaugeOption.pointer!.color;
		}
		let totalAngle: number = 0;
		if (gaugeOption.endAngle < gaugeOption.startAngle) {
			totalAngle = 2 + gaugeOption.endAngle - gaugeOption.startAngle;
		} else {
			totalAngle = gaugeOption.startAngle - gaugeOption.endAngle;
		}
		item._endAngle_ = totalAngle * val + gaugeOption.startAngle;
		item._oldAngle_ = gaugeOption.oldAngle!;
		if (gaugeOption.oldAngle! < gaugeOption.endAngle) {
			item._oldAngle_ += 2;
		}
		if (val >= gaugeOption.oldData!) {
			item._proportion_ =
				(item._endAngle_ - item._oldAngle_) * process + gaugeOption.oldAngle!;
		} else {
			item._proportion_ = item._oldAngle_ - (item._oldAngle_ - item._endAngle_) * process;
		}
		if (item._proportion_ >= 2) {
			item._proportion_ = item._proportion_ % 2;
		}
	}
	return series;
}
function getGaugeArcbarDataPoints(
	series: ChartOptionsSeries[],
	arcbarOption: ChartOptionsExtraGauge,
	eprocess: number = 1
): ChartOptionsSeries[] {
	let process = eprocess;
	if (process == 1) {
		process = 0.999999;
	}
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		// item.data = item.data == null ? 0 : item.data;
		let totalAngle: number = 0;
		if (arcbarOption.type == "circle") {
			totalAngle = 2;
		} else {
			if (arcbarOption.endAngle < arcbarOption.startAngle) {
				totalAngle = 2 + arcbarOption.endAngle - arcbarOption.startAngle;
			} else {
				totalAngle = arcbarOption.startAngle - arcbarOption.endAngle;
			}
		}
		item._proportion_ = totalAngle * item.data![0].value! * process + arcbarOption.startAngle;
		if (item._proportion_ >= 2) {
			item._proportion_ = item._proportion_ % 2;
		}
	}
	return series;
}
function getGaugeAxisPoints(
	categories: ChartOptionsSeriesData[],
	startAngle: number,
	endAngle: number
): ChartOptionsSeriesData[] {
	let totalAngle: number = 0;
	if (endAngle < startAngle) {
		totalAngle = 2 + endAngle - startAngle;
	} else {
		totalAngle = startAngle - endAngle;
	}
	let tempStartAngle = startAngle;
	for (let i = 0; i < categories.length; i++) {
		categories[i].value = categories[i].value == null ? 0 : categories[i].value;
		categories[i]._startAngle_ = tempStartAngle;
		categories[i]._endAngle_ = totalAngle * categories[i].value! + startAngle;
		if (categories[i]._endAngle_ >= 2) {
			categories[i]._endAngle_ = categories[i]._endAngle_ % 2;
		}
		tempStartAngle = categories[i]._endAngle_;
	}
	return categories;
}
function drawGaugeDataPoints(
	categories: ChartOptionsSeriesData[],
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartOptionsChartDataToolTiPData {
	let gaugeOption: ChartOptionsExtraGauge = opts.extra.gauge!;
	if (gaugeOption.oldAngle == null) {
		gaugeOption.oldAngle = gaugeOption.startAngle;
	}
	if (gaugeOption.oldData == null) {
		gaugeOption.oldData = 0;
	}
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	categories = getGaugeAxisPoints(categories, gaugeOption.startAngle, gaugeOption.endAngle);
	let centerPosition = new Offset();
	centerPosition.x = opts.width / 2;
	centerPosition.y = opts.height / 2;
	let radius = Math.min(centerPosition.x, centerPosition.y);
	radius -= 5 * opts.pixelRatio;
	radius -= gaugeOption.width / 2;
	radius = radius < 10 ? 10 : radius;
	let innerRadius = radius - gaugeOption.width;
	let totalAngle = 0;

	// 判断仪表盘的样式：default百度样式，progress新样式
	if (gaugeOption.type == "progress") {
		//## 第一步画中心圆形背景和进度条背景
		// 中心圆形背景
		let pieRadius = radius - gaugeOption.width * 3;
		context.beginPath();
		let gradient = context.createLinearGradient(
			centerPosition.x + xOffset,
			yOffset + centerPosition.y - pieRadius,
			centerPosition.x + xOffset,
			yOffset + centerPosition.y + pieRadius
		);
		gradient.addColorStop(0, hexToRgb(series[0].color!, 0.3));
		gradient.addColorStop(1, hexToRgb("#FFFFFF", 0.1));
		context.fillStyle = gradient;
		context.arc(
			centerPosition.x + xOffset,
			centerPosition.y + yOffset,
			pieRadius,
			0,
			2 * Math.PI,
			false
		);
		context.fill();

		// 画进度条背景
		context.lineWidth = gaugeOption.width;
		context.strokeStyle = hexToRgb(series[0].color!, 0.3);
		context.lineCap = "round";
		context.beginPath();
		context.arc(
			centerPosition.x + xOffset,
			centerPosition.y + yOffset,
			innerRadius,
			gaugeOption.startAngle * Math.PI,
			gaugeOption.endAngle * Math.PI,
			false
		);
		context.stroke();

		//## 第二步画刻度线
		if (gaugeOption.endAngle < gaugeOption.startAngle) {
			totalAngle = 2 + gaugeOption.endAngle - gaugeOption.startAngle;
		} else {
			totalAngle = gaugeOption.startAngle - gaugeOption.endAngle;
		}
		let splitAngle = totalAngle / gaugeOption.splitLine!.splitNumber;
		let childAngle =
			totalAngle / gaugeOption.splitLine!.splitNumber / gaugeOption.splitLine!.childNumber;
		const fixRadius = gaugeOption.splitLine!.fixRadius!;
		let startX = -radius - gaugeOption.width * 0.5 - fixRadius;
		let endX = -radius - gaugeOption.width - fixRadius + gaugeOption.splitLine!.width;

		context.save();
		context.translate(centerPosition.x + xOffset, centerPosition.y + yOffset);
		context.rotate((gaugeOption.startAngle - 1) * Math.PI);
		let len = gaugeOption.splitLine!.splitNumber * gaugeOption.splitLine!.childNumber + 1;
		let proc = series[0].data![0].value! * process;
		for (let i = 0; i < len; i++) {
			context.beginPath();
			if (proc > i / len) {
				context.strokeStyle = hexToRgb(series[0].color!, 1);
			} else {
				context.strokeStyle = hexToRgb(series[0].color!, 0.3);
			}
			context.lineWidth = 3 * opts.pixelRatio;
			context.moveTo(startX, 0);
			context.lineTo(endX, 0);
			context.stroke();
			context.rotate(childAngle * Math.PI);
		}
		context.restore();

		//## 第三步画进度条
		series = getGaugeArcbarDataPoints(series, gaugeOption, process);
		context.lineWidth = gaugeOption.width;
		context.strokeStyle = series[0].color!;
		context.lineCap = "round";
		context.beginPath();
		context.arc(
			centerPosition.x + xOffset,
			centerPosition.y + yOffset,
			innerRadius,
			gaugeOption.startAngle * Math.PI,
			series[0]._proportion_ * Math.PI,
			false
		);
		context.stroke();

		//## 第四步画指针
		let pointerRadius = radius - gaugeOption.width * 2.5;
		context.save();
		context.translate(centerPosition.x + xOffset, centerPosition.y + yOffset); // 添加xOffset/yOffset
		context.rotate((series[0]._proportion_ - 1) * Math.PI);
		context.beginPath();
		context.lineWidth = gaugeOption.width / 3;
		let gradient3 = context.createLinearGradient(
			0,
			-pointerRadius * 0.6,
			0,
			pointerRadius * 0.6
		);
		gradient3.addColorStop(0, hexToRgb("#FFFFFF", 0));
		gradient3.addColorStop(0.5, hexToRgb(series[0].color!, 1));
		gradient3.addColorStop(1, hexToRgb("#FFFFFF", 0));
		context.strokeStyle = gradient3;
		context.arc(0, 0, pointerRadius, 0.85 * Math.PI, 1.15 * Math.PI, false); // 圆心设为(0,0)
		context.stroke();
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = series[0].color!;
		context.fillStyle = series[0].color!;
		const pgw: number = -pointerRadius - gaugeOption.width / 3 / 2;
		context.moveTo(pgw, -4);
		context.lineTo(pgw - 4, 0);
		context.lineTo(pgw, 4);
		context.lineTo(pgw, -4);
		context.stroke();
		context.fill();
		context.restore();
	} else {
		// default百度样式
		// 画背景
		context.lineWidth = gaugeOption.width;
		context.lineCap = "butt";
		for (let i = 0; i < categories.length; i++) {
			let eachCategories = categories[i];
			context.beginPath();
			context.strokeStyle = eachCategories.color!;
			context.arc(
				centerPosition.x + xOffset,
				centerPosition.y + yOffset,
				radius,
				eachCategories._startAngle_ * Math.PI,
				eachCategories._endAngle_ * Math.PI,
				false
			);
			context.stroke();
		}

		// 画刻度线
		if (gaugeOption.endAngle < gaugeOption.startAngle) {
			totalAngle = 2 + gaugeOption.endAngle - gaugeOption.startAngle;
		} else {
			totalAngle = gaugeOption.startAngle - gaugeOption.endAngle;
		}
		let splitAngle = totalAngle / gaugeOption.splitLine!.splitNumber;
		let childAngle =
			totalAngle / gaugeOption.splitLine!.splitNumber / gaugeOption.splitLine!.childNumber;
		const fixRadius = gaugeOption.splitLine!.fixRadius!;
		let startX = -radius - gaugeOption.width * 0.5 - fixRadius;
		let endX = -radius - gaugeOption.width * 0.5 - fixRadius + gaugeOption.splitLine!.width;
		let childendX =
			-radius - gaugeOption.width * 0.5 - fixRadius + gaugeOption.splitLine!.childWidth;

		// 主刻度线
		context.save();
		context.translate(centerPosition.x + xOffset, centerPosition.y + yOffset); // 添加xOffset/yOffset
		context.rotate((gaugeOption.startAngle - 1) * Math.PI);
		for (let i = 0; i < gaugeOption.splitLine!.splitNumber + 1; i++) {
			context.beginPath();
			context.strokeStyle = gaugeOption.splitLine!.color;
			context.lineWidth = 2 * opts.pixelRatio;
			context.moveTo(startX, 0);
			context.lineTo(endX, 0);
			context.stroke();
			context.rotate(splitAngle * Math.PI);
		}
		context.restore();

		// 子刻度线
		context.save();
		context.translate(centerPosition.x + xOffset, centerPosition.y + yOffset); // 添加xOffset/yOffset
		context.rotate((gaugeOption.startAngle - 1) * Math.PI);
		for (
			let i = 0;
			i < gaugeOption.splitLine!.splitNumber * gaugeOption.splitLine!.childNumber + 1;
			i++
		) {
			context.beginPath();
			context.strokeStyle = gaugeOption.splitLine!.color;
			context.lineWidth = 1 * opts.pixelRatio;
			context.moveTo(startX, 0);
			context.lineTo(childendX, 0);
			context.stroke();
			context.rotate(childAngle * Math.PI);
		}
		context.restore();

		// 画指针
		series = getGaugeDataPoints(series, categories, gaugeOption, process);
		for (let i = 0; i < series.length; i++) {
			let eachSeries = series[i];
			context.save();
			context.translate(centerPosition.x + xOffset, centerPosition.y + yOffset); // 添加xOffset/yOffset
			context.rotate((eachSeries._proportion_ - 1) * Math.PI);
			context.beginPath();
			context.fillStyle = eachSeries.color!;
			context.moveTo(gaugeOption.pointer!.width, 0);
			context.lineTo(0, -gaugeOption.pointer!.width / 2);
			context.lineTo(-innerRadius, 0);
			context.lineTo(0, gaugeOption.pointer!.width / 2);
			context.lineTo(gaugeOption.pointer!.width, 0);
			context.closePath();
			context.fill();
			context.beginPath();
			context.fillStyle = "#FFFFFF";
			context.arc(0, 0, gaugeOption.pointer!.width / 6, 0, 2 * Math.PI, false); // 圆心设为(0,0)
			context.fill();
			context.restore();
		}

		if (opts.dataLabel != false) {
			drawGaugeLabel(gaugeOption, radius, centerPosition, opts, config, context);
		}
	}

	// 画仪表盘标题，副标题
	drawRingTitle(opts, config, context, centerPosition);

	if (process == 1 && opts.type == "gauge") {
		opts.extra.gauge!.oldAngle = series[0]._proportion_;
		opts.extra.gauge!.oldData = series[0].data![0].value!;
	}

	const tooltip = new ChartOptionsChartDataToolTiPData();
	tooltip.center = centerPosition;
	tooltip.radius = radius;
	tooltip.innerRadius = innerRadius;
	tooltip.categories = categories;
	tooltip.totalAngle = totalAngle;
	return tooltip;
}
//散点图
function drawScatterDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartColumnDataPoints {
	let scatterOption = opts.extra.scatter!;
	let xAxisData = opts.chartData.xAxisData;
	let xAxisPoints = xAxisData.xAxisPoints;
	let eachSpacing = xAxisData.eachSpacing!;
	let calPoints: ChartOptionsChartDataCalPoints[][] = [];
	context.save();
	let leftSpace = 0;
	let rightSpace = opts.width + eachSpacing;
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		context.translate(opts._scrollDistance_!, 0);
		leftSpace = -opts._scrollDistance_! - eachSpacing * 2 + opts.area[3];
		rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
	}
	series.forEach((eachSeries: ChartOptionsSeries, seriesIndex: number) => {
		let ranges = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
		let minRange = parseFloat(ranges.pop()!);
		let maxRange = parseFloat(ranges.shift()!);
		let data = eachSeries.dataArr;
		let points = getArrDataPoints(
			data,
			minRange,
			maxRange,
			xAxisPoints,
			eachSpacing,
			opts,
			config,
			process
		);
		context.beginPath();
		context.strokeStyle = eachSeries.color!;
		context.fillStyle = eachSeries.color!;
		context.lineWidth = 1 * opts.pixelRatio;
		let shape = eachSeries.pointShape;
		if (shape == "diamond") {
			points.forEach(function (item) {
				if (item != null) {
					context.moveTo(xOffset + item.x, item.y - 4.5 + yOffset);
					context.lineTo(xOffset + item.x - 4.5, item.y + yOffset);
					context.lineTo(xOffset + item.x, item.y + 4.5 + yOffset);
					context.lineTo(xOffset + item.x + 4.5, item.y + yOffset);
					context.lineTo(xOffset + item.x, item.y - 4.5 + yOffset);
				}
			});
		} else if (shape == "circle") {
			points.forEach(function (item) {
				if (item != null) {
					context.moveTo(xOffset + item.x + 2.5 * opts.pixelRatio, item.y + yOffset);
					context.arc(
						xOffset + item.x,
						yOffset + item.y,
						3 * opts.pixelRatio,
						0,
						2 * Math.PI,
						false
					);
				}
			});
		} else if (shape == "square") {
			points.forEach(function (item) {
				if (item != null) {
					context.moveTo(xOffset + item.x - 3.5, yOffset + item.y - 3.5);
					context.rect(xOffset + item.x - 3.5, yOffset + item.y - 3.5, 7, 7);
				}
			});
		} else if (shape == "triangle") {
			points.forEach(function (item) {
				if (item != null) {
					context.moveTo(xOffset + item.x, item.y - 4.5 + yOffset);
					context.lineTo(xOffset + item.x - 4.5, item.y + 4.5 + yOffset);
					context.lineTo(xOffset + item.x + 4.5, item.y + 4.5 + yOffset);
					context.lineTo(xOffset + item.x, item.y - 4.5 + yOffset);
				}
			});
		}
		context.closePath();
		context.fill();
		context.stroke();
	});
	if (opts.dataLabel != false && process == 1) {
		series.forEach(function (eachSeries, seriesIndex) {
			let ranges = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
			let minRange = parseFloat(ranges.pop()!);
			let maxRange = parseFloat(ranges.shift()!);
			let data = eachSeries.dataArr;
			let points = getArrDataPoints(
				data,
				minRange,
				maxRange,
				xAxisPoints,
				eachSpacing,
				opts,
				config,
				process
			);

			drawArrPointText(points, eachSeries, config, context, opts);
		});
	}
	context.restore();
	return {
		xAxisPoints: xAxisPoints,
		yAxisPoints: [],
		calPoints: calPoints,
		eachSpacing: eachSpacing
	} as ChartColumnDataPoints;
}
//气泡图

function drawBubbleDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
) {
	let bubbleOption = opts.extra.bubble!;
	let xAxisData = opts.chartData.xAxisData;
	let xAxisPoints = xAxisData.xAxisPoints;
	let eachSpacing = xAxisData.eachSpacing!;
	let calPoints: ChartOptionsChartDataCalPoints[][] = [];
	context.save();
	let leftSpace = 0;
	let rightSpace = opts.width + eachSpacing;
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		context.translate(opts._scrollDistance_!, 0);
		leftSpace = -opts._scrollDistance_! - eachSpacing * 2 + opts.area[3];
		rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
	}
	series.forEach(function (eachSeries: ChartOptionsSeries) {
		let ranges = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
		let minRange = parseFloat(ranges.pop()!);
		let maxRange = parseFloat(ranges.shift()!);
		let data = eachSeries.dataArr;
		let points = getArrDataPoints(
			data,
			minRange,
			maxRange,
			xAxisPoints,
			eachSpacing,
			opts,
			config,
			process
		);
		context.beginPath();
		context.strokeStyle = eachSeries.color!;
		context.lineWidth = bubbleOption.border * opts.pixelRatio;
		context.fillStyle = hexToRgb(eachSeries.color!, bubbleOption.opacity);
		points.forEach((item) => {
			context.moveTo(item.x + item.r, item.y);
			context.arc(item.x, item.y, item.r * opts.pixelRatio, 0, 2 * Math.PI, false);
		});
		context.closePath();
		context.fill();
		context.stroke();

		if (opts.dataLabel != false && process == 1) {
			points.forEach(function (item, index) {
				context.beginPath();
				let fontSize = (eachSeries.textSize ?? config.fontSize) * opts.pixelRatio;
				context.font = `${fontSize}px sans-serif`;
				context.fillStyle = eachSeries.textColor ?? "#FFFFFF";
				context.textAlign = "center";
				context.fillText(`${item.t}`, item.x, item.y + fontSize / 2);
				context.closePath();
				context.stroke();
				context.textAlign = "left";
			});
		}
	});
	context.restore();
	return {
		xAxisPoints: xAxisPoints,
		yAxisPoints: [],
		calPoints: calPoints,
		eachSpacing: eachSpacing
	} as ChartColumnDataPoints;
}
//K线图
export function getCandleToolTipData(
	series: number[][],
	seriesData: ChartOptionsSeries[],
	opts: ChartOptions,
	eindex: any,
	categories: string[],
	extra: ChartOptionsExtraCandle,
	option: ChartOptionsTooltipOption
): ChartOptionsTooltipOption {
	let calPoints = opts.chartData.calMapPoints!;
	let upColor = extra.color.upFill;
	let downColor = extra.color.downFill;
	let index = eindex as number;
	//颜色顺序为开盘，收盘，最低，最高
	let color: string[] = [upColor, upColor, downColor, upColor];
	let textList: TextList[] = [];
	seriesData.forEach((item: ChartOptionsSeries) => {
		if (index == 0) {
			if (item.dataArr[0][1] - item.dataArr[0][0] < 0) {
				color[1] = downColor;
			} else {
				color[1] = upColor;
			}
		} else {
			if (item.dataArr[0][0] < series[index - 1][1]) {
				color[0] = downColor;
			}
			if (item.dataArr[0][1] < item.dataArr[0][0]) {
				color[1] = downColor;
			}
			if (item.dataArr[0][2] > series[index - 1][1]) {
				color[2] = upColor;
			}
			if (item.dataArr[0][3] < series[index - 1][1]) {
				color[3] = downColor;
			}
		}
		let dataArr = item.dataArr[0];
		const legendShape: string =
			opts.extra.tooltip!.legendShape == "auto"
				? item.legendShape!
				: opts.extra.tooltip!.legendShape;
		const text1 = new TextList();
		text1.text = "开盘：" + dataArr[0];
		text1.color = color[0];
		text1.legendShape = legendShape;
		const text2 = new TextList();
		text2.text = "收盘：" + dataArr[1];
		text2.color = color[1];
		text2.legendShape = legendShape;
		const text3 = new TextList();
		text3.text = "最低：" + dataArr[2];
		text3.color = color[2];
		text3.legendShape = legendShape;
		const text4 = new TextList();
		text4.text = "最高：" + dataArr[3];
		text4.color = color[3];
		text4.legendShape = legendShape;
		textList.push(text1, text2, text3, text4);
	});
	let validCalPoints: ChartOptionsChartDataCalPoints[][] = [];
	let offset = new Offset();
	for (let i = 0; i < calPoints.length; i++) {
		let points = calPoints[i];
		if (points[index] != null) {
			validCalPoints.push(points[index]);
		}
	}
	offset.x = Math.round(validCalPoints[0][0].x);
	const tooltipOption = new ChartOptionsTooltipOption();
	tooltipOption.textList = textList;
	tooltipOption.offset = offset;
	return tooltipOption;
}
function getCandleDataPoints(
	data: number[][],
	minRange: number,
	maxRange: number,
	xAxisPoints: number[],
	eachSpacing: number,
	opts: ChartOptions,
	config: TuiChartConfig,
	process: number = 1
): ChartOptionsChartDataCalPoints[][] {
	let points: ChartOptionsChartDataCalPoints[][] = [];
	let validHeight = opts.height - opts.area[0] - opts.area[2];

	data.forEach(function (item, index) {
		if (item == null) {
			// points.push(null);
		} else {
			let cPoints: ChartOptionsChartDataCalPoints[] = [];
			item.forEach(function (items, indexs) {
				let point = new ChartOptionsChartDataCalPoints();
				point.x = xAxisPoints[index] + Math.round(eachSpacing / 2);
				let value = items;
				let height = (validHeight * (value - minRange)) / (maxRange - minRange);
				height *= process;
				point.y = opts.height - Math.round(height) - opts.area[2];
				cPoints.push(point);
			});
			points.push(cPoints);
		}
	});
	return points;
}
function drawCandleDataPoints(
	series: ChartOptionsSeries[],
	seriesMA: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartsCandleDataPoints {
	let candleOption = opts.extra.candle!;
	let xAxisData = opts.chartData.xAxisData;
	let xAxisPoints = xAxisData.xAxisPoints;
	let eachSpacing = xAxisData.eachSpacing!;
	let calPoints: ChartOptionsChartDataCalPoints[][][] = [];
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	context.save();
	context.translate(xOffset, yOffset); // Apply the offset here

	let leftNum = -2;
	let rightNum = xAxisPoints.length + 2;
	let leftSpace = 0;
	let rightSpace = opts.width + eachSpacing;
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		context.translate(opts._scrollDistance_!, 0);
		const scrollDistance = -opts._scrollDistance_!;
		leftNum = Math.floor(scrollDistance / eachSpacing) - 2;
		rightNum = leftNum + opts.xAxis.itemCount + 4;
		leftSpace = -opts._scrollDistance_! - eachSpacing * 2 + opts.area[3];
		rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
	}
	//画均线
	if (candleOption.average.show || seriesMA.length > 0) {
		//Merge pull request !12 from 邱贵翔
		seriesMA.forEach((eachSeries: ChartOptionsSeries) => {
			let ranges = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
			let minRange = parseFloat(ranges.pop()!);
			let maxRange = parseFloat(ranges.shift()!);
			let data = eachSeries.data!;
			let points = getDataPoints(
				data,
				minRange,
				maxRange,
				xAxisPoints,
				eachSpacing,
				opts,
				config,
				process
			);
			let splitPointList = splitPoints(points, eachSeries);
			for (let i = 0; i < splitPointList.length; i++) {
				let points = splitPointList[i];
				context.beginPath();
				context.strokeStyle = eachSeries.color!;
				context.lineWidth = 1;
				if (points.length == 1) {
					context.moveTo(points[0].x, points[0].y);
					context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
				} else {
					context.moveTo(points[0].x, points[0].y);
					let startPoint = 0;
					for (let j = 0; j < points.length; j++) {
						let item = points[j];
						if (startPoint == 0 && item.x > leftSpace) {
							context.moveTo(item.x, item.y);
							startPoint = 1;
						}
						if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
							let ctrlPoint = createCurveControlPoints(points, j - 1);
							context.bezierCurveTo(
								ctrlPoint.ctrA.x,
								ctrlPoint.ctrA.y,
								ctrlPoint.ctrB.x,
								ctrlPoint.ctrB.y,
								item.x,
								item.y
							);
						}
					}
					context.moveTo(points[0].x, points[0].y);
				}
				context.closePath();
				context.stroke();
			}
		});
	}
	//画K线
	series.forEach(function (eachSeries, seriesIndex) {
		let ranges = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
		let minRange = parseFloat(ranges.pop()!);
		let maxRange = parseFloat(ranges.shift()!);
		let data = eachSeries.dataArr;
		let points = getCandleDataPoints(
			data,
			minRange,
			maxRange,
			xAxisPoints,
			eachSpacing,
			opts,
			config,
			process
		);
		calPoints.push(points);
		let splitPointList = splitCandlePoints(points, eachSeries);
		for (let i = 0; i < splitPointList[0].length; i++) {
			if (i > leftNum && i < rightNum) {
				let item = splitPointList[0][i];
				context.beginPath();
				//如果上涨
				if (data[i][1] - data[i][0] > 0) {
					context.strokeStyle = candleOption.color.upLine;
					context.fillStyle = candleOption.color.upFill;
					context.lineWidth = 1 * opts.pixelRatio;
					context.moveTo(item[3].x, item[3].y); //顶点
					context.lineTo(item[1].x, item[1].y); //收盘中间点
					context.lineTo(item[1].x - eachSpacing / 4, item[1].y); //收盘左侧点
					context.lineTo(item[0].x - eachSpacing / 4, item[0].y); //开盘左侧点
					context.lineTo(item[0].x, item[0].y); //开盘中间点
					context.lineTo(item[2].x, item[2].y); //底点
					context.lineTo(item[0].x, item[0].y); //开盘中间点
					context.lineTo(item[0].x + eachSpacing / 4, item[0].y); //开盘右侧点
					context.lineTo(item[1].x + eachSpacing / 4, item[1].y); //收盘右侧点
					context.lineTo(item[1].x, item[1].y); //收盘中间点
					context.moveTo(item[3].x, item[3].y); //顶点
				} else {
					context.strokeStyle = candleOption.color.downLine;
					context.fillStyle = candleOption.color.downFill;
					context.lineWidth = 1 * opts.pixelRatio;
					context.moveTo(item[3].x, item[3].y); //顶点
					context.lineTo(item[0].x, item[0].y); //开盘中间点
					context.lineTo(item[0].x - eachSpacing / 4, item[0].y); //开盘左侧点
					context.lineTo(item[1].x - eachSpacing / 4, item[1].y); //收盘左侧点
					context.lineTo(item[1].x, item[1].y); //收盘中间点
					context.lineTo(item[2].x, item[2].y); //底点
					context.lineTo(item[1].x, item[1].y); //收盘中间点
					context.lineTo(item[1].x + eachSpacing / 4, item[1].y); //收盘右侧点
					context.lineTo(item[0].x + eachSpacing / 4, item[0].y); //开盘右侧点
					context.lineTo(item[0].x, item[0].y); //开盘中间点
					context.moveTo(item[3].x, item[3].y); //顶点
				}
				context.closePath();
				context.fill();
				context.stroke();
			}
		}
	});
	context.restore();
	return {
		xAxisPoints: xAxisPoints,
		yAxisPoints: [],
		calPoints: calPoints,
		eachSpacing: eachSpacing
	} as ChartsCandleDataPoints;
}

//地图
function isRayIntersectsSegment(poi: number[], s_poi: number[], e_poi: number[]): boolean {
	if (s_poi[1] == e_poi[1]) {
		return false;
	}
	if (s_poi[1] > poi[1] && e_poi[1] > poi[1]) {
		return false;
	}
	if (s_poi[1] < poi[1] && e_poi[1] < poi[1]) {
		return false;
	}
	if (s_poi[1] == poi[1] && e_poi[1] > poi[1]) {
		return false;
	}
	if (e_poi[1] == poi[1] && s_poi[1] > poi[1]) {
		return false;
	}
	if (s_poi[0] < poi[0] && e_poi[1] < poi[1]) {
		return false;
	}
	let xseg = e_poi[0] - ((e_poi[0] - s_poi[0]) * (e_poi[1] - poi[1])) / (e_poi[1] - s_poi[1]);
	if (xseg < poi[0]) {
		return false;
	} else {
		return true;
	}
}
function isPoiWithinPoly(poi: number[], poly: number[][][][], mercator: boolean): boolean {
	let sinsc = 0;
	for (let i = 0; i < poly.length; i++) {
		let epoly = poly[i][0];
		if (poly.length == 1) {
			epoly = poly[i][0];
		}
		for (let j = 0; j < epoly.length - 1; j++) {
			let s_poi = epoly[j];
			let e_poi = epoly[j + 1];
			if (mercator) {
				s_poi = lonlat2mercator(epoly[j][0], epoly[j][1]);
				e_poi = lonlat2mercator(epoly[j + 1][0], epoly[j + 1][1]);
			}
			if (isRayIntersectsSegment(poi, s_poi, e_poi)) {
				sinsc += 1;
			}
		}
	}
	if (sinsc % 2 == 1) {
		return true;
	} else {
		return false;
	}
}
function pointToCoordinate(
	pointY: number,
	pointX: number,
	bounds: ChartMapBounds,
	scale: number,
	xoffset: number,
	yoffset: number
): Offset {
	const offset = new Offset();
	offset.x = (pointX - xoffset) / scale + bounds.xMin;
	offset.y = bounds.yMax - (pointY - yoffset) / scale;
	return offset;
}

export function findMapChartCurrentIndex(
	currentPoints: TouchPosition,
	opts: ChartOptions
): ChartOptionsTooltip {
	let tooltip: ChartOptionsTooltip = new ChartOptionsTooltip();
	let currentIndex = -1;
	let cData = opts.chartData.mapData!;
	let data = opts.series!;
	let tmp = pointToCoordinate(
		currentPoints.y,
		currentPoints.x,
		cData.bounds,
		cData.scale,
		cData.xoffset,
		cData.yoffset
	);
	let poi: number[] = [tmp.x, tmp.y];
	for (let i = 0, len = data.length; i < len; i++) {
		let item = data[i].geometry.coordinates;
		if (isPoiWithinPoly(poi, item, opts.chartData.mapData!.mercator)) {
			currentIndex = i;
			break;
		}
	}
	tooltip.index = currentIndex;
	return tooltip;
}
function coordinateToPoint(
	latitude: number,
	longitude: number,
	bounds: ChartMapBounds,
	scale: number,
	xoffset: number,
	yoffset: number
): Offset {
	const offset = new Offset();
	offset.x = (longitude - bounds.xMin) * scale + xoffset;
	offset.y = (bounds.yMax - latitude) * scale + yoffset;
	return offset;
}
function lonlat2mercator(longitude: number, latitude: number): number[] {
	let mercator: number[] = [];
	let x = (longitude * 20037508.34) / 180;
	let y = Math.log(Math.tan(((90 + latitude) * Math.PI) / 360)) / (Math.PI / 180);
	y = (y * 20037508.34) / 180;
	mercator.push(x);
	mercator.push(y);
	return mercator;
}
function getBoundingBox(data: ChartOptionsSeries[]): ChartMapBounds {
	let bounds = new ChartMapBounds();
	let datacoords: number[][] = [];
	for (let i = 0; i < data.length; i++) {
		let coorda: number[][][][] = data[i].geometry.coordinates;
		for (let k = 0; k < coorda.length; k++) {
			let coords: number[][][] = coorda[k];
			if (coords.length == 1) {
				datacoords = coords[0];
			}
			for (let j = 0; j < datacoords.length; j++) {
				let longitude = datacoords[j][0];
				let latitude = datacoords[j][1];
				const point = new Offset();
				point.x = longitude;
				point.y = latitude;
				bounds.xMin = bounds.xMin < point.x ? bounds.xMin : point.x;
				bounds.xMax = bounds.xMax > point.x ? bounds.xMax : point.x;
				bounds.yMin = bounds.yMin < point.y ? bounds.yMin : point.y;
				bounds.yMax = bounds.yMax > point.y ? bounds.yMax : point.y;
			}
		}
	}
	return bounds;
}
function drawMapDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	let mapOption = opts.extra.map!;
	let coords: number[][] = [];
	let point: Offset = new Offset();
	let data: ChartOptionsSeries[] = series;
	let bounds: ChartMapBounds = getBoundingBox(data);
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;

	// 应用偏移量
	context.save();
	context.translate(xOffset, yOffset);

	if (mapOption.mercator) {
		let max = lonlat2mercator(bounds.xMax, bounds.yMax);
		let min = lonlat2mercator(bounds.xMin, bounds.yMin);
		bounds.xMax = max[0];
		bounds.yMax = max[1];
		bounds.xMin = min[0];
		bounds.yMin = min[1];
	}

	let xScale = opts.width / Math.abs(bounds.xMax - bounds.xMin);
	let yScale = opts.height / Math.abs(bounds.yMax - bounds.yMin);
	let scale = xScale < yScale ? xScale : yScale;
	let xoffset = opts.width / 2 - (Math.abs(bounds.xMax - bounds.xMin) / 2) * scale;
	let yoffset = opts.height / 2 - (Math.abs(bounds.yMax - bounds.yMin) / 2) * scale;

	for (let i = 0; i < data.length; i++) {
		context.beginPath();
		context.lineWidth = mapOption.borderWidth * opts.pixelRatio;
		context.strokeStyle = mapOption.borderColor;
		context.fillStyle = hexToRgb(series[i].color!, series[i].fillOpacity);
		if (mapOption.active == true && opts.tooltip != null) {
			if ((opts.tooltip!.index as number) == i) {
				context.strokeStyle = mapOption.activeBorderColor;
				context.fillStyle = hexToRgb(
					mapOption.activeFillColor,
					mapOption.activeFillOpacity
				);
			}
		}
		let coorda: number[][][][] = data[i].geometry.coordinates;
		for (let k = 0; k < coorda.length; k++) {
			let _coords: number[][][] = coorda[k];
			if (_coords.length == 1) {
				coords = _coords[0];
			}
			for (let j = 0; j < coords.length; j++) {
				let gaosi: number[] = [];
				if (mapOption.mercator) {
					gaosi = lonlat2mercator(coords[j][0], coords[j][1]);
				} else {
					gaosi = coords[j];
				}
				point = coordinateToPoint(gaosi[1], gaosi[0], bounds, scale, xoffset, yoffset);
				if (j == 0) {
					context.beginPath();
					context.moveTo(point.x, point.y);
				} else {
					context.lineTo(point.x, point.y);
				}
			}
			context.fill();
			if (mapOption.border == true) {
				context.stroke();
			}
		}
	}

	if (opts.dataLabel == true) {
		for (let i = 0; i < data.length; i++) {
			let centerPoint = data[i].properties.centroid;
			if (centerPoint.length > 0) {
				if (mapOption.mercator) {
					centerPoint = lonlat2mercator(
						data[i].properties.centroid[0],
						data[i].properties.centroid[1]
					);
				}
				point = coordinateToPoint(
					centerPoint[1],
					centerPoint[0],
					bounds,
					scale,
					xoffset,
					yoffset
				);
				let fontSize = (data[i].textSize ?? config.fontSize) * opts.pixelRatio;
				let fontColor = data[i].textColor ?? opts.fontColor;
				if (
					mapOption.active &&
					mapOption.activeTextColor != "" &&
					opts.tooltip != null &&
					(opts.tooltip!.index as number) == i
				) {
					fontColor = mapOption.activeTextColor;
				}
				let text = data[i].properties.name;
				context.beginPath();
				context.font = `${fontSize}px sans-serif`;
				context.fillStyle = fontColor;
				context.fillText(
					text,
					point.x - measureText(text, fontSize) / 2,
					point.y + fontSize / 2
				);
				context.closePath();
				context.stroke();
			}
		}
	}

	const mapdata = new ChartOptionsChartDataMapData();
	mapdata.bounds = bounds;
	mapdata.scale = scale;
	mapdata.xoffset = xoffset;
	mapdata.yoffset = yoffset;
	mapdata.mercator = mapOption.mercator;
	opts.chartData.mapData = mapdata;
	drawToolTipBridge(opts, config, context, 1, 0, []);

	// 恢复画布状态
	context.restore();
}
//混合图
export function getMixToolTipData(
	seriesData: ChartOptionsSeries[],
	opts: ChartOptions,
	eindex: any,
	categories: string[],
	option: ChartOptionsTooltipOption
): ChartOptionsTooltipOption {
	const index = eindex as number;
	const points = opts.chartData.xAxisPoints![index] + opts.chartData.eachSpacing / 2;
	let textList = seriesData.map((item: ChartOptionsSeries): TextList => {
		const list = new TextList();
		if (option.formatter != null) {
			const fun = option.formatter as (
				item: ChartOptionsSeries,
				categories: string,
				index: number,
				opts: ChartOptions
			) => string;
			list.text = fun(item, categories[index], index, opts);
		} else {
			list.text = item.name + ": " + item.data![0].value!;
		}
		list.legendShape =
			opts.extra.tooltip!.legendShape == "auto"
				? item.legendShape!
				: opts.extra.tooltip!.legendShape;
		list.color = item.color!;
		list.disableLegend = item.disableLegend ? true : false;
		return list;
	});
	textList = textList.filter((item: TextList): boolean => {
		return item.disableLegend != true;
	});
	const offset = new Offset();
	offset.x = Math.round(points);
	offset.y = 0;
	const tooltipOption = new ChartOptionsTooltipOption();
	tooltipOption.textList = textList;
	tooltipOption.offset = offset;
	return tooltipOption;
}

function drawMixDataPoints(
	series: ChartOptionsSeries[],
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D,
	process: number = 1
): ChartColumnDataPoints {
	let xAxisData = opts.chartData.xAxisData;
	let xAxisPoints = xAxisData.xAxisPoints;
	let eachSpacing = xAxisData.eachSpacing!;
	let columnOption = opts.extra.mix?.column ?? new ChartOptionsExtraMixColumn();
	let areaOption = opts.extra.mix?.area ?? new ChartOptionsExtraMixArea();
	let lineOption = opts.extra.mix?.line ?? new ChartOptionsExtraMixLine();

	let endY = opts.height - opts.area[2];
	let calPoints: ChartOptionsChartDataCalPoints[][] = [];
	let columnIndex = 0;
	let columnLength = 0;
	const xOffset = opts.xOffset;
	const yOffset = opts.yOffset;
	series.forEach((eachSeries) => {
		if (eachSeries.type == "column") {
			columnLength += 1;
		}
	});
	context.save();
	let leftNum = -2;
	let rightNum = xAxisPoints.length + 2;
	let leftSpace = 0;
	let rightSpace = opts.width + eachSpacing;
	if (opts._scrollDistance_ != null && opts._scrollDistance_ != 0 && opts.enableScroll == true) {
		const scrollDistance = opts._scrollDistance_!;
		context.translate(scrollDistance, 0);
		leftNum = Math.floor(-scrollDistance / eachSpacing) - 2;
		rightNum = leftNum + opts.xAxis.itemCount + 4;
		leftSpace = -scrollDistance - eachSpacing * 2 + opts.area[3];
		rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
	}
	columnOption.customColor = fillCustomColor(
		columnOption.linearType,
		columnOption.customColor,
		series,
		config
	);
	series.forEach(function (eachSeries) {
		let ranges = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
		let minRange = parseFloat(ranges.pop()!);
		let maxRange = parseFloat(ranges.shift()!);
		let data = eachSeries.data!;
		let points = getDataPoints(
			data,
			minRange,
			maxRange,
			xAxisPoints,
			eachSpacing,
			opts,
			config,
			process
		);
		calPoints.push(points);
		// 绘制柱状数据图
		if (eachSeries.type == "column") {
			points = fixColumeData(points, eachSpacing, columnLength, columnIndex, config, opts);
			for (let i = 0; i < points.length; i++) {
				let item = points[i];
				if (item != null && i > leftNum && i < rightNum) {
					let itemWidth = item.width!;
					let startX = item.x - itemWidth / 2;
					let height = opts.height - item.y - opts.area[2];
					context.beginPath();
					let fillColor: any = item.color ?? eachSeries.color!;
					let strokeColor = item.color ?? eachSeries.color!;
					if (columnOption.linearType != "none") {
						let grd = context.createLinearGradient(
							startX + xOffset,
							item.y + yOffset,
							startX + xOffset,
							opts.height - opts.area[2] + yOffset
						);
						//透明渐变
						if (columnOption.linearType == "opacity") {
							grd.addColorStop(
								0,
								hexToRgb(`${fillColor}`, columnOption.linearOpacity)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						} else {
							grd.addColorStop(
								0,
								hexToRgb(
									columnOption.customColor![eachSeries.linearIndex!],
									columnOption.linearOpacity
								)
							);
							grd.addColorStop(
								columnOption.colorStop!,
								hexToRgb(
									columnOption.customColor![eachSeries.linearIndex!],
									columnOption.linearOpacity
								)
							);
							grd.addColorStop(1, hexToRgb(`${fillColor}`, 1));
						}
						fillColor = grd;
					}
					// 圆角边框
					if (
						(columnOption.barBorderRadius != null &&
							columnOption.barBorderRadius!.length == 4) ||
						columnOption.barBorderCircle
					) {
						const left = startX;
						const top = item.y;
						const width = item.width!;
						const height = opts.height - opts.area[2] - item.y;
						if (columnOption.barBorderCircle) {
							columnOption.barBorderRadius = [width / 2, width / 2, 0, 0];
						}
						let barBorderRadius = columnOption.barBorderRadius!;
						let r0 = barBorderRadius[0];
						let r1 = barBorderRadius[1];
						let r2 = barBorderRadius[2];
						let r3 = barBorderRadius[3];

						let minRadius = Math.min(width / 2, height / 2);
						r0 = r0 > minRadius ? minRadius : r0;
						r1 = r1 > minRadius ? minRadius : r1;
						r2 = r2 > minRadius ? minRadius : r2;
						r3 = r3 > minRadius ? minRadius : r3;
						r0 = r0 < 0 ? 0 : r0;
						r1 = r1 < 0 ? 0 : r1;
						r2 = r2 < 0 ? 0 : r2;
						r3 = r3 < 0 ? 0 : r3;
						context.arc(
							xOffset + left + r0,
							yOffset + top + r0,
							r0,
							-Math.PI,
							-Math.PI / 2
						);
						context.arc(
							xOffset + left + width - r1,
							yOffset + top + r1,
							r1,
							-Math.PI / 2,
							0
						);
						context.arc(
							xOffset + left + width - r2,
							yOffset + top + height - r2,
							r2,
							0,
							Math.PI / 2
						);
						context.arc(
							xOffset + left + r3,
							yOffset + top + height - r3,
							r3,
							Math.PI / 2,
							Math.PI
						);
					} else {
						context.moveTo(xOffset + startX, item.y + yOffset);
						context.lineTo(xOffset + startX + item.width!, item.y + yOffset);
						context.lineTo(
							xOffset + startX + item.width!,
							opts.height - opts.area[2] + yOffset
						);
						context.lineTo(xOffset + startX, opts.height - opts.area[2] + yOffset);
						context.lineTo(xOffset + startX, item.y + yOffset);
						context.lineWidth = 1;
						context.strokeStyle = strokeColor;
					}
					context.fillStyle = fillColor;
					context.closePath();
					context.fill();
				}
			}
			columnIndex += 1;
		}
		//绘制区域图数据
		if (eachSeries.type == "area") {
			let splitPointList = splitPoints(points, eachSeries);
			for (let i = 0; i < splitPointList.length; i++) {
				let points = splitPointList[i];
				// 绘制区域数据
				context.beginPath();
				context.strokeStyle = eachSeries.color!;
				context.strokeStyle = hexToRgb(eachSeries.color!, areaOption.opacity);
				if (areaOption.gradient) {
					let gradient = context.createLinearGradient(
						xOffset,
						opts.area[0] + yOffset,
						xOffset,
						opts.height - opts.area[2] + yOffset
					);
					gradient.addColorStop(0, hexToRgb(eachSeries.color!, areaOption.opacity));
					gradient.addColorStop(1, hexToRgb("#FFFFFF", 0.1));
					context.fillStyle = gradient;
				} else {
					context.fillStyle = hexToRgb(eachSeries.color!, areaOption.opacity);
				}
				context.lineWidth = 2 * opts.pixelRatio;
				if (points.length > 1) {
					let firstPoint = points[0];
					let lastPoint = points[points.length - 1];
					context.moveTo(firstPoint.x + xOffset, firstPoint.y + yOffset);
					let startPoint = 0;
					if (eachSeries.style == "curve") {
						for (let j = 0; j < points.length; j++) {
							let item = points[j];
							if (startPoint == 0 && item.x > leftSpace) {
								context.moveTo(item.x + xOffset, item.y + yOffset);
								startPoint = 1;
							}
							if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
								let ctrlPoint = createCurveControlPoints(points, j - 1);
								context.bezierCurveTo(
									ctrlPoint.ctrA.x + xOffset,
									ctrlPoint.ctrA.y + yOffset,
									ctrlPoint.ctrB.x + xOffset,
									ctrlPoint.ctrB.y + yOffset,
									item.x + xOffset,
									item.y + yOffset
								);
							}
						}
					} else {
						for (let j = 0; j < points.length; j++) {
							let item = points[j];
							if (startPoint == 0 && item.x > leftSpace) {
								context.moveTo(xOffset + item.x, item.y + yOffset);
								startPoint = 1;
							}
							if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
								context.lineTo(xOffset + item.x, item.y + yOffset);
							}
						}
					}
					context.lineTo(xOffset + lastPoint.x, endY + yOffset);
					context.lineTo(xOffset + firstPoint.x, endY + yOffset);
					context.lineTo(xOffset + firstPoint.x, firstPoint.y + yOffset);
				} else {
					let item = points[0];
					context.moveTo(xOffset + item.x - eachSpacing / 2, item.y + yOffset);
					// context.lineTo(item.x + eachSpacing / 2, item.y);
					// context.lineTo(item.x + eachSpacing / 2, endY);
					// context.lineTo(item.x - eachSpacing / 2, endY);
					// context.moveTo(item.x - eachSpacing / 2, item.y);
				}
				context.closePath();
				context.fill();
			}
		}
		// 绘制折线数据图
		if (eachSeries.type == "line") {
			let splitPointList = splitPoints(points, eachSeries);
			splitPointList.forEach((points) => {
				if (eachSeries.lineType == "dash") {
					let dashLength = eachSeries.dashLength;
					dashLength *= opts.pixelRatio;
					context.setLineDash([dashLength, dashLength]);
				}
				context.beginPath();
				context.strokeStyle = eachSeries.color!;
				context.lineWidth = lineOption.width * opts.pixelRatio;
				if (points.length == 1) {
					context.moveTo(xOffset + points[0].x, points[0].y + yOffset);
					// context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
				} else {
					context.moveTo(xOffset + points[0].x, points[0].y + yOffset);
					let startPoint = 0;
					if (eachSeries.style == "curve") {
						for (let j = 0; j < points.length; j++) {
							let item = points[j];
							if (startPoint == 0 && item.x > leftSpace) {
								context.moveTo(xOffset + item.x, item.y + yOffset);
								startPoint = 1;
							}
							if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
								let ctrlPoint = createCurveControlPoints(points, j - 1);
								context.bezierCurveTo(
									ctrlPoint.ctrA.x + xOffset,
									ctrlPoint.ctrA.y + yOffset,
									ctrlPoint.ctrB.x + xOffset,
									ctrlPoint.ctrB.y + yOffset,
									item.x + xOffset,
									item.y + yOffset
								);
							}
						}
					} else {
						for (let j = 0; j < points.length; j++) {
							let item = points[j];
							if (startPoint == 0 && item.x > leftSpace) {
								context.moveTo(xOffset + item.x, item.y + yOffset);
								startPoint = 1;
							}
							if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
								context.lineTo(xOffset + item.x, item.y + yOffset);
							}
						}
					}
					context.moveTo(xOffset + points[0].x, points[0].y + yOffset);
				}
				context.stroke();
				context.setLineDash([]);
			});
		}
		// 绘制点数据图
		if (eachSeries.type == "point") {
			eachSeries.addPoint = true;
		}
		if (eachSeries.addPoint == true && eachSeries.type != "column") {
			drawPointShape(points, eachSeries.color!, eachSeries.pointShape, context, opts);
		}
	});
	if (opts.dataLabel != false && process == 1) {
		let columnIndex = 0;
		series.forEach(function (eachSeries) {
			let ranges = [...opts.chartData.yAxisData.ranges![eachSeries.index!]];
			let minRange = parseFloat(ranges.pop()!);
			let maxRange = parseFloat(ranges.shift()!);
			let data = eachSeries.data!;
			let points = getDataPoints(
				data,
				minRange,
				maxRange,
				xAxisPoints,
				eachSpacing,
				opts,
				config,
				process
			);
			if (eachSeries.type != "column") {
				drawPointText(points, eachSeries, config, context, opts);
			} else {
				points = fixColumeData(
					points,
					eachSpacing,
					columnLength,
					columnIndex,
					config,
					opts
				);
				drawPointText(points, eachSeries, config, context, opts);
				columnIndex += 1;
			}
		});
	}
	context.restore();
	return {
		xAxisPoints: xAxisPoints,
		yAxisPoints: [],
		calPoints: calPoints,
		eachSpacing: eachSpacing
	} as ChartColumnDataPoints;
}
export function drawCharts(
	char: TuiChartsInterface,
	type: string,
	opts: ChartOptions,
	config: TuiChartConfig,
	context: CanvasRenderingContext2D
) {
	let _this = char;
	let series = opts.series!;
	//兼容ECharts饼图类数据格式 以下内容暂时未翻译需要保留
	// let seriesData : ChartOptionsSeries[] = []
	// if (type == 'pie' || type == 'ring' || type == 'mount' || type == 'rose' || type == 'funnel') {
	// 	seriesData = fixPieSeries(series, opts, config);
	// }

	let categories: string[] = opts.categories ?? [];
	if (type == "pie" || type == "ring" || type == "mount" || type == "rose" || type == "funnel") {
		categories = [];
		for (let j = 0; j < series.length; j++) {
			categories.push(series[j].name!);
		}
		opts.categories = categories;
	}
	series = fillSeries(series, opts, config);
	let duration = opts.animation ? opts.duration : 0;
	if (_this.animationInstance != null) _this.animationInstance!.stop();
	let seriesMA: ChartOptionsSeries[] = [];
	if (type == "candle") {
		let average = opts.extra.candle!.average;
		if (average.show) {
			seriesMA = calCandleMA(average.day!, average.name!, average.color!, series[0].dataArr);
			seriesMA = fillSeries(seriesMA, opts, config);
			opts.seriesMA = seriesMA;
		} else if (opts.seriesMA != null) {
			opts.seriesMA = fillSeries(opts.seriesMA!, opts, config);
			seriesMA = opts.seriesMA!;
		} else {
			seriesMA = series;
		}
	} else {
		seriesMA = series;
	}
	/* 过滤掉show=false的series */
	series = filterSeries(series);
	opts._series_ = series;
	//重新计算图表区域
	opts.area = [];
	//复位绘图区域
	for (let j = 0; j < 4; j++) {
		opts.area.push(opts.padding![j] * opts.pixelRatio);
	}
	//通过计算三大区域：图例、X轴、Y轴的大小，确定绘图区域
	let _calLegendData = calLegendData(seriesMA, opts, opts.chartData),
		legendHeight = _calLegendData.area.wholeHeight,
		legendWidth = _calLegendData.area.wholeWidth;
	switch (opts.legend.position) {
		case "top":
			opts.area[0] += legendHeight;
			break;
		case "bottom":
			opts.area[2] += legendHeight;
			break;
		case "left":
			opts.area[3] += legendWidth;
			break;
		case "right":
			opts.area[1] += legendWidth;
			break;
	}
	let _calYAxisData = new ChartOptionsChartDataYAxisData(),
		yAxisWidth: ChartOptionsChartDataYAxisDataYAxisWidth[] = [];
	if (
		opts.type == "line" ||
		opts.type == "column" ||
		opts.type == "mount" ||
		opts.type == "area" ||
		opts.type == "mix" ||
		opts.type == "candle" ||
		opts.type == "scatter" ||
		opts.type == "bubble" ||
		opts.type == "bar"
	) {
		_calYAxisData = calYAxisData(series, opts, config);
		yAxisWidth = _calYAxisData.yAxisWidth!;
		//如果显示Y轴标题
		if (opts.yAxis.showTitle) {
			let maxTitleHeight = 0;
			for (let i = 0; i < opts.yAxis.data.length; i++) {
				maxTitleHeight = Math.max(
					maxTitleHeight,
					opts.yAxis.data[i].titleFontSize != null
						? opts.yAxis.data[i].titleFontSize! * opts.pixelRatio
						: config.fontSize
				);
			}
			opts.area[0] += maxTitleHeight;
		}
		let rightIndex = 0,
			leftIndex = 0;
		//计算主绘图区域左右位置
		for (let i = 0; i < yAxisWidth.length; i++) {
			if (yAxisWidth[i].position == "left") {
				if (leftIndex > 0) {
					opts.area[3] += yAxisWidth[i].width + opts.yAxis.padding * opts.pixelRatio;
				} else {
					opts.area[3] += yAxisWidth[i].width;
				}
				leftIndex += 1;
			} else if (yAxisWidth[i].position == "right") {
				if (rightIndex > 0) {
					opts.area[1] += yAxisWidth[i].width + opts.yAxis.padding * opts.pixelRatio;
				} else {
					opts.area[1] += yAxisWidth[i].width;
				}
				rightIndex += 1;
			}
		}
	} else {
		// console.log('类型问题暂时未找到翻译逻辑')
		config.yAxisWidth = yAxisWidth; //类型问题暂时未找到翻译逻辑
	}
	opts.chartData.yAxisData = _calYAxisData;
	if (
		opts.categories != null &&
		opts.categories!.length > 0 &&
		opts.type != "radar" &&
		opts.type != "gauge" &&
		opts.type != "bar"
	) {
		opts.chartData.xAxisData = getXAxisPoints(opts.categories!, opts, config);
		let _calCategoriesData = calCategoriesData(
				opts.categories!,
				opts,
				config,
				opts.chartData.xAxisData.eachSpacing!,
				context
			),
			xAxisHeight = _calCategoriesData.xAxisHeight,
			angle = _calCategoriesData.angle;
		config.xAxisHeight = xAxisHeight;
		config._xAxisTextAngle_ = angle;
		opts.area[2] += xAxisHeight;
		opts.chartData.categoriesData = _calCategoriesData;
	} else {
		if (
			opts.type == "line" ||
			opts.type == "area" ||
			opts.type == "scatter" ||
			opts.type == "bubble" ||
			opts.type == "bar"
		) {
			opts.chartData.xAxisData = calXAxisData(series, opts, config, context);
			categories = opts.chartData.xAxisData.rangesFormat.map(
				(item: number): string => `${item}`
			);
			let _calCategoriesData = calCategoriesData(
					categories,
					opts,
					config,
					opts.chartData.xAxisData.eachSpacing!,
					context
				),
				xAxisHeight = _calCategoriesData.xAxisHeight,
				angle = _calCategoriesData.angle;
			config.xAxisHeight = xAxisHeight;
			config._xAxisTextAngle_ = angle;
			opts.area[2] += xAxisHeight;
			opts.chartData.categoriesData = _calCategoriesData;
		} else {
			opts.chartData.xAxisData = new ChartOptionsChartDataXAxisData();
		}
	}

	//计算右对齐偏移距离
	if (opts.enableScroll && opts.xAxis.scrollAlign == "right" && opts._scrollDistance_ == null) {
		let offsetLeft = 0,
			xAxisPoints = opts.chartData.xAxisData.xAxisPoints,
			startX = opts.chartData.xAxisData.startX!,
			endX = opts.chartData.xAxisData.endX!,
			eachSpacing = opts.chartData.xAxisData.eachSpacing!;
		let totalWidth = eachSpacing * (xAxisPoints.length - 1);
		let screenWidth = endX - startX;
		offsetLeft = screenWidth - totalWidth;
		_this.scrollOption.currentOffset = offsetLeft;
		_this.scrollOption.startTouchX = offsetLeft;
		_this.scrollOption.distance = 0;
		_this.scrollOption.lastMoveTime = 0;
		opts._scrollDistance_ = offsetLeft;
	}
	//未使用到暂时未翻译
	if (type == "pie" || type == "ring" || type == "rose") {
		config._pieTextMaxLength_ =
			opts.dataLabel == false ? 0 : getPieTextMaxLength(seriesMA, config, context, opts);
	}
	switch (type) {
		case "word":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function (process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawWordCloudDataPoints(series, opts, config, context, process);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "map":
			context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
			drawMapDataPoints(series, opts, config, context);
			break;
		case "funnel":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function (process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					opts.chartData.funnelData = drawFunnelDataPoints(
						series,
						opts,
						config,
						context,
						process
					);
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, 0, []);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "line":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					let _drawLineDataPoints = drawLineDataPoints(
							series,
							opts,
							config,
							context,
							process
						),
						xAxisPoints = _drawLineDataPoints.xAxisPoints,
						calPoints = _drawLineDataPoints.calPoints,
						eachSpacing = _drawLineDataPoints.eachSpacing;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "scatter":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					let _drawScatterDataPoints = drawScatterDataPoints(
							series,
							opts,
							config,
							context,
							process
						),
						xAxisPoints = _drawScatterDataPoints.xAxisPoints,
						calPoints = _drawScatterDataPoints.calPoints,
						eachSpacing = _drawScatterDataPoints.eachSpacing;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "bubble":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process) {
					context.clearRect(0, 0, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					let _drawBubbleDataPoints = drawBubbleDataPoints(
							series,
							opts,
							config,
							context,
							process
						),
						xAxisPoints = _drawBubbleDataPoints.xAxisPoints,
						calPoints = _drawBubbleDataPoints.calPoints,
						eachSpacing = _drawBubbleDataPoints.eachSpacing;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "mix":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					let _drawMixDataPoints = drawMixDataPoints(
							series,
							opts,
							config,
							context,
							process
						),
						xAxisPoints = _drawMixDataPoints.xAxisPoints,
						calPoints = _drawMixDataPoints.calPoints,
						eachSpacing = _drawMixDataPoints.eachSpacing;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "column":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: (process: number) => {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					let _drawColumnDataPoints = drawColumnDataPoints(
						series,
						opts,
						config,
						context,
						process
					);
					let xAxisPoints = _drawColumnDataPoints.xAxisPoints;
					let calPoints = _drawColumnDataPoints.calPoints;
					let eachSpacing = _drawColumnDataPoints.eachSpacing;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: () => {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "mount":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					let _drawMountDataPoints = drawMountDataPoints(
						series,
						opts,
						config,
						context,
						process
					);
					let xAxisPoints = _drawMountDataPoints.xAxisPoints;
					let calPoints = _drawMountDataPoints.calPoints;
					let eachSpacing = _drawMountDataPoints.eachSpacing!;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "bar":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawXAxis(categories, opts, config, context);
					let _drawBarDataPoints = drawBarDataPoints(
							series,
							opts,
							config,
							context,
							process
						),
						yAxisPoints = _drawBarDataPoints.yAxisPoints,
						calPoints = _drawBarDataPoints.calPoints,
						eachSpacing = _drawBarDataPoints.eachSpacing;
					opts.chartData.yAxisPoints = yAxisPoints;
					opts.chartData.xAxisPoints = opts.chartData.xAxisData.xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, yAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "area":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					let _drawAreaDataPoints = drawAreaDataPoints(
							series,
							opts,
							config,
							context,
							process
						),
						xAxisPoints = _drawAreaDataPoints.xAxisPoints,
						calPoints = _drawAreaDataPoints.calPoints,
						eachSpacing = _drawAreaDataPoints.eachSpacing!;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "ring":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					opts.chartData.pieData = drawRingDataPoints(
						series,
						opts,
						config,
						context,
						process
					);
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, 0, []);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "pie":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					opts.chartData.pieData = drawPieDataPoints(
						series,
						opts,
						config,
						context,
						process
					);
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, 0, []);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "rose":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					opts.chartData.pieData = drawRoseDataPoints(
						series,
						opts,
						config,
						context,
						process
					);
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, 0, []);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "radar":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					opts.chartData.radarData = drawRadarDataPoints(
						series,
						opts,
						config,
						context,
						process
					);
					drawLegend(opts.series!, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, 0, []);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "arcbar":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process: number) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					opts.chartData.arcbarData = drawArcbarDataPoints(
						series,
						opts,
						config,
						context,
						process
					);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "gauge":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					opts.chartData.gaugeData = drawGaugeDataPoints(
						opts.categoriesObj!,
						series,
						opts,
						config,
						context,
						process
					);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
		case "candle":
			_this.animationInstance = new Animation({
				canvasContext: opts.canvasContext!,
				timing: opts.timing,
				duration: duration,
				onProcess: function onProcess(process) {
					context.clearRect(opts.xOffset, opts.yOffset, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					let _drawCandleDataPoints = drawCandleDataPoints(
						series,
						seriesMA,
						opts,
						config,
						context,
						process
					);
					let xAxisPoints = _drawCandleDataPoints.xAxisPoints;
					let calPoints = _drawCandleDataPoints.calPoints;
					let eachSpacing = _drawCandleDataPoints.eachSpacing;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calMapPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine != false && process == 1) {
						drawMarkLine(opts, config, context);
					}
					if (seriesMA.length > 0) {
						drawLegend(seriesMA, opts, config, context, opts.chartData);
					} else {
						drawLegend(opts.series!, opts, config, context, opts.chartData);
					}
					if (opts.showTooltip) {
						drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					}
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.uevent.trigger("renderComplete");
				}
			} as ChartAnimationOption);
			break;
	}
}
