import { TuiChartConfig } from "./config";
import { TuiChartsEvent } from "./chartsEvent";
import { ChartScrollOption } from "./Interface";
import { Animation } from "./util";
export class Offset {
	x: number = 0;
	y: number = 0;
}
export class ChartCurveControlPoints {
	ctrA: Offset = new Offset();
	ctrB: Offset = new Offset();
}
export type ChartRange = {
	minRange: number;
	maxRange: number;
};
export type ChartColumnDataPoints = {
	yAxisPoints: number[];
	xAxisPoints: number[];
	calPoints: ChartOptionsChartDataCalPoints[][];
	eachSpacing: number;
};
export type ChartsCandleDataPoints = {
	yAxisPoints: number[];
	xAxisPoints: number[];
	calPoints: ChartOptionsChartDataCalPoints[][][];
	eachSpacing: number;
};
export class ChartMapBounds {
	xMin: number = 180;
	xMax: number = 0;
	yMin: number = 90;
	yMax: number = 0;
}
export class ChartOptionsExtraTooltip {
	showBox: boolean = true;
	showArrow: boolean = true;
	showCategory: boolean = false;
	borderWidth: number = 0;
	borderRadius: number = 0;
	borderColor: string = "#000000";
	borderOpacity: number = 0.7;
	bgColor: string = "#000000";
	bgOpacity: number = 0.7;
	gridType: "solid" | "dash" = "solid";
	dashLength: number = 4;
	gridColor: string = "#CCCCCC";
	boxPadding: number = 3;
	fontSize: number = 13;
	lineHeight: number = 20;
	fontColor: string = "#FFFFFF";
	legendShow: boolean = true;
	legendShape: "auto" | "diamond" | "circle" | "triangle" | "square" | "rect" | "line" = "auto";
	splitLine: boolean = true;
	horizentalLine: boolean = false;
	xAxisLabel: boolean = false;
	yAxisLabel: boolean = false;
	labelBgColor: string = "#FFFFFF";
	labelBgOpacity: number = 0.7;
	labelFontColor: string = "#666666";
}

export class ChartOptionsExtraMarkLineData {
	value: number | null = null;
	labelText: string | null = null;
	lineColor: string = "#DE4A42";
	showLabel: boolean = false;
	labelAlign: "left" | "right" | "top" | "bottom" = "left";
	labelOffsetX: number = 0;
	labelOffsetY: number = 0;
	labelPadding: number = 6;
	labelFontSize: number = 13;
	labelFontColor: string = "#666666";
	labelBgColor: string = "#DFE8FF";
	labelBgOpacity: number = 0.8;
	yAxisIndex: number | null = null;
	y: number | null = null;
}

export class ChartOptionsExtraMarkLine {
	type: "solid" | "dash" = "solid";
	dashLength: number = 4;
	data: ChartOptionsExtraMarkLineData[] = [];
}

export class ChartOptionsExtraColumn {
	type: "group" | "stack" | "meter" = "group";
	width: number = 0;
	seriesGap: number = 2;
	categoryGap: number = 0;
	barBorderCircle: boolean = false;
	barBorderRadius: number[] = [];
	linearType: "none" | "opacity" | "custom" = "none";
	linearOpacity: number = 1;
	customColor: string[] = [];
	colorStop: number = 0;
	meterBorder: number = 4;
	meterFillColor: string = "#FFFFFF";
	activeBgColor: string = "#000000";
	activeBgOpacity: number = 0.08;
	activeWidth: number = -1;
	labelPosition: "outside" | "insideTop" | "center" | "bottom" = "outside";
}

export class ChartOptionsExtraMount {
	type: "mount" | "sharp" | "triangle" | "bar" = "mount";
	widthRatio: number = 1;
	borderWidth: number = 1;
	barBorderCircle: boolean = false;
	barBorderRadius: number[] = [];
	linearType: "none" | "opacity" | "custom" = "none";
	linearOpacity: number = 1;
	customColor: string[] = [];
	colorStop: number = 0;
}
export class ChartOptionsExtraBar {
	type: "group" | "stack" = "group";
	width: number | null = null;
	seriesGap: number = 2;
	categoryGap: number = 3;
	barBorderCircle: boolean = false;
	barBorderRadius: number[] | null = null;
	linearType: "none" | "opacity" | "custom" = "none";
	linearOpacity: number = 1;
	customColor: string[] | null = null;
	colorStop: number = 0;
	activeBgColor: string = "#000000";
	activeBgOpacity: number = 0.08;
}

