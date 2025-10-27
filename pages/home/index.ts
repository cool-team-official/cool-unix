export default {
	_id: "66e51b46311c164d73c09884",
	creation_time: 1726290758896,
	name: "渐变色+阴影+水平动画",
	option: {
		animation: true,
		categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
		dataLabel: false,
		dataPointShape: false,
		enableScroll: false,
		extra: {
			line: {
				activeType: "hollow",
				linearType: "custom",
				onShadow: true,
				type: "curve",
				width: 2
			},
			tooltip: {}
		},
		fontSize: 11,
		padding: [15, 0, 0, 0],
		series: [
			{
				data: [
					{
						value: 35
					},
					{
						value: 8
					},
					{
						value: 25
					},
					{
						value: 37
					},
					{
						value: 4
					},
					{
						value: 20
					}
				],
				linearColor: [
					["0", "#1890FF"],
					["0.25", "#00B5FF"],
					["0.5", "#00D1ED"],
					["0.75", "#00E6BB"],
					["1", "#90F489"]
				],
				name: "成交量A",
				setShadow: ["3", "8", "10", "#1890FF"]
			},
			{
				data: [
					{
						value: 70
					},
					{
						value: 40
					},
					{
						value: 65
					},
					{
						value: 100
					},
					{
						value: 44
					},
					{
						value: 68
					}
				],
				linearColor: [
					["0", "#91CB74"],
					["0.25", "#2BDCA8"],
					["0.5", "#2AE3A0"],
					["0.75", "#C4D06E"],
					["1", "#F2D375"]
				],
				name: "成交量B"
			},
			{
				data: [
					{
						value: 100
					},
					{
						value: 80
					},
					{
						value: 95
					},
					{
						value: 150
					},
					{
						value: 112
					},
					{
						value: 132
					}
				],
				linearColor: [
					["0", "#FAC858"],
					["0.33", "#FFC371"],
					["0.66", "#FFC2B2"],
					["1", "#FA7D8D"]
				],
				name: "成交量C",
				setShadow: ["3", "8", "10", "#FC8452"]
			}
		],
		type: "line",
		xAxis: {
			disableGrid: true
		},
		yAxis: {
			dashLength: 2,
			data: [
				{
					max: 150,
					min: 0
				}
			],
			gridType: "dash"
		}
	},
	type: "line",
	update_time: 1726290758896,
	uts: true
} as UTSJSONObject;
