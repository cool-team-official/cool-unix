import { get, isNull } from "./common";
import {
	ChartOptionsExtraGaugeSplitLine,
	ChartOptionsExtra,
	ChartOptionsExtraArcbar,
	ChartOptionsExtraArea,
	ChartOptionsExtraBar,
	ChartOptionsExtraBubble,
	ChartOptionsExtraColumn,
	ChartOptionsExtraGauge,
	ChartOptionsExtraLine,
	ChartOptionsExtraMarkLine,
	ChartOptionsExtraMarkLineData,
	ChartOptionsExtraMix,
	ChartOptionsExtraMount,
	ChartOptionsExtraPie,
	ChartOptionsExtraRadar,
	ChartOptionsExtraRing,
	ChartOptionsExtraRose,
	ChartOptionsExtraScatter,
	ChartOptionsExtraTooltip,
	ChartOptionsExtraGaugePointer,
	ChartOptionsExtraFunnel,
	ChartOptionsExtraWord,
	ChartOptionsExtraCandle,
	ChartOptionsExtraCandleColor,
	ChartOptionsExtraCandleAverage,
	ChartOptionsExtraMap,
	ChartOptionsExtraMixColumn,
	ChartOptionsExtraMixArea,
	ChartOptionsExtraMixLine
} from "./type";

export function extraColumnInit(e: UTSJSONObject): ChartOptionsExtraColumn {
	const extra_column = new ChartOptionsExtraColumn();
	if (!isNull(e.type)) extra_column.type = get(e, "type") as "group" | "stack" | "meter";
	if (!isNull(e.width)) extra_column.width = get(e, "width") as number;
	if (!isNull(e.seriesGap)) extra_column.seriesGap = get(e, "seriesGap") as number;
	if (!isNull(e.categoryGap)) extra_column.categoryGap = get(e, "categoryGap") as number;
	if (!isNull(e.barBorderCircle))
		extra_column.barBorderCircle = get(e, "barBorderCircle") as boolean;
	if (!isNull(e.barBorderRadius))
		extra_column.barBorderRadius = get(e, "barBorderRadius") as number[];
	if (!isNull(e.linearType))
		extra_column.linearType = get(e, "linearType") as "none" | "opacity" | "custom";
	if (!isNull(e.linearOpacity)) extra_column.linearOpacity = get(e, "linearOpacity") as number;
	if (!isNull(e.customColor)) extra_column.customColor = get(e, "customColor") as string[];
	if (!isNull(e.colorStop)) extra_column.colorStop = get(e, "colorStop") as number;
	if (!isNull(e.meterBorder)) extra_column.meterBorder = get(e, "meterBorder") as number;
	if (!isNull(e.meterFillColor)) extra_column.meterFillColor = get(e, "meterFillColor") as string;
	if (!isNull(e.activeBgColor)) extra_column.activeBgColor = get(e, "activeBgColor") as string;
	if (!isNull(e.activeBgOpacity))
		extra_column.activeBgOpacity = get(e, "activeBgOpacity") as number;
	if (!isNull(e.labelPosition))
		extra_column.labelPosition = get(e, "labelPosition") as
			| "outside"
			| "insideTop"
			| "center"
			| "bottom";
	return extra_column;
}

