import {
	ChartOptions,
	ChartOptionsLegend,
	ChartOptionsSeries,
	ChartOptionsSeriesData,
	ChartOptionsSubTitle,
	ChartOptionsTitle,
	ChartOptionsXAxis,
	ChartOptionsYAxis,
	ChartOptionsYAxisData,
	ChartOptionsMapSeriesProperties,
	ChartOptionsMapSeriesPropertiesParent,
	ChartOptionsMapSeriesGeometry
} from "./type";
import { extraInit } from "./extrainit";
import { get, isNull } from "./common";
export function seriesDataInit(e: UTSJSONObject): ChartOptionsSeriesData {
	const series_data = new ChartOptionsSeriesData();
	if (!isNull(e.name)) series_data.name = get(e, "name") as string;
	if (!isNull(e.value)) series_data.value = get(e, "value") as number;
	if (!isNull(e.color)) series_data.color = get(e, "color") as string;
	if (!isNull(e.labelText)) series_data.labelText = get(e, "labelText") as string;
	if (!isNull(e.labelShow)) series_data.labelShow = get(e, "labelShow") as boolean;
	if (!isNull(e.centerText)) series_data.centerText = get(e, "centerText") as string;
	if (!isNull(e.centerTextSize)) series_data.centerTextSize = get(e, "centerTextSize") as number;
	if (!isNull(e.centerTextColor))
		series_data.centerTextColor = get(e, "centerTextColor") as string;
	return series_data;
}

export function seriesInit(e: UTSJSONObject, type: string = ""): ChartOptionsSeries {
	const series = new ChartOptionsSeries();
	if (!isNull(e.index)) series.index = get(e, "index") as number;
	if (!isNull(e.name)) series.name = get(e, "name") as string;
	if (!isNull(e.legendText)) series.legendText = get(e, "legendText") as string;
	if (!isNull(e.show)) series.show = get(e, "show") as boolean;
	if (!isNull(e.color)) series.color = get(e, "color") as string;
	if (!isNull(e.fillOpacity)) series.fillOpacity = get(e, "fillOpacity") as number;
	if (!isNull(e.textColor)) series.textColor = get(e, "textColor") as string;
	if (!isNull(e.textSize)) series.textSize = get(e, "textSize") as number;
	if (!isNull(e.textOffset)) series.textOffset = get(e, "textOffset") as number;
	if (!isNull(e.linearIndex)) series.linearIndex = get(e, "linearIndex") as number;
	if (!isNull(e.type)) series.type = get(e, "type") as string;
	if (!isNull(e.disableLegend)) series.disableLegend = get(e, "disableLegend") as boolean;
	if (!isNull(e.connectNulls)) series.connectNulls = get(e, "connectNulls") as boolean;
	if (!isNull(e.setShadow)) series.setShadow = get(e, "setShadow") as string[];
	if (!isNull(e.linearColor)) series.linearColor = get(e, "linearColor") as string[][];
	if (!isNull(e.style)) series.style = get(e, "style") as "curve" | "straight";
	if (!isNull(e.addPoint)) series.addPoint = get(e, "addPoint") as boolean;
	if (!isNull(e.lineType)) series.lineType = get(e, "lineType") as "solid" | "dash";
	if (!isNull(e.dashLength)) series.dashLength = get(e, "dashLength") as number;
	if (!isNull(e.pointShape))
		series.pointShape = get(e, "pointShape") as
			| "diamond"
			| "circle"
			| "triangle"
			| "square"
			| "none";
	if (!isNull(e.legendShape))
		series.legendShape = get(e, "legendShape") as
			| "none"
			| "diamond"
			| "circle"
			| "triangle"
			| "square"
			| "rect"
			| "line"
			| null;
	if (!isNull(e.formatter)) series.formatter = get(e, "formatter") as any;
	if (!isNull(e.format)) series.format = get(e, "format") as string;
	if (!isNull(e.rotate)) series.rotate = get(e, "rotate") as boolean;
	if (!isNull(e.seriesMA)) {
		const seriesmas: ChartOptionsSeries[] = [];
		const data = get(e, "seriesMA") as UTSJSONObject[];
		data.forEach((item: UTSJSONObject) => {
			seriesmas.push(seriesInit(item));
		});
		series.seriesMA = seriesmas;
	}
	if (!isNull(e.data)) {
		if (type == "scatter" || type == "bubble" || type == "candle") {
			series.dataArr = get(e, "data") as number[][];
		} else {
			const seriesdata: ChartOptionsSeriesData[] = [];
			const data = get(e, "data") as UTSJSONObject[];
			data.forEach((item: UTSJSONObject) => {
				seriesdata.push(seriesDataInit(item));
			});
			series.data = seriesdata;
		}
	}
	if (!isNull(e.properties)) {
		if (type == "map") {
			series.properties = mapSeriesPropertiesInit(get(e, "properties") as UTSJSONObject);
		}
	}
	if (!isNull(e.geometry)) {
		if (type == "map") {
			series.geometry = mapSeriesGeometryInit(get(e, "geometry") as UTSJSONObject);
		}
	}
	return series;
}