export class ChartOptionsExtraLine {
	type: "straight" | "curve" | "step" = "straight";
	width: number = 2;
	activeType: "none" | "hollow" | "solid" = "none";
	linearType: "none" | "custom" = "none";
	onShadow: boolean = false;
	animation: "vertical" | "horizontal" = "vertical";
}
export class ChartOptionsExtraArea {
	type: "straight" | "curve" | "step" = "straight";
	opacity: number = 0.2;
	addLine: boolean = true;
	width: number = 2;
	gradient: boolean = false;
	activeType: "none" | "hollow" | "solid" = "none";
}
export class ChartOptionsExtraScatter {
	id: string | null = null;
}
export class ChartOptionsExtraBubble {
	border: number = 2;
	opacity: number = 0.5;
}
export class ChartOptionsExtraMixColumn {
	width: number | null = null;
	seriesGap: number | null = null;
	categoryGap: number | null = null;
	barBorderCircle: boolean = false;
	barBorderRadius: number[] | null = null;
	linearType: "none" | "opacity" | "custom" = "none";
	linearOpacity: number = 1;
	customColor: string[] | null = null;
	colorStop: number | null = null;
}
export class ChartOptionsExtraMixArea {
	gradient: boolean = false;
	opacity: number = 0.2;
}
export class ChartOptionsExtraMixLine {
	width: number = 2;
}

export class ChartOptionsExtraMix {
	column: ChartOptionsExtraMixColumn | null = null;
	area: ChartOptionsExtraMixArea | null = null;
	line: ChartOptionsExtraMixLine | null = null;
}

export class ChartOptionsExtraPie {
	activeOpacity: number = 0.5;
	activeRadius: number = 10;
	offsetAngle: number | null = null;
	customRadius: number | null = null;
	labelWidth: number = 15;
	border: boolean = true;
	borderWidth: number = 2;
	borderColor: string = "#FFFFFF";
	linearType: "none" | "custom" = "none";
	customColor: string[] | null = null;
}
export class ChartOptionsExtraRing {
	ringWidth: number = 30;
	centerColor: string = "#FFFFFF";
	activeOpacity: number = 0.5;
	activeRadius: number = 10;
	offsetAngle: number | null = null;
	customRadius: number | null = null;
	labelWidth: number = 15;
	border: boolean = true;
	borderWidth: number = 2;
	borderColor: string = "#FFFFFF";
	linearType: "none" | "custom" = "none";
	customColor: string[] | null = null;
}
export class ChartOptionsExtraRose {
	type: "area" | "radius" = "area";
	minRadius: number | null = null;
	activeOpacity: number = 0.5;
	activeRadius: number = 10;
	offsetAngle: number | null = null;
	labelWidth: number = 15;
	border: boolean = true;
	borderWidth: number = 2;
	borderColor: string = "#FFFFFF";
	linearType: "none" | "custom" = "none";
	customColor: string[] | null = null;
}
export class ChartOptionsExtraRadar {
	gridType: "radar" | "circle" = "radar";
	gridColor: string = "#CCCCCC";
	gridCount: number = 3;
	gridEval: number = 1;
	radius: number | null = null;
	axisLabel: boolean = false;
	axisLabelTofix: number = 0;
	labelShow: boolean = true;
	labelColor: string = "#666666";
	labelPointShow: boolean = false;
	labelPointRadius: number = 3;
	labelPointColor: string = "#CCCCCC";
	opacity: number = 0.2;
	border: boolean = false;
	borderWidth: number = 2;
	max: number | null = null;
	linearType: "none" | "custom" = "none";
	customColor: string[] | null = null;
}
export class ChartOptionsExtraArcbar {
	type: "default" | "circle" = "default";
	direction: "cw" | "ccw" = "cw";
	width: number = 12;
	lineCap: "round" | "square" | "butt" = "round";
	backgroundColor: string = "#E9E9E9";
	startAngle: number = 0.75;
	endAngle: number = 0.25;
	radius: number | null = null;
	gap: number = 2;
	centerX: number | null = null;
	centerY: number | null = null;
	linearType: "none" | "custom" = "none";
	customColor: string[] | null = null;
}
export class ChartOptionsExtraGaugeSplitLine {
	fixRadius: number | null = null;
	splitNumber: number = 10;
	width: number = 15;
	color: string = "#FFFFFF";
	childNumber: number = 5;
	childWidth: number = 5;
}
export class ChartOptionsExtraGaugePointer {
	width: number = 15;
	color: string = "auto";
}
export class ChartOptionsExtraGauge {
	type: string = "default";
	width: number = 15;
	labelColor: string = "#666666";
	labelOffset: number = 13;
	startAngle: number = 0.75;
	endAngle: number = 0.25;
	startNumber: number | null = null;
	endNumber: number = 100;
	formatter?: any = null;
	format: string | null = null;
	splitLine: ChartOptionsExtraGaugeSplitLine | null = null;
	pointer: ChartOptionsExtraGaugePointer | null = null;
	oldAngle: number | null = null;
	oldData: number | null = null;
}
export class ChartOptionsExtraFunnel {
	type: "funnel" | "triangle" | "pyramid" = "funnel";
	activeOpacity: number = 0.3;
	activeWidth: number = 10;
	border: boolean = true;
	borderWidth: number = 2;
	borderColor: string = "#FFFFFF";
	fillOpacity: number = 1;
	minSize: number = 0;
	labelAlign: "right" | "left" = "right";
	linearType: "none" | "custom" = "none";
	customColor: string[] | null = null;
}