export function extraMarkLineDataInit(e: UTSJSONObject): ChartOptionsExtraMarkLineData {
	const extra_marklinedata = new ChartOptionsExtraMarkLineData();
	if (!isNull(e.value)) extra_marklinedata.value = get(e, "value") as number;
	if (!isNull(e.labelText)) extra_marklinedata.labelText = get(e, "labelText") as string;
	if (!isNull(e.lineColor)) extra_marklinedata.lineColor = get(e, "lineColor") as string;
	if (!isNull(e.showLabel)) extra_marklinedata.showLabel = get(e, "showLabel") as boolean;
	if (!isNull(e.labelAlign))
		extra_marklinedata.labelAlign = get(e, "labelAlign") as "left" | "right" | "top" | "bottom";
	if (!isNull(e.labelOffsetX)) extra_marklinedata.labelOffsetX = get(e, "labelOffsetX") as number;
	if (!isNull(e.labelOffsetY)) extra_marklinedata.labelOffsetY = get(e, "labelOffsetY") as number;
	if (!isNull(e.labelPadding)) extra_marklinedata.labelPadding = get(e, "labelPadding") as number;
	if (!isNull(e.labelFontSize))
		extra_marklinedata.labelFontSize = get(e, "labelFontSize") as number;
	if (!isNull(e.labelFontColor))
		extra_marklinedata.labelFontColor = get(e, "labelFontColor") as string;
	if (!isNull(e.labelBgColor)) extra_marklinedata.labelBgColor = get(e, "labelBgColor") as string;
	if (!isNull(e.labelBgOpacity))
		extra_marklinedata.labelBgOpacity = get(e, "labelBgOpacity") as number;
	if (!isNull(e.yAxisIndex)) extra_marklinedata.yAxisIndex = get(e, "yAxisIndex") as number;
	if (!isNull(e.y)) extra_marklinedata.y = get(e, "y") as number;
	return extra_marklinedata;
}

export function extraMarkLineInit(e: UTSJSONObject): ChartOptionsExtraMarkLine {
	const extra_markline = new ChartOptionsExtraMarkLine();
	if (!isNull(e.type)) extra_markline.type = get(e, "type") as "solid" | "dash";
	if (!isNull(e.dashLength)) extra_markline.dashLength = get(e, "dashLength") as number;
	if (!isNull(e.data)) {
		const markline_data: ChartOptionsExtraMarkLineData[] = [];
		const data = get(e, "data") as UTSJSONObject[];
		data.forEach((item: UTSJSONObject) => {
			markline_data.push(extraMarkLineDataInit(item));
		});
		extra_markline.data = markline_data;
	}
	return extra_markline;
}

export function extraTooltipInit(e: UTSJSONObject): ChartOptionsExtraTooltip {
	const extra_tooltip = new ChartOptionsExtraTooltip();
	if (!isNull(e.showBox)) extra_tooltip.showBox = get(e, "showBox") as boolean;
	if (!isNull(e.showArrow)) extra_tooltip.showArrow = get(e, "showArrow") as boolean;
	if (!isNull(e.showCategory)) extra_tooltip.showCategory = get(e, "showCategory") as boolean;
	if (!isNull(e.borderWidth)) extra_tooltip.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.borderRadius)) extra_tooltip.borderRadius = get(e, "borderRadius") as number;
	if (!isNull(e.borderColor)) extra_tooltip.borderColor = get(e, "borderColor") as string;
	if (!isNull(e.borderOpacity)) extra_tooltip.borderOpacity = get(e, "borderOpacity") as number;
	if (!isNull(e.bgColor)) extra_tooltip.bgColor = get(e, "bgColor") as string;
	if (!isNull(e.bgOpacity)) extra_tooltip.bgOpacity = get(e, "bgOpacity") as number;
	if (!isNull(e.gridType)) extra_tooltip.gridType = get(e, "gridType") as "solid" | "dash";
	if (!isNull(e.dashLength)) extra_tooltip.dashLength = get(e, "dashLength") as number;
	if (!isNull(e.gridColor)) extra_tooltip.gridColor = get(e, "gridColor") as string;
	if (!isNull(e.boxPadding)) extra_tooltip.boxPadding = get(e, "boxPadding") as number;
	if (!isNull(e.fontSize)) extra_tooltip.fontSize = get(e, "fontSize") as number;
	if (!isNull(e.lineHeight)) extra_tooltip.lineHeight = get(e, "lineHeight") as number;
	if (!isNull(e.fontColor)) extra_tooltip.fontColor = get(e, "fontColor") as string;
	if (!isNull(e.legendShow)) extra_tooltip.legendShow = get(e, "legendShow") as boolean;
	if (!isNull(e.legendShape))
		extra_tooltip.legendShape = get(e, "legendShape") as
			| "auto"
			| "diamond"
			| "circle"
			| "triangle"
			| "square"
			| "rect"
			| "line";
	if (!isNull(e.splitLine)) extra_tooltip.splitLine = get(e, "splitLine") as boolean;
	if (!isNull(e.horizentalLine))
		extra_tooltip.horizentalLine = get(e, "horizentalLine") as boolean;
	if (!isNull(e.xAxisLabel)) extra_tooltip.xAxisLabel = get(e, "xAxisLabel") as boolean;
	if (!isNull(e.yAxisLabel)) extra_tooltip.yAxisLabel = get(e, "yAxisLabel") as boolean;
	if (!isNull(e.labelBgColor)) extra_tooltip.labelBgColor = get(e, "labelBgColor") as string;
	if (!isNull(e.labelBgOpacity))
		extra_tooltip.labelBgOpacity = get(e, "labelBgOpacity") as number;
	if (!isNull(e.labelFontColor))
		extra_tooltip.labelFontColor = get(e, "labelFontColor") as string;
	return extra_tooltip;
}