//x轴数据解析
export function xAxisInit(e: UTSJSONObject): ChartOptionsXAxis {
	const xAxis: ChartOptionsXAxis = new ChartOptionsXAxis();
	if (!isNull(e.disabled)) xAxis.disabled = get(e, "disabled") as boolean;
	if (!isNull(e.axisLine)) xAxis.axisLine = get(e, "axisLine") as boolean;
	if (!isNull(e.axisLineColor)) xAxis.axisLineColor = get(e, "axisLineColor") as string;
	if (!isNull(e.calibration)) xAxis.calibration = get(e, "calibration") as boolean;
	if (!isNull(e.fontColor)) xAxis.fontColor = get(e, "fontColor") as string;
	if (!isNull(e.fontSize)) xAxis.fontSize = get(e, "fontSize") as number;
	if (!isNull(e.lineHeight)) xAxis.lineHeight = get(e, "lineHeight") as number;
	if (!isNull(e.marginTop)) xAxis.marginTop = get(e, "marginTop") as number;
	if (!isNull(e.rotateLabel)) xAxis.rotateLabel = get(e, "rotateLabel") as boolean;
	if (!isNull(e.rotateAngle)) xAxis.rotateAngle = get(e, "rotateAngle") as number;
	if (!isNull(e.labelCount)) xAxis.labelCount = get(e, "labelCount") as number;
	if (!isNull(e.itemCount)) xAxis.itemCount = get(e, "itemCount") as number;
	if (!isNull(e.boundaryGap)) xAxis.boundaryGap = get(e, "boundaryGap") as "center" | "justify";
	if (!isNull(e.disableGrid)) xAxis.disableGrid = get(e, "disableGrid") as boolean;
	if (!isNull(e.splitNumber)) xAxis.splitNumber = get(e, "splitNumber") as number;
	if (!isNull(e.gridColor)) xAxis.gridColor = get(e, "gridColor") as string;
	if (!isNull(e.gridType)) xAxis.gridType = get(e, "gridType") as "solid" | "dash";
	if (!isNull(e.dashLength)) xAxis.dashLength = get(e, "dashLength") as number;
	if (!isNull(e.gridEval)) xAxis.gridEval = get(e, "gridEval") as number;
	if (!isNull(e.scrollShow)) xAxis.scrollShow = get(e, "scrollShow") as boolean;
	if (!isNull(e.scrollAlign)) xAxis.scrollAlign = get(e, "scrollAlign") as "left" | "right";
	if (!isNull(e.scrollColor)) xAxis.scrollColor = get(e, "scrollColor") as string;
	if (!isNull(e.scrollBackgroundColor))
		xAxis.scrollBackgroundColor = get(e, "scrollBackgroundColor") as string;
	if (!isNull(e.min)) xAxis.min = get(e, "min") as number;
	if (!isNull(e.max)) xAxis.max = get(e, "max") as number;
	if (!isNull(e.title)) xAxis.title = get(e, "title") as string;
	if (!isNull(e.titleFontSize)) xAxis.titleFontSize = get(e, "titleFontSize") as number;
	if (!isNull(e.titleOffsetY)) xAxis.titleOffsetY = get(e, "titleOffsetY") as number;
	if (!isNull(e.titleOffsetX)) xAxis.titleOffsetX = get(e, "titleOffsetX") as number;
	if (!isNull(e.titleFontColor)) xAxis.titleFontColor = get(e, "titleFontColor") as string;
	if (!isNull(e.formatter)) xAxis.formatter = get(e, "formatter") as any;
	if (!isNull(e.format)) xAxis.format = get(e, "format") as string;
	if (!isNull(e.data)) {
		const xAxis_data: ChartOptionsYAxisData[] = [];
		const data = get(e, "data") as UTSJSONObject[];
		data.forEach((item: UTSJSONObject) => {
			xAxis_data.push(yAxisDataInit(item));
		});
		xAxis.data = xAxis_data;
	}
	return xAxis;
}