export class ChartOptionsExtraWord {
	type: "normal" | "vertical" = "normal";
	autoColors: boolean = true;
}
export class ChartOptionsExtraCandleColor {
	upLine: string = "#f04864";
	upFill: string = "#f04864";
	downLine: string = "#2fc25b";
	downFill: string = "#2fc25b";
}
export class ChartOptionsExtraCandleAverage {
	show: boolean = true;
	name: string[] | null = null;
	day: number[] | null = null;
	color: string[] | null = null;
}
export class ChartOptionsExtraCandle {
	color: ChartOptionsExtraCandleColor = new ChartOptionsExtraCandleColor();
	average: ChartOptionsExtraCandleAverage = new ChartOptionsExtraCandleAverage();
}

export class ChartOptionsExtraMap {
	border: boolean = true;
	mercator: boolean = false;
	borderWidth: number = 2;
	borderColor: string = "#666666";
	fillOpacity: number = 0.6;
	active: boolean = true;
	activeTextColor: string = "#FFFFFF";
	activeBorderColor: string = "#F04864";
	activeFillColor: string = "#FACC14";
	activeFillOpacity: number = 1;
}

export class ChartOptionsExtra {
	tooltip: ChartOptionsExtraTooltip | null = null;
	markLine: ChartOptionsExtraMarkLine | null = null;
	column: ChartOptionsExtraColumn | null = null;
	mount: ChartOptionsExtraMount | null = null;
	bar: ChartOptionsExtraBar | null = null;
	line: ChartOptionsExtraLine | null = null;
	area: ChartOptionsExtraArea | null = null;
	scatter: ChartOptionsExtraScatter | null = null;
	bubble: ChartOptionsExtraBubble | null = null;
	mix: ChartOptionsExtraMix | null = null;
	pie: ChartOptionsExtraPie | null = null;
	ring: ChartOptionsExtraRing | null = null;
	rose: ChartOptionsExtraRose | null = null;
	radar: ChartOptionsExtraRadar | null = null;
	arcbar: ChartOptionsExtraArcbar | null = null;
	gauge: ChartOptionsExtraGauge | null = null;
	funnel: ChartOptionsExtraFunnel | null = null;
	word: ChartOptionsExtraWord | null = null;
	candle: ChartOptionsExtraCandle | null = null;
	map: ChartOptionsExtraMap | null = null;
}

export class ChartOptionsTitle {
	name: string | null = null;
	fontSize: number = 18;
	color: string = "#666666";
	offsetX: number | null = null;
	offsetY: number | null = null;
}
export class ChartOptionsSubTitle {
	name: string | null = null;
	fontSize: number = 12;
	color: string = "#7cb5ec";
	offsetX: number | null = null;
	offsetY: number | null = null;
}
export class ChartOptionsLegend {
	show: boolean = true;
	position: "bottom" | "top" | "left" | "right" = "bottom";
	float: "center" | "left" | "right" | "top" | "bottom" = "center";
	padding: number = 5;
	margin: number = 5;
	backgroundColor: string = "rgba(0,0,0,0)";
	borderColor: string = "rgba(0,0,0,0)";
	borderWidth?: number = 0;
	fontSize: number = 13;
	fontColor: string = "#666666";
	lineHeight: number = 11;
	hiddenColor: string = "#CECECE";
	itemGap: number = 10;
}