export function extraMountInit(e: UTSJSONObject): ChartOptionsExtraMount {
	const extra_mount = new ChartOptionsExtraMount();
	if (!isNull(e.type))
		extra_mount.type = get(e, "type") as "mount" | "sharp" | "triangle" | "bar";
	if (!isNull(e.widthRatio)) extra_mount.widthRatio = get(e, "widthRatio") as number;
	if (!isNull(e.borderWidth)) extra_mount.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.barBorderCircle))
		extra_mount.barBorderCircle = get(e, "barBorderCircle") as boolean;
	if (!isNull(e.barBorderRadius))
		extra_mount.barBorderRadius = get(e, "barBorderRadius") as number[];
	if (!isNull(e.linearType))
		extra_mount.linearType = get(e, "linearType") as "none" | "opacity" | "custom";
	if (!isNull(e.linearOpacity)) extra_mount.linearOpacity = get(e, "linearOpacity") as number;
	if (!isNull(e.customColor)) extra_mount.customColor = get(e, "customColor") as string[];
	if (!isNull(e.colorStop)) extra_mount.colorStop = get(e, "colorStop") as number;
	return extra_mount;
}

export function extraBarInit(e: UTSJSONObject): ChartOptionsExtraBar {
	const extraBar = new ChartOptionsExtraBar();
	if (!isNull(e.type)) extraBar.type = get(e, "type") as "group" | "stack";
	if (!isNull(e.width)) extraBar.width = get(e, "width") as number;
	if (!isNull(e.seriesGap)) extraBar.seriesGap = get(e, "seriesGap") as number;
	if (!isNull(e.categoryGap)) extraBar.categoryGap = get(e, "categoryGap") as number;
	if (!isNull(e.barBorderCircle)) extraBar.barBorderCircle = get(e, "barBorderCircle") as boolean;
	if (!isNull(e.barBorderRadius))
		extraBar.barBorderRadius = get(e, "barBorderRadius") as number[];
	if (!isNull(e.linearType))
		extraBar.linearType = get(e, "linearType") as "none" | "opacity" | "custom";
	if (!isNull(e.linearOpacity)) extraBar.linearOpacity = get(e, "linearOpacity") as number;
	if (!isNull(e.customColor)) extraBar.customColor = get(e, "customColor") as string[];
	if (!isNull(e.colorStop)) extraBar.colorStop = get(e, "colorStop") as number;
	if (!isNull(e.activeBgColor)) extraBar.activeBgColor = get(e, "activeBgColor") as string;
	if (!isNull(e.activeBgOpacity)) extraBar.activeBgOpacity = get(e, "activeBgOpacity") as number;
	return extraBar;
}

export function extraLineInit(e: UTSJSONObject): ChartOptionsExtraLine {
	const extraLine = new ChartOptionsExtraLine();
	if (!isNull(e.type)) extraLine.type = get(e, "type") as "straight" | "curve" | "step";
	if (!isNull(e.width)) extraLine.width = get(e, "width") as number;
	if (!isNull(e.activeType))
		extraLine.activeType = get(e, "activeType") as "none" | "hollow" | "solid";
	if (!isNull(e.linearType)) extraLine.linearType = get(e, "linearType") as "none" | "custom";
	if (!isNull(e.onShadow)) extraLine.onShadow = get(e, "onShadow") as boolean;
	if (!isNull(e.animation))
		extraLine.animation = get(e, "animation") as "vertical" | "horizontal";
	return extraLine;
}