export function yAxisDataInit(e: UTSJSONObject): ChartOptionsYAxisData {
	const yAxis_data: ChartOptionsYAxisData = new ChartOptionsYAxisData();
	if (!isNull(e.type)) yAxis_data.type = get(e, "type") as string;
	if (!isNull(e.position))
		yAxis_data.position = get(e, "position") as "left" | "right" | "center";
	if (!isNull(e.disabled)) yAxis_data.disabled = get(e, "disabled") as boolean;
	if (!isNull(e.axisLine)) yAxis_data.axisLine = get(e, "axisLine") as boolean;
	if (!isNull(e.axisLineColor)) yAxis_data.axisLineColor = get(e, "axisLineColor") as string;
	if (!isNull(e.calibration)) yAxis_data.calibration = get(e, "calibration") as boolean;
	if (!isNull(e.fontColor)) yAxis_data.fontColor = get(e, "fontColor") as string;
	if (!isNull(e.fontSize)) yAxis_data.fontSize = get(e, "fontSize") as number;
	if (!isNull(e.textAlign))
		yAxis_data.textAlign = get(e, "textAlign") as "left" | "right" | "center";
	if (!isNull(e.title)) yAxis_data.title = get(e, "title") as string;
	if (!isNull(e.titleFontSize)) yAxis_data.titleFontSize = get(e, "titleFontSize") as number;
	if (!isNull(e.titleOffsetY)) yAxis_data.titleOffsetY = get(e, "titleOffsetY") as number;
	if (!isNull(e.titleOffsetX)) yAxis_data.titleOffsetX = get(e, "titleOffsetX") as number;
	if (!isNull(e.titleFontColor)) yAxis_data.titleFontColor = get(e, "titleFontColor") as string;
	if (!isNull(e.min)) yAxis_data.min = get(e, "min") as number;
	if (!isNull(e.max)) yAxis_data.max = get(e, "max") as number;
	if (!isNull(e.tofix)) yAxis_data.tofix = get(e, "tofix") as number;
	if (!isNull(e.unit)) yAxis_data.unit = get(e, "unit") as string;
	if (!isNull(e.formatter)) yAxis_data.formatter = get(e, "formatter") as any;
	if (!isNull(e.format)) yAxis_data.format = get(e, "format") as string;
	return yAxis_data;
}

export function yAxisInit(e: UTSJSONObject): ChartOptionsYAxis {
	const yAxis: ChartOptionsYAxis = new ChartOptionsYAxis();
	if (!isNull(e.disabled)) yAxis.disabled = get(e, "disabled") as boolean;
	if (!isNull(e.disableGrid)) yAxis.disableGrid = get(e, "disableGrid") as boolean;
	if (!isNull(e.splitNumber)) yAxis.splitNumber = get(e, "splitNumber") as number;
	if (!isNull(e.gridType)) yAxis.gridType = get(e, "gridType") as "solid" | "dash";
	if (!isNull(e.dashLength)) yAxis.dashLength = get(e, "dashLength") as number;
	if (!isNull(e.gridColor)) yAxis.gridColor = get(e, "gridColor") as string;
	if (!isNull(e.padding)) yAxis.padding = get(e, "padding") as number;
	if (!isNull(e.showTitle)) yAxis.showTitle = get(e, "showTitle") as boolean;
	if (!isNull(e.gridSet)) yAxis.gridSet = get(e, "gridSet") as string;
	if (!isNull(e.fontColor)) yAxis.fontColor = get(e, "fontColor") as string;
	if (!isNull(e.data)) {
		const yAxis_data: ChartOptionsYAxisData[] = [];
		const data = get(e, "data") as UTSJSONObject[];
		data.forEach((item: UTSJSONObject) => {
			yAxis_data.push(yAxisDataInit(item));
		});
		yAxis.data = yAxis_data;
	}
	return yAxis;
}