export class ChartOptionsYAxisData {
	type: string | null = null;
	position: "left" | "right" | "center" = "left";
	disabled: boolean = false;
	axisLine: boolean = true;
	axisLineColor: string = "#CCCCCC";
	calibration: boolean = false;
	fontColor: string = "#666666";
	fontSize: number | null = null;
	textAlign: "left" | "right" | "center" = "right";
	title: string | null = null;
	titleFontSize: number | null = null;
	titleOffsetY: number | null = null;
	titleOffsetX: number | null = null;
	titleFontColor: string = "#666666";
	min: number | null = null;
	max: number | null = null;
	tofix: number | null = null;
	unit: string | null = null;
	formatter?: any = null;
	format: string | null = null;
	categories: string[] | null = null;
}

export class ChartOptionsYAxis {
	disabled: boolean = false;
	disableGrid: boolean = false;
	splitNumber: number = 5;
	gridType: "solid" | "dash" = "solid";
	dashLength: number = 8;
	gridColor: string = "#CCCCCC";
	padding: number = 10;
	showTitle: boolean = false;
	data: ChartOptionsYAxisData[] = [];
	gridSet: string = "number";
	fontColor: string = "#666666";
	tofix: number = 0;
	unit: string = "";
	fontSize: number | null = null;
	formatter?: any = null;
	min: number | null = null;
	max: number | null = null;
}

export class ChartOptionsXAxis {
	disabled: boolean = false;
	axisLine: boolean = true;
	axisLineColor: string = "#CCCCCC";
	calibration: boolean = false;
	fontColor: string = "#666666";
	fontSize: number = 13;
	lineHeight: number = 20;
	marginTop: number = 0;
	rotateLabel: boolean = false;
	rotateAngle: number = 45;
	labelCount: number | null = null;
	itemCount: number = 5;
	boundaryGap: "center" | "justify" = "center";
	disableGrid: boolean = true;
	splitNumber?: number = 5;
	gridColor: string = "#CCCCCC";
	gridType: "solid" | "dash" = "solid";
	dashLength: number = 4;
	gridEval: number = 1;
	scrollShow: boolean = false;
	scrollAlign: "left" | "right" = "left";
	scrollColor: string = "#A6A6A6";
	scrollBackgroundColor: string = "#EFEBEF";
	min: number | null = null;
	max: number | null = null;
	title: string | null = null;
	titleFontSize: number = 13;
	titleOffsetY: number = 0;
	titleOffsetX: number = 0;
	titleFontColor: string = "#666666";
	formatter?: any = null;
	format: string | null = null;
	scrollPosition: string | null = null;
	data: ChartOptionsYAxisData[] = [];
}

export class ChartOptionsSeriesData {
	value: number | null = null;
	color: string | null = null;
	name: string | null = null;
	data: number | null = null;
	labelText: string | null = null;
	labelShow: boolean = true;
	centerText: string | null = null;
	centerTextSize: number | null = null;
	centerTextColor: string = "#FFFFFF";
	formatter?: any = null;
	position: ChartOptionsChartDataCalPoints = new ChartOptionsChartDataCalPoints();
	angle: number = 0;
	proportion: number = 0;
	textColor: string = "#666666";
	textSize: number | null = null;
	_startAngle_: number = 0;
	_endAngle_: number = 0;
}
//Map相关
export class ChartOptionsMapSeriesPropertiesParent {
	adcode: number = 0;
}

export class ChartOptionsMapSeriesProperties {
	adcode: number = 0;
	name: string = "";
	center: number[] = [];
	centroid: number[] = [];
	childrenNum: number = 0;
	level: string = "";
	subFeatureIndex: number = 0;
	acroutes: number[] = [];
	parent: ChartOptionsMapSeriesPropertiesParent = new ChartOptionsMapSeriesPropertiesParent();
}

export class ChartOptionsMapSeriesGeometry {
	type: string = "";
	coordinates: number[][][][] = [];
}