export function extraAreaInit(e: UTSJSONObject): ChartOptionsExtraArea {
	const extraArea = new ChartOptionsExtraArea();
	if (!isNull(e.type)) extraArea.type = get(e, "type") as "straight" | "curve" | "step";
	if (!isNull(e.opacity)) extraArea.opacity = get(e, "opacity") as number;
	if (!isNull(e.addLine)) extraArea.addLine = get(e, "addLine") as boolean;
	if (!isNull(e.width)) extraArea.width = get(e, "width") as number;
	if (!isNull(e.gradient)) extraArea.gradient = get(e, "gradient") as boolean;
	if (!isNull(e.activeType))
		extraArea.activeType = get(e, "activeType") as "none" | "hollow" | "solid";
	return extraArea;
}

export function extraPieInit(e: UTSJSONObject): ChartOptionsExtraPie {
	const extraPie = new ChartOptionsExtraPie();
	if (!isNull(e.activeOpacity)) extraPie.activeOpacity = get(e, "activeOpacity") as number;
	if (!isNull(e.activeRadius)) extraPie.activeRadius = get(e, "activeRadius") as number;
	if (!isNull(e.offsetAngle)) extraPie.offsetAngle = get(e, "offsetAngle") as number;
	if (!isNull(e.customRadius)) extraPie.customRadius = get(e, "customRadius") as number;
	if (!isNull(e.labelWidth)) extraPie.labelWidth = get(e, "labelWidth") as number;
	if (!isNull(e.border)) extraPie.border = get(e, "border") as boolean;
	if (!isNull(e.borderWidth)) extraPie.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.borderColor)) extraPie.borderColor = get(e, "borderColor") as string;
	if (!isNull(e.linearType)) extraPie.linearType = get(e, "linearType") as "none" | "custom";
	if (!isNull(e.customColor)) extraPie.customColor = get(e, "customColor") as string[];
	return extraPie;
}

export function extraRingInit(e: UTSJSONObject): ChartOptionsExtraRing {
	const extraRing = new ChartOptionsExtraRing();
	if (!isNull(e.ringWidth)) extraRing.ringWidth = get(e, "ringWidth") as number;
	if (!isNull(e.centerColor)) extraRing.centerColor = get(e, "centerColor") as string;
	if (!isNull(e.activeOpacity)) extraRing.activeOpacity = get(e, "activeOpacity") as number;
	if (!isNull(e.activeRadius)) extraRing.activeRadius = get(e, "activeRadius") as number;
	if (!isNull(e.offsetAngle)) extraRing.offsetAngle = get(e, "offsetAngle") as number;
	if (!isNull(e.customRadius)) extraRing.customRadius = get(e, "customRadius") as number;
	if (!isNull(e.labelWidth)) extraRing.labelWidth = get(e, "labelWidth") as number;
	if (!isNull(e.border)) extraRing.border = get(e, "border") as boolean;
	if (!isNull(e.borderWidth)) extraRing.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.borderColor)) extraRing.borderColor = get(e, "borderColor") as string;
	if (!isNull(e.linearType)) extraRing.linearType = get(e, "linearType") as "none" | "custom";
	if (!isNull(e.customColor)) extraRing.customColor = get(e, "customColor") as string[];
	return extraRing;
}
export function extraRoseInit(e: UTSJSONObject): ChartOptionsExtraRose {
	const extraRose = new ChartOptionsExtraRose();
	if (!isNull(e.type)) extraRose.type = get(e, "type") as "area" | "radius";
	if (!isNull(e.minRadius)) extraRose.minRadius = get(e, "minRadius") as number;
	if (!isNull(e.activeOpacity)) extraRose.activeOpacity = get(e, "activeOpacity") as number;
	if (!isNull(e.activeRadius)) extraRose.activeRadius = get(e, "activeRadius") as number;
	if (!isNull(e.offsetAngle)) extraRose.offsetAngle = get(e, "offsetAngle") as number;
	if (!isNull(e.labelWidth)) extraRose.labelWidth = get(e, "labelWidth") as number;
	if (!isNull(e.border)) extraRose.border = get(e, "border") as boolean;
	if (!isNull(e.borderWidth)) extraRose.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.borderColor)) extraRose.borderColor = get(e, "borderColor") as string;
	if (!isNull(e.linearType)) extraRose.linearType = get(e, "linearType") as "none" | "custom";
	if (!isNull(e.customColor)) extraRose.customColor = get(e, "customColor") as string[];
	return extraRose;
}

