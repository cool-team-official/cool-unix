export class TuiChartConfig {
	version: string = "v2.5.0-20230101";
	yAxisWidth: any = 15;
	xAxisHeight: number = 22;
	padding: number[] = [10, 10, 10, 10];
	rotate: boolean = false;
	fontSize: number = 13;
	fontColor: string = "#666666";
	dataPointShape: string[] = ["circle", "circle", "circle", "circle"];
	color: string[] = [
		"#1890FF",
		"#91CB74",
		"#FAC858",
		"#EE6666",
		"#73C0DE",
		"#3CA272",
		"#FC8452",
		"#9A60B4",
		"#ea7ccc"
	];
	linearColor: string[] = [
		"#0EE2F8",
		"#2BDCA8",
		"#FA7D8D",
		"#EB88E2",
		"#2AE3A0",
		"#0EE2F8",
		"#EB88E2",
		"#6773E3",
		"#F78A85"
	];
	pieChartLinePadding: number = 15;
	pieChartTextPadding: number = 5;
	titleFontSize: number = 20;
	subtitleFontSize: number = 15;
	radarLabelTextMargin: number = 13;
	_xAxisTextAngle_: number = 0;
	_pieTextMaxLength_: number = 0;
	constructor() {}
}