export class ChartOptionsSeries {
	_data: number[] | null = null;
	zeroPoints: number | null = null;
	area: number[] | null = null;
	index: number | null = null;
	name: string | null = null;
	legendText: string | null = null;
	data: ChartOptionsSeriesData[] | null = null;
	dataArr: number[][] = [];
	show: boolean = true;
	color: string | null = null;
	fillOpacity: number = 0.8;
	textColor: string = "#666666";
	textSize: number | null = null;
	textOffset: number | null = null;
	linearIndex: number | null = null;
	type: string | null = null;
	disableLegend: boolean = false;
	connectNulls: boolean = false;
	setShadow: string[] | null = null;
	linearColor: string[][] | null = null;
	style: "curve" | "straight" = "straight";
	addPoint: boolean = false;
	lineType: "solid" | "dash" = "solid";
	dashLength: number = 8;
	pointShape: "diamond" | "circle" | "triangle" | "square" | "none" = "circle";
	legendShape: "diamond" | "circle" | "triangle" | "square" | "rect" | "line" | "none" | null =
		null;
	formatter?: any = null;
	format: string | null = null;
	rotate: boolean = false;
	seriesMA: ChartOptionsSeries[] | null = null;
	_radius_: number = 0;
	_start_: number = 0;
	_proportion_: number = 0;
	_rose_proportion_: number = 0;
	areav: number[] = [];
	radius: number = 0;
	funnelArea: number[] = [];
	labelShow: boolean = true;
	labelText: string | null = null;
	centerTextColor: string = "#FFFFFF";
	arc: number = 0;
	text: string = "";
	properties: ChartOptionsMapSeriesProperties = new ChartOptionsMapSeriesProperties();
	geometry: ChartOptionsMapSeriesGeometry = new ChartOptionsMapSeriesGeometry();
	_endAngle_: number = 0;
	_oldAngle_: number = 0;
}

export class ChartOptionsChartDataLegendDataAreaXY {
	x: number = 0;
	y: number = 0;
}

export class ChartOptionsChartDataLegendDataArea {
	start: ChartOptionsChartDataLegendDataAreaXY = new ChartOptionsChartDataLegendDataAreaXY();
	end: ChartOptionsChartDataLegendDataAreaXY = new ChartOptionsChartDataLegendDataAreaXY();
	lineStart: ChartOptionsChartDataLegendDataAreaXY = new ChartOptionsChartDataLegendDataAreaXY();
	lineEnd: ChartOptionsChartDataLegendDataAreaXY = new ChartOptionsChartDataLegendDataAreaXY();
	width: number = 0;
	height: number = 0;
	wholeWidth: number = 0;
	wholeHeight: number = 0;
	text: string = "";
	color: string = "";
	textColor: string = "";
	textSize: number = 13;
}

export class ChartOptionsChartDataLegendData {
	area: ChartOptionsChartDataLegendDataArea = new ChartOptionsChartDataLegendDataArea();
	points: ChartOptionsSeries[][] = [];
	widthArr: number[] = [];
	heightArr: number[] = [];
}

export class ChartOptionsChartDataYAxisDataYAxisWidth {
	position: string = "left";
	width: number = 0;
}

export class ChartOptionsChartDataYAxisData {
	rangesFormat: string[][] | null = null;
	ranges: string[][] | null = null;
	yAxisWidth: ChartOptionsChartDataYAxisDataYAxisWidth[] | null = null;
}

export class ChartOptionsChartDataXAxisData {
	xAxisPoints: number[] = [];
	startX: number | null = null;
	endX: number | null = null;
	eachSpacing: number | null = null;
	ranges: number[] | null = null;
	angle: number = 0;
	xAxisHeight: number = 0;
	rangesFormat: number[] = [];
}

export class ChartOptionsChartDataCategoriesData {
	angle: number = 0;
	xAxisHeight: number = 0;
}

export class ChartOptionsChartDataCalPoints {
	color: string | null = null;
	x: number = 0;
	y: number = 0;
	y0: number = 0;
	x0: number = 0;
	r: number = 0;
	t: number = 0;
	width?: number = 0;
	height?: number = 0;
	value: number = 0;
}

export class ChartOptionsChartDataToolTiPData {
	center: Offset = new Offset();
	radius: number = 0;
	series: ChartOptionsSeries[] = [];
	angleList: number[] = [];
	innerRadius: number = 0;
	categories: ChartOptionsSeriesData[] = [];
	totalAngle: number = 0;
}
export class ChartOptionsChartDataMapData {
	bounds: ChartMapBounds = new ChartMapBounds();
	scale: number = 0;
	xoffset: number = 0;
	yoffset: number = 0;
	mercator: boolean = false;
}
export class ChartOptionsChartData {
	legendData: ChartOptionsChartDataLegendData = new ChartOptionsChartDataLegendData();
	yAxisData: ChartOptionsChartDataYAxisData = new ChartOptionsChartDataYAxisData();
	xAxisData: ChartOptionsChartDataXAxisData = new ChartOptionsChartDataXAxisData();
	categoriesData: ChartOptionsChartDataCategoriesData = new ChartOptionsChartDataCategoriesData();
	xAxisPoints: number[] | null = null;
	yAxisPoints: number[] | null = null;
	calPoints: ChartOptionsChartDataCalPoints[][] | null = null;
	calMapPoints: ChartOptionsChartDataCalPoints[][][] | null = null;
	eachSpacing: number = 0;
	pieData: ChartOptionsChartDataToolTiPData | null = null;
	radarData: ChartOptionsChartDataToolTiPData | null = null;
	funnelData: ChartOptionsChartDataToolTiPData | null = null;
	arcbarData: ChartOptionsChartDataToolTiPData | null = null;
	gaugeData: ChartOptionsChartDataToolTiPData | null = null;
	wordCloudData: ChartOptionsSeries[] | null = null;
	mapData: ChartOptionsChartDataMapData | null = null;
}

