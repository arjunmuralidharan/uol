// Set level filter buttons

// Show all rows
$("#level-all").click(function () {
	var rows = $("#module-table").find("tr").show();
});

// Level filters buttons hide all rows
// then showing rows that contain either
// L4, L5, or L6 anywhere in the row
$("#level-4").click(function () {
	var rows = $("#module-table").find("tr").hide();
	rows.filter(":contains('L4')").show();
});

$("#level-5").click(function () {
	var rows = $("#module-table").find("tr").hide();
	rows.filter(":contains('L5')").show();
});

$("#level-6").click(function () {
	var rows = $("#module-table").find("tr").hide();
	rows.filter(":contains('L6')").show();
});