export function extraScatterInit(e: UTSJSONObject): ChartOptionsExtraScatter {
	const extraScatter = new ChartOptionsExtraScatter();
	if (!isNull(e.id)) extraScatter.id = get(e, "id") as string;
	return extraScatter;
}

export function extraBubbleInit(e: UTSJSONObject): ChartOptionsExtraBubble {
	const extraBubble = new ChartOptionsExtraBubble();
	if (!isNull(e.border)) extraBubble.border = get(e, "border") as number;
	if (!isNull(e.opacity)) extraBubble.opacity = get(e, "opacity") as number;
	return extraBubble;
}

export function extraMixColumnInit(e: UTSJSONObject): ChartOptionsExtraMixColumn {
	const extraMixColumn = new ChartOptionsExtraMixColumn();
	if (!isNull(e.width)) extraMixColumn.width = get(e, "width") as number;
	if (!isNull(e.seriesGap)) extraMixColumn.seriesGap = get(e, "seriesGap") as number;
	if (!isNull(e.categoryGap)) extraMixColumn.categoryGap = get(e, "categoryGap") as number;
	if (!isNull(e.barBorderCircle))
		extraMixColumn.barBorderCircle = get(e, "barBorderCircle") as boolean;
	if (!isNull(e.barBorderRadius))
		extraMixColumn.barBorderRadius = get(e, "barBorderRadius") as number[];
	if (!isNull(e.linearType))
		extraMixColumn.linearType = get(e, "linearType") as "none" | "opacity" | "custom";
	if (!isNull(e.linearOpacity)) extraMixColumn.linearOpacity = get(e, "linearOpacity") as number;
	if (!isNull(e.customColor)) extraMixColumn.customColor = get(e, "customColor") as string[];
	if (!isNull(e.colorStop)) extraMixColumn.colorStop = get(e, "colorStop") as number;
	return extraMixColumn;
}

export function extraMixAreaInit(e: UTSJSONObject): ChartOptionsExtraMixArea {
	const extraMixArea = new ChartOptionsExtraMixArea();
	if (!isNull(e.gradient)) extraMixArea.gradient = get(e, "gradient") as boolean;
	if (!isNull(e.opacity)) extraMixArea.opacity = get(e, "opacity") as number;
	return extraMixArea;
}

export function extraMixLineInit(e: UTSJSONObject): ChartOptionsExtraMixLine {
	const extraMixLine = new ChartOptionsExtraMixLine();
	if (!isNull(e.width)) extraMixLine.width = get(e, "width") as number;
	return extraMixLine;
}

export function extraMixInit(e: UTSJSONObject): ChartOptionsExtraMix {
	const extraMix = new ChartOptionsExtraMix();
	if (!isNull(e.column)) extraMix.column = extraMixColumnInit(get(e, "column") as UTSJSONObject);
	if (!isNull(e.area)) extraMix.area = extraMixAreaInit(get(e, "area") as UTSJSONObject);
	if (!isNull(e.line)) extraMix.line = extraMixLineInit(get(e, "line") as UTSJSONObject);
	return extraMix;
}

