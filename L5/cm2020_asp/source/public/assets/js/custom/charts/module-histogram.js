// Histogram for the Distribution of Module Grades
var ModuleGradeHistogram = (function () {
	return {
		init: function () {
			var options = {
				series: [
					{
						name: "Count",
						data: bins.counts
					}
				],
				chart: {
					type: "histogram",
					height: 300,
					foreColor: "#999",
					toolbar: { tools: { download: false } },
					events: {
						dataPointSelection: function (e, chart, opts) {
							var arraySelected = [];
							opts.selectedDataPoints.map(function (selectedIndex) {
								return selectedIndex.map(function (s) {
									return arraySelected.push(chart.w.globals.series[0][s]);
								});
							});
							arraySelected = arraySelected.reduce(function(acc, curr) {
								let sum = bins.counts.reduce((a, b) => a + b, 0);
								return (acc + curr / sum);
							} , 0).toFixed(2) * 100
							document.querySelector("#selected-count").innerHTML = arraySelected
						}
					},
				},
				stroke: {colors: ["#20D489"]},
				dataLabels: {
					enabled: false
				},
				plotOptions: {
					bar: {
						dataLabels: { enabled: false },
						borderRadius: 5,
					},
				},
				states: {
					active: { allowMultipleDataPointsSelection: true},
				},
				xaxis: {
					title: { text: 'Grade Bin' },
					categories: bins.labels,
					axisBorder: { show: true },
					axisTicks: { show: true },
				},
				yaxis: { 
					show: true,
					title: { text: 'Count' },
					labels: {formatter: (value) => { 
						return Math.floor(value)}}
				},
				grid: { show: false },
				tooltip: {x: {formatter: (value) => {
					if (value == 100) return `Grade bin: ${value}`
					return `Grade bin: ${value}-${value + 4}`
				}}}
			};
			
			var chart = new ApexCharts(document.querySelector("#module-grades-histogram"), options);
			chart.render();
			chart.addEventListener("dataPointSelection", function (e, opts) {
			});
		},
	};
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
	ModuleGradeHistogram.init();
});
("use strict");