export class TextList {
	text: string = "";
	color: string = "";
	legendShape: string = "";
	disableLegend: boolean = false;
}

export class ChartOptionsTooltipOption {
	index: number | null = null;
	offset: Offset | null = null;
	textList: TextList[] | null = null;
	formatter?: any = null;
}

export class ChartOptionsTooltip {
	textList: TextList[] = [];
	offset: Offset = new Offset();
	option: ChartOptionsTooltipOption = new ChartOptionsTooltipOption();
	index?: any = null;
	group: number[] = [];
}
export class ChartOptions {
	type: string = "column";
	context: CanvasRenderingContext2D | null = null;
	canvasContext: CanvasContext | null = null;
	width: number = 320;
	height: number = 200;
	categories: string[] | null = null;
	categoriesObj: ChartOptionsSeriesData[] | null = null;
	series: ChartOptionsSeries[] | null = null;
	_series_: ChartOptionsSeries[] | null = null;
	area: number[] = [];
	xAxis: ChartOptionsXAxis = new ChartOptionsXAxis();
	yAxis: ChartOptionsYAxis = new ChartOptionsYAxis();
	legend: ChartOptionsLegend = new ChartOptionsLegend();
	title: ChartOptionsTitle = new ChartOptionsTitle();
	subtitle: ChartOptionsSubTitle = new ChartOptionsSubTitle();
	extra: ChartOptionsExtra = new ChartOptionsExtra();
	chartData: ChartOptionsChartData = new ChartOptionsChartData();
	tooltip: ChartOptionsTooltip | null = null;
	showTooltip: boolean = false;
	canvas2d: boolean = true;
	pixelRatio: number = 1;
	animation: boolean = false;
	timing: "easeOut" | "easeIn" | "easeInOut" | "linear" = "easeOut";
	duration: number = 1000;
	rotate: boolean = false;
	rotateLock: boolean = false;
	background: string = "rgba(255,255,255,1)";
	color: string[] | null = null;
	padding: number[] | null = null;
	fontSize: number = 13;
	fontColor: string = "#666666";
	dataLabel: boolean = true;
	dataPointShape: boolean = true;
	dataPointShapeType: "solid" | "hollow" = "solid";
	touchMoveLimit: number = 30;
	enableScroll: boolean = false;
	enableMarkLine: boolean = false;
	scrollPosition: "current" | "left" | "right" = "current";
	_scrollDistance_: number | null = null;
	_rotate_: boolean = false;
	updateData: boolean = false;
	seriesMA: ChartOptionsSeries[] | null = null;
	yOffset: number = 0; //基础偏移座标用于一个canvas绘制多个图表
	xOffset: number = 0; //基础偏移座标用于一个canvas绘制多个图表
	DOMRect: DOMRect | null = null;
	tapLegend: boolean = true; //底部目标完成量手势相关事件
}

export interface TuiChartsInterface {
	opts: ChartOptions;
	context: CanvasRenderingContext2D;
	uevent: TuiChartsEvent;
	config: TuiChartConfig;
	scrollOption: ChartScrollOption;
	animationInstance: Animation | null;
	offsetWidth: number;
	offsetHeight: number;
	update(data: UTSJSONObject): void;
	zoom(e: ChartOptionsXAxis | null): void;
	dobuleZoom(e: UniTouchEvent): void;
	getLegendDataIndex(e: UniEvent): number;
	touchLegend(e: UniEvent): number;
	scrollStart(e: UniEvent): void;
	scroll(e: UniEvent): void;
	scrollEnd(e: UniEvent): void;
	showToolTip(...args: any[]): number;
	getCurrentDataIndex(e: UniEvent): ChartOptionsTooltip;
}