export function extraRadarInit(e: UTSJSONObject): ChartOptionsExtraRadar {
	const extraRadar = new ChartOptionsExtraRadar();
	if (!isNull(e.gridType)) extraRadar.gridType = get(e, "gridType") as "radar" | "circle";
	if (!isNull(e.gridColor)) extraRadar.gridColor = get(e, "gridColor") as string;
	if (!isNull(e.gridCount)) extraRadar.gridCount = get(e, "gridCount") as number;
	if (!isNull(e.gridEval)) extraRadar.gridEval = get(e, "gridEval") as number;
	if (!isNull(e.radius)) extraRadar.radius = get(e, "radius") as number;
	if (!isNull(e.axisLabel)) extraRadar.axisLabel = get(e, "axisLabel") as boolean;
	if (!isNull(e.axisLabelTofix)) extraRadar.axisLabelTofix = get(e, "axisLabelTofix") as number;
	if (!isNull(e.labelShow)) extraRadar.labelShow = get(e, "labelShow") as boolean;
	if (!isNull(e.labelColor)) extraRadar.labelColor = get(e, "labelColor") as string;
	if (!isNull(e.labelPointShow)) extraRadar.labelPointShow = get(e, "labelPointShow") as boolean;
	if (!isNull(e.labelPointRadius))
		extraRadar.labelPointRadius = get(e, "labelPointRadius") as number;
	if (!isNull(e.labelPointColor))
		extraRadar.labelPointColor = get(e, "labelPointColor") as string;
	if (!isNull(e.opacity)) extraRadar.opacity = get(e, "opacity") as number;
	if (!isNull(e.border)) extraRadar.border = get(e, "border") as boolean;
	if (!isNull(e.borderWidth)) extraRadar.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.max)) extraRadar.max = get(e, "max") as number;
	if (!isNull(e.linearType)) extraRadar.linearType = get(e, "linearType") as "none" | "custom";
	if (!isNull(e.customColor)) extraRadar.customColor = get(e, "customColor") as string[];
	return extraRadar;
}

export function extraArcbarInit(e: UTSJSONObject): ChartOptionsExtraArcbar {
	const extraArcbar = new ChartOptionsExtraArcbar();
	if (!isNull(e.type)) extraArcbar.type = get(e, "type") as "default" | "circle";
	if (!isNull(e.direction)) extraArcbar.direction = get(e, "direction") as "cw" | "ccw";
	if (!isNull(e.width)) extraArcbar.width = get(e, "width") as number;
	if (!isNull(e.lineCap)) extraArcbar.lineCap = get(e, "lineCap") as "round" | "square" | "butt";
	if (!isNull(e.backgroundColor))
		extraArcbar.backgroundColor = get(e, "backgroundColor") as string;
	if (!isNull(e.startAngle)) extraArcbar.startAngle = get(e, "startAngle") as number;
	if (!isNull(e.endAngle)) extraArcbar.endAngle = get(e, "endAngle") as number;
	if (!isNull(e.radius)) extraArcbar.radius = get(e, "radius") as number;
	if (!isNull(e.gap)) extraArcbar.gap = get(e, "gap") as number;
	if (!isNull(e.centerX)) extraArcbar.centerX = get(e, "centerX") as number;
	if (!isNull(e.centerY)) extraArcbar.centerY = get(e, "centerY") as number;
	if (!isNull(e.linearType)) extraArcbar.linearType = get(e, "linearType") as "none" | "custom";
	if (!isNull(e.customColor)) extraArcbar.customColor = get(e, "customColor") as string[];
	return extraArcbar;
}

export function extraGaugePointerInit(e: UTSJSONObject): ChartOptionsExtraGaugePointer {
	const extraGaugePointer = new ChartOptionsExtraGaugePointer();
	if (!isNull(e.width)) extraGaugePointer.width = get(e, "width") as number;
	if (!isNull(e.color)) extraGaugePointer.color = get(e, "color") as string;
	return extraGaugePointer;
}

export function extraGaugeSplitLineInit(e: UTSJSONObject): ChartOptionsExtraGaugeSplitLine {
	const extraGaugeSplitLine = new ChartOptionsExtraGaugeSplitLine();
	if (!isNull(e.fixRadius)) extraGaugeSplitLine.fixRadius = get(e, "fixRadius") as number;
	if (!isNull(e.splitNumber)) extraGaugeSplitLine.splitNumber = get(e, "splitNumber") as number;
	if (!isNull(e.width)) extraGaugeSplitLine.width = get(e, "width") as number;
	if (!isNull(e.color)) extraGaugeSplitLine.color = get(e, "color") as string;
	if (!isNull(e.childNumber)) extraGaugeSplitLine.childNumber = get(e, "childNumber") as number;
	if (!isNull(e.childWidth)) extraGaugeSplitLine.childWidth = get(e, "childWidth") as number;
	return extraGaugeSplitLine;
}