export function legendInit(e: UTSJSONObject): ChartOptionsLegend {
	const legend = new ChartOptionsLegend();
	if (!isNull(e.show)) legend.show = get(e, "show") as boolean;
	if (!isNull(e.position))
		legend.position = get(e, "position") as "bottom" | "top" | "left" | "right";
	if (!isNull(e.float))
		legend.float = get(e, "float") as "center" | "left" | "right" | "top" | "bottom";
	if (!isNull(e.padding)) legend.padding = get(e, "padding") as number;
	if (!isNull(e.margin)) legend.margin = get(e, "margin") as number;
	if (!isNull(e.backgroundColor)) legend.backgroundColor = get(e, "backgroundColor") as string;
	if (!isNull(e.borderColor)) legend.borderColor = get(e, "borderColor") as string;
	if (!isNull(e.borderWidth)) legend.borderWidth = get(e, "borderWidth") as number;
	if (!isNull(e.fontSize)) legend.fontSize = get(e, "fontSize") as number;
	if (!isNull(e.fontColor)) legend.fontColor = get(e, "fontColor") as string;
	if (!isNull(e.lineHeight)) legend.lineHeight = get(e, "lineHeight") as number;
	if (!isNull(e.hiddenColor)) legend.hiddenColor = get(e, "hiddenColor") as string;
	if (!isNull(e.itemGap)) legend.itemGap = get(e, "itemGap") as number;
	return legend;
}

export function titleInit(e: UTSJSONObject): ChartOptionsTitle {
	const title = new ChartOptionsTitle();
	if (!isNull(e.name)) title.name = get(e, "name") as string;
	if (!isNull(e.fontSize)) title.fontSize = get(e, "fontSize") as number;
	if (!isNull(e.color)) title.color = get(e, "color") as string;
	if (!isNull(e.offsetX)) title.offsetX = get(e, "offsetX") as number;
	if (!isNull(e.offsetY)) title.offsetY = get(e, "offsetY") as number;
	return title;
}

export function subtitleInit(e: UTSJSONObject): ChartOptionsSubTitle {
	const subtitle = new ChartOptionsSubTitle();
	if (!isNull(e.name)) subtitle.name = get(e, "name") as string;
	if (!isNull(e.fontSize)) subtitle.fontSize = get(e, "fontSize") as number;
	if (!isNull(e.color)) subtitle.color = get(e, "color") as string;
	if (!isNull(e.offsetX)) subtitle.offsetX = get(e, "offsetX") as number;
	if (!isNull(e.offsetY)) subtitle.offsetY = get(e, "offsetY") as number;
	return subtitle;
}

export function mapSeriesPropertiesParentInit(
	e: UTSJSONObject
): ChartOptionsMapSeriesPropertiesParent {
	const parent = new ChartOptionsMapSeriesPropertiesParent();
	if (!isNull(e.adcode)) parent.adcode = get(e, "adcode") as number;
	return parent;
}

export function mapSeriesPropertiesInit(e: UTSJSONObject): ChartOptionsMapSeriesProperties {
	const mapSeriesProperties = new ChartOptionsMapSeriesProperties();
	if (!isNull(e.adcode)) mapSeriesProperties.adcode = get(e, "adcode") as number;
	if (!isNull(e.name)) mapSeriesProperties.name = get(e, "name") as string;
	if (!isNull(e.center)) mapSeriesProperties.center = get(e, "center") as number[];
	if (!isNull(e.centroid)) mapSeriesProperties.centroid = get(e, "centroid") as number[];
	if (!isNull(e.childrenNum)) mapSeriesProperties.childrenNum = get(e, "childrenNum") as number;
	if (!isNull(e.level)) mapSeriesProperties.level = get(e, "level") as string;
	if (!isNull(e.subFeatureIndex))
		mapSeriesProperties.subFeatureIndex = get(e, "subFeatureIndex") as number;
	if (!isNull(e.acroutes)) mapSeriesProperties.acroutes = get(e, "acroutes") as number[];
	if (!isNull(e.parent))
		mapSeriesProperties.parent = mapSeriesPropertiesParentInit(
			get(e, "parent") as UTSJSONObject
		);
	return mapSeriesProperties;
}

export function mapSeriesGeometryInit(e: UTSJSONObject): ChartOptionsMapSeriesGeometry {
	const geometry = new ChartOptionsMapSeriesGeometry();
	if (!isNull(e.type)) geometry.type = get(e, "type") as string;
	if (!isNull(e.coordinates)) geometry.coordinates = get(e, "coordinates") as number[][][][];
	return geometry;
}

