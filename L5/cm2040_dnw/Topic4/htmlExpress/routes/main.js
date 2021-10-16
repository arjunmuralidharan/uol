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

	app.get("/search-result", function (req, res) {
		//searching in the database
		res.send(
			"This is the keyword you entered: " +
				req.query.keyword +
				"<br />" +
				"This is the result of the search:"
		);
	});

	app.get("/register", function (req, res) {
		res.render("register.html");
	});

	app.post("/registered", function (req, res) {
		res.send(
			"Hello " +
				req.body.first +
				" " +
				req.body.last +
				", you are now registered! We'll send you an e-mail to " +
				req.body.email +
				" with further details."
		);
	});
};