export function extraGaugeInit(e: UTSJSONObject): ChartOptionsExtraGauge {
	const extraGauge = new ChartOptionsExtraGauge();
	if (!isNull(e.type)) extraGauge.type = get(e, "type") as string;
	if (!isNull(e.width)) extraGauge.width = get(e, "width") as number;
	if (!isNull(e.labelColor)) extraGauge.labelColor = get(e, "labelColor") as string;
	if (!isNull(e.labelOffset)) extraGauge.labelOffset = get(e, "labelOffset") as number;
	if (!isNull(e.startAngle)) extraGauge.startAngle = get(e, "startAngle") as number;
	if (!isNull(e.endAngle)) extraGauge.endAngle = get(e, "endAngle") as number;
	if (!isNull(e.startNumber)) extraGauge.startNumber = get(e, "startNumber") as number;
	if (!isNull(e.endNumber)) extraGauge.endNumber = get(e, "endNumber") as number;
	if (!isNull(e.formatter)) extraGauge.formatter = get(e, "formatter") as any;
	if (!isNull(e.format)) extraGauge.format = get(e, "format") as string;
	if (!isNull(e.splitLine))
		extraGauge.splitLine = extraGaugeSplitLineInit(get(e, "splitLine") as UTSJSONObject);
	if (!isNull(e.pointer))
		extraGauge.pointer = extraGaugePointerInit(get(e, "pointer") as UTSJSONObject);
	return extraGauge;
}

export function extraFunnelInit(e: UTSJSONObject): ChartOptionsExtraFunnel {
	const extraFunnel = new ChartOptionsExtraFunnel();
	if (!isNull(e.type)) extraFunnel.type = get(e, "type") as "funnel" | "triangle" | "pyramid";
	if (!isNull(e.activeOpacity)) extraFunnel.activeOpacity = get(e, "activeOpacity") as number;
	if (!isNull(e.activeWidth)) extraFunnel.activeWidth = get(e, "activeWidth") as number;
	if (!isNull(e.border)) extraFunnel.border = get(e, "border") as boolean;
	if (!isNull(e.borderWidth)) extraFunnel.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.borderColor)) extraFunnel.borderColor = get(e, "borderColor") as string;
	if (!isNull(e.fillOpacity)) extraFunnel.fillOpacity = get(e, "fillOpacity") as number;
	if (!isNull(e.minSize)) extraFunnel.minSize = get(e, "minSize") as number;
	if (!isNull(e.labelAlign)) extraFunnel.labelAlign = get(e, "labelAlign") as "right" | "left";
	if (!isNull(e.linearType)) extraFunnel.linearType = get(e, "linearType") as "none" | "custom";
	if (!isNull(e.customColor)) extraFunnel.customColor = get(e, "customColor") as string[];
	return extraFunnel;
}

export function extraWordInit(e: UTSJSONObject): ChartOptionsExtraWord {
	const extraWord = new ChartOptionsExtraWord();
	if (!isNull(e.type)) extraWord.type = get(e, "type") as "normal" | "vertical";
	if (!isNull(e.autoColors)) extraWord.autoColors = get(e, "autoColors") as boolean;
	return extraWord;
}

export function extraCandleColorInit(e: UTSJSONObject): ChartOptionsExtraCandleColor {
	const extraCandleColor = new ChartOptionsExtraCandleColor();
	if (!isNull(e.upLine)) extraCandleColor.upLine = get(e, "upLine") as string;
	if (!isNull(e.upFill)) extraCandleColor.upFill = get(e, "upFill") as string;
	if (!isNull(e.downLine)) extraCandleColor.downLine = get(e, "downLine") as string;
	if (!isNull(e.downFill)) extraCandleColor.downFill = get(e, "downFill") as string;
	return extraCandleColor;
}

export function extraCandleAverageInit(e: UTSJSONObject): ChartOptionsExtraCandleAverage {
	const extraCandleAverage = new ChartOptionsExtraCandleAverage();
	if (!isNull(e.show)) extraCandleAverage.show = get(e, "show") as boolean;
	if (!isNull(e.name)) extraCandleAverage.name = get(e, "name") as string[];
	if (!isNull(e.day)) extraCandleAverage.day = get(e, "day") as number[];
	if (!isNull(e.color)) extraCandleAverage.color = get(e, "color") as string[];
	return extraCandleAverage;
}