export function optionsInit(e: UTSJSONObject): ChartOptions {
	const opts = new ChartOptions();
	opts.canvasContext = e["canvasContext"] as CanvasContext;
	opts.context = e["context"] as CanvasRenderingContext2D;
	if (!isNull(e.type)) opts.type = get(e, "type") as string;
	if (opts.type == "gauge") {
		if (!isNull(e.categories)) {
			const categoriesObj: ChartOptionsSeriesData[] = [];
			const cate: UTSJSONObject[] = get(e, "categories") as UTSJSONObject[];
			cate.forEach((item: UTSJSONObject) => {
				const child = seriesDataInit(item);
				categoriesObj.push(child);
			});
			opts.categoriesObj = categoriesObj;
		}
	} else {
		if (!isNull(e.categories)) opts.categories = get(e, "categories") as string[];
	}
	if (!isNull(e.width)) opts.width = get(e, "width") as number;
	if (!isNull(e.height)) opts.height = get(e, "height") as number;
	if (!isNull(e.canvas2d)) opts.canvas2d = get(e, "canvas2d") as boolean;
	if (!isNull(e.pixelRatio)) opts.pixelRatio = get(e, "pixelRatio") as number;
	if (!isNull(e.animation)) opts.animation = get(e, "animation") as boolean;
	if (!isNull(e.timing))
		opts.timing = get(e, "timing") as "easeOut" | "easeIn" | "easeInOut" | "linear";
	if (!isNull(e.duration)) opts.duration = get(e, "duration") as number;
	if (!isNull(e.rotate)) opts.rotate = get(e, "rotate") as boolean;
	if (!isNull(e.rotateLock)) opts.rotateLock = get(e, "rotateLock") as boolean;
	if (!isNull(e.background)) opts.background = get(e, "background") as string;
	if (!isNull(e.color)) opts.color = get(e, "color") as string[];
	if (!isNull(e.padding)) opts.padding = get(e, "padding") as number[];
	if (!isNull(e.fontSize)) opts.fontSize = get(e, "fontSize") as number;
	if (!isNull(e.fontColor)) opts.fontColor = get(e, "fontColor") as string;
	if (!isNull(e.dataLabel)) opts.dataLabel = get(e, "dataLabel") as boolean;
	if (!isNull(e.dataPointShape)) opts.dataPointShape = get(e, "dataPointShape") as boolean;
	if (!isNull(e.dataPointShapeType))
		opts.dataPointShapeType = get(e, "dataPointShapeType") as "solid" | "hollow";
	if (!isNull(e.touchMoveLimit)) opts.touchMoveLimit = get(e, "touchMoveLimit") as number;
	if (!isNull(e.enableScroll)) opts.enableScroll = get(e, "enableScroll") as boolean;
	if (!isNull(e.enableMarkLine)) opts.enableMarkLine = get(e, "enableMarkLine") as boolean;
	if (!isNull(e.scrollPosition))
		opts.scrollPosition = get(e, "scrollPosition") as "current" | "left" | "right";
	if (!isNull(e.xOffset)) opts.xOffset = get(e, "xOffset") as number;
	if (!isNull(e.yOffset)) opts.yOffset = get(e, "yOffset") as number;
	if (!isNull(e.tapLegend)) opts.dataLabel = get(e, "tapLegend") as boolean;
	opts.legend.fontSize = opts.fontSize;
	opts.legend.lineHeight = opts.fontSize;
	opts.legend.fontColor = opts.fontColor;
	opts.yAxis.dashLength = 4 * opts.pixelRatio;
	if (!isNull(e.series)) {
		const series: ChartOptionsSeries[] = [];
		const series_data = get(e, "series") as UTSJSONObject[];
		series_data.forEach((item: UTSJSONObject) => {
			series.push(seriesInit(item, opts.type));
		});
		opts.series = series;
	}
	if (!isNull(e.xAxis)) {
		opts.xAxis = xAxisInit(get(e, "xAxis") as UTSJSONObject);
	}
	if (!isNull(e.yAxis)) {
		opts.yAxis = yAxisInit(get(e, "yAxis") as UTSJSONObject);
	}
	if (!isNull(e.legend)) {
		opts.legend = legendInit(get(e, "legend") as UTSJSONObject);
	}
	if (!isNull(e.title)) {
		opts.title = titleInit(get(e, "title") as UTSJSONObject);
	}
	if (!isNull(e.subtitle)) {
		opts.subtitle = subtitleInit(get(e, "subtitle") as UTSJSONObject);
	}
	if (!isNull(e.extra)) {
		opts.extra = extraInit(get(e, "extra") as UTSJSONObject);
	}
	return opts;
}

