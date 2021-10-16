module.exports = function (app) {
	app.get("/", function (req, res) {
		res.render("index.html", {
			title: "Dynamic awesome title",
			heading: "Dynamic heading",
		});
	});

	app.get("/search", function (req, res) {
		res.render("search.html");
	});

	app.get("/about", function (req, res) {
		res.render("about.html");
	});
};