export function extraCandlelInit(e: UTSJSONObject): ChartOptionsExtraCandle {
	const extraCandle = new ChartOptionsExtraCandle();
	if (!isNull(e.color))
		extraCandle.color = extraCandleColorInit(get(e, "color") as UTSJSONObject);
	if (!isNull(e.average))
		extraCandle.average = extraCandleAverageInit(get(e, "average") as UTSJSONObject);
	return extraCandle;
}

export function extraMapInit(e: UTSJSONObject): ChartOptionsExtraMap {
	const extraMap = new ChartOptionsExtraMap();
	if (!isNull(e.border)) extraMap.border = get(e, "border") as boolean;
	if (!isNull(e.mercator)) extraMap.mercator = get(e, "mercator") as boolean;
	if (!isNull(e.borderWidth)) extraMap.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.borderColor)) extraMap.borderColor = get(e, "borderColor") as string;
	if (!isNull(e.fillOpacity)) extraMap.fillOpacity = get(e, "fillOpacity") as number;
	if (!isNull(e.active)) extraMap.active = get(e, "active") as boolean;
	if (!isNull(e.activeTextColor)) extraMap.activeTextColor = get(e, "activeTextColor") as string;
	if (!isNull(e.activeBorderColor))
		extraMap.activeBorderColor = get(e, "activeBorderColor") as string;
	if (!isNull(e.activeFillColor)) extraMap.activeFillColor = get(e, "activeFillColor") as string;
	if (!isNull(e.activeFillOpacity))
		extraMap.activeFillOpacity = get(e, "activeFillOpacity") as number;
	return extraMap;
}

export function extraInit(e: UTSJSONObject): ChartOptionsExtra {
	const extra = new ChartOptionsExtra();
	if (!isNull(e.column)) extra.column = extraColumnInit(get(e, "column") as UTSJSONObject);
	if (!isNull(e.markLine))
		extra.markLine = extraMarkLineInit(get(e, "markLine") as UTSJSONObject);
	if (!isNull(e.tooltip)) extra.tooltip = extraTooltipInit(get(e, "tooltip") as UTSJSONObject);
	if (!isNull(e.mount)) extra.mount = extraMountInit(get(e, "mount") as UTSJSONObject);
	if (!isNull(e.bar)) extra.bar = extraBarInit(get(e, "bar") as UTSJSONObject);
	if (!isNull(e.line)) extra.line = extraLineInit(get(e, "line") as UTSJSONObject);
	if (!isNull(e.area)) extra.area = extraAreaInit(get(e, "area") as UTSJSONObject);
	if (!isNull(e.pie)) extra.pie = extraPieInit(get(e, "pie") as UTSJSONObject);
	if (!isNull(e.ring)) extra.ring = extraRingInit(get(e, "ring") as UTSJSONObject);
	if (!isNull(e.rose)) extra.rose = extraRoseInit(get(e, "rose") as UTSJSONObject);
	if (!isNull(e.scatter)) extra.scatter = extraScatterInit(get(e, "scatter") as UTSJSONObject);
	if (!isNull(e.bubble)) extra.bubble = extraBubbleInit(get(e, "bubble") as UTSJSONObject);
	if (!isNull(e.mix)) extra.mix = extraMixInit(get(e, "mix") as UTSJSONObject);
	if (!isNull(e.radar)) extra.radar = extraRadarInit(get(e, "radar") as UTSJSONObject);
	if (!isNull(e.arcbar)) extra.arcbar = extraArcbarInit(get(e, "arcbar") as UTSJSONObject);
	if (!isNull(e.gauge)) extra.gauge = extraGaugeInit(get(e, "gauge") as UTSJSONObject);
	if (!isNull(e.funnel)) extra.funnel = extraFunnelInit(get(e, "funnel") as UTSJSONObject);
	if (!isNull(e.word)) extra.word = extraWordInit(get(e, "word") as UTSJSONObject);
	if (!isNull(e.candle)) extra.candle = extraCandlelInit(get(e, "candle") as UTSJSONObject);
	if (!isNull(e.map)) extra.map = extraMapInit(get(e, "map") as UTSJSONObject);
	return extra;
}