export function updateOptions(_opts: ChartOptions, e: UTSJSONObject) {
	const opts = _opts;
	if (!isNull(e.type)) opts.type = get(e, "type") as string;
	if (opts.type == "gauge") {
		if (!isNull(e.categories)) {
			const categoriesObj: ChartOptionsSeriesData[] = [];
			const cate: UTSJSONObject[] = get(e, "categories") as UTSJSONObject[];
			cate.forEach((item: UTSJSONObject) => {
				const child = seriesDataInit(item);
				categoriesObj.push(child);
			});
			opts.categoriesObj = categoriesObj;
		}
	} else {
		if (!isNull(e.categories)) opts.categories = get(e, "categories") as string[];
	}
	if (!isNull(e.width)) opts.width = get(e, "width") as number;
	if (!isNull(e.height)) opts.height = get(e, "height") as number;
	if (!isNull(e.canvas2d)) opts.canvas2d = get(e, "canvas2d") as boolean;
	if (!isNull(e.pixelRatio)) opts.pixelRatio = get(e, "pixelRatio") as number;
	if (!isNull(e.animation)) opts.animation = get(e, "animation") as boolean;
	if (!isNull(e.timing))
		opts.timing = get(e, "timing") as "easeOut" | "easeIn" | "easeInOut" | "linear";
	if (!isNull(e.duration)) opts.duration = get(e, "duration") as number;
	if (!isNull(e.rotate)) opts.rotate = get(e, "rotate") as boolean;
	if (!isNull(e.rotateLock)) opts.rotateLock = get(e, "rotateLock") as boolean;
	if (!isNull(e.background)) opts.background = get(e, "background") as string;
	if (!isNull(e.color)) opts.color = get(e, "color") as string[];
	if (!isNull(e.padding)) opts.padding = get(e, "padding") as number[];
	if (!isNull(e.fontSize)) opts.fontSize = get(e, "fontSize") as number;
	if (!isNull(e.fontColor)) opts.fontColor = get(e, "fontColor") as string;
	if (!isNull(e.dataLabel)) opts.dataLabel = get(e, "dataLabel") as boolean;
	if (!isNull(e.dataPointShape)) opts.dataPointShape = get(e, "dataPointShape") as boolean;
	if (!isNull(e.dataPointShapeType))
		opts.dataPointShapeType = get(e, "dataPointShapeType") as "solid" | "hollow";
	if (!isNull(e.touchMoveLimit)) opts.touchMoveLimit = get(e, "touchMoveLimit") as number;
	if (!isNull(e.enableScroll)) opts.enableScroll = get(e, "enableScroll") as boolean;
	if (!isNull(e.enableMarkLine)) opts.enableMarkLine = get(e, "enableMarkLine") as boolean;
	if (!isNull(e.scrollPosition))
		opts.scrollPosition = get(e, "scrollPosition") as "current" | "left" | "right";
	if (!isNull(e.xOffset)) opts.xOffset = get(e, "xOffset") as number;
	if (!isNull(e.yOffset)) opts.yOffset = get(e, "yOffset") as number;
	if (!isNull(e.tapLegend)) opts.dataLabel = get(e, "tapLegend") as boolean;
	opts.legend.fontSize = opts.fontSize;
	opts.legend.lineHeight = opts.fontSize;
	opts.legend.fontColor = opts.fontColor;
	opts.yAxis.dashLength = 4 * opts.pixelRatio;
	if (!isNull(e.series)) {
		const series: ChartOptionsSeries[] = [];
		const series_data = get(e, "series") as UTSJSONObject[];
		series_data.forEach((item: UTSJSONObject) => {
			series.push(seriesInit(item, opts.type));
		});
		opts.series = series;
	}
	if (!isNull(e.xAxis)) {
		opts.xAxis = xAxisInit(get(e, "xAxis") as UTSJSONObject);
	}
	if (!isNull(e.yAxis)) {
		opts.yAxis = yAxisInit(get(e, "yAxis") as UTSJSONObject);
	}
	if (!isNull(e.legend)) {
		opts.legend = legendInit(get(e, "legend") as UTSJSONObject);
	}
	if (!isNull(e.title)) {
		opts.title = titleInit(get(e, "title") as UTSJSONObject);
	}
	if (!isNull(e.subtitle)) {
		opts.subtitle = subtitleInit(get(e, "subtitle") as UTSJSONObject);
	}
	if (!isNull(e.extra)) {
		opts.extra = extraInit(get(e, "extra") as UTSJSONObject);
	}
	return opts;
}
