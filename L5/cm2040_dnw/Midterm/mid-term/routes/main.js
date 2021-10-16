module.exports = function (app) {
	app.get("/", function (req, res) {
		res.render("index.html", {
			title: "CalorieBuddy - Online Calorie Database",
			heading: "Welcome to CalorieBuddy",
		});
	});

	app.get("/home", function (req, res) {
		res.render("index.html", {
			title: "CalorieBuddy - Online Calorie Database",
			heading: "Welcome to CalorieBuddy",
		});
	});

	app.get("/add", function (req, res) {
		res.render("add.html", {
			title: "CalorieBuddy - Add Food Items",
			heading: "Add Food Items",
			success: "",
			failure: "",
			action: "added",
			mode: "",
			lead: "Add food items to CalorieBuddy.",
			availableFoods: [
				{
					name: "",
					typicalAmount: "",
					typicalUnit: "",
					carbs: "",
					protein: "",
					fat: "",
					sugar: "",
					salt: "",
					calories: "",
				},
			],
		});
	});

	app.get("/search", function (req, res) {
		res.render("search.html", {
			title: "CalorieBuddy: Search",
			heading: "Search",
			lead: "Find food items stored in CalorieBuddy.",
			mode: "search",
			success: "",
			failure: "",
		});
	});

	app.get("/about", function (req, res) {
		res.render("about.html", {
			title: "CalorieBuddy - About",
			heading: "About",
		});
	});

	app.get("/list", function (req, res) {
		// query database to get all the books

		let sqlquery = "SELECT * FROM food";
		// execute sql query

		db.query(sqlquery, (err, result) => {
			if (err) {
				res.redirect("/");
			}

			res.render("list.html", {
				availableFoods: result,
				title: "List food items",
				heading: "List all food items",
			});
		});
	});

	app.post("/added", function (req, res) {
		// saving data in database
		let sqlquery =
			"INSERT INTO food (name, typicalAmount, typicalUnit, calories, salt, sugar, fat, protein, carbs) VALUES (?,?,?,?,?,?,?,?,?)"; // execute sql query
		let newrecord = [
			req.body.name,
			req.body.amount,
			req.body.unit,
			req.body.calories,
			req.body.salt,
			req.body.sugar,
			req.body.fat,
			req.body.protein,
			req.body.carbs,
		];
		db.query(sqlquery, newrecord, (err, result) => {
			if (err) {
				res.render("add.html", {
					title: "CalorieBuddy - Add Food Item",
					heading: "Add Food Item",
					success: "",
					failure:
						"Food item couldn't be added. You may have submitted invalid values. Try again.",
					food: req.body.name,
					availableFoods: [{}],
					lead: "Add food items to CalorieBuddy.",
					action: "added",
					mode: "",
				});
				return console.error(err.message);
			} else
				res.render("add.html", {
					title: "CalorieBuddy - Add Food Item",
					heading: "Add Food Item",
					success: "Item added.",
					failure: "",
					food: req.body.name,
					availableFoods: [{}],
					lead: "Add food items to CalorieBuddy.",
					action: "added",
					mode: "",
				});
		});
	});

	app.get("/search-result", function (req, res) {
		let word = [req.query.keyword];
		let sqlquery = "SELECT * FROM `food` WHERE name like ?";
		// execute sql query
		db.query(sqlquery, "%" + word + "%", (err, result) => {
			if (err) {
				return console.error(
					"No food item found with the keyword you have entered" +
						req.query.keyword +
						"error: " +
						err.message
				);
			} else if (result.length == 0) {
				res.render("search.html", {
					availableFoods: result,
					title: "CalorieBuddy: Search",
					heading: "Search",
					lead:
						"Find food items stored in CalorieBuddy.",
					mode: "search",
					success: "",
					failure: "No results found.",
				});
			} else {
				res.render("list.html", {
					availableFoods: result,
					title: "CalorieBuddy - Search Results",
					heading: "Search Results",
				});
			}
		});
	});

	app.get("/update", function (req, res) {
		res.render("search.html", {
			title: "CalorieBuddy - Update Food Items",
			heading: "Update Food Items",
			mode: "update",
			success: "",
			failure: "",
			lead:
				"Update or delete food items stored in CalorieBuddy.",
		});
	});

	app.get("/update-result", function (req, res) {
		let word = [req.query.keyword];
		let sqlquery = "SELECT * FROM `food` WHERE name like ?";
		// execute sql query
		db.query(sqlquery, "%" + word + "%", (err, result) => {
			if (err) {
				return console.error(
					"No food item found with the keyword you have entered" +
						req.query.keyword +
						"error: " +
						err.message
				);
			} else if (result.length == 0) {
				res.render("search.html", {
					availableFoods: result,
					title: "CalorieBuddy - Update Item",
					heading: "Update Food Items",
					mode: "update",
					action: "updated",
					lead: "Update the food item below.",
					failure:
						"No items found that match your query.",
					success: "",
				});
			} else {
				res.render("add.html", {
					availableFoods: result,
					title: "CalorieBuddy - Update Item",
					heading: "Update Item",
					mode: "update",
					action: "updated",
					lead: "Update the food item below.",
					state: "",
					success: "Found a matching food item.",
				});
			}
		});
	});

	app.post("/updated", function (req, res) {
		// saving data in database
		let sqlquery =
			"UPDATE food SET name = ?, typicalAmount = ?, typicalUnit = ?, calories = ?, salt = ?, sugar = ?, fat = ?, protein = ?, carbs = ? WHERE Id = ?"; // execute sql query
		let newrecord = [
			req.body.name,
			req.body.amount,
			req.body.unit,
			req.body.calories,
			req.body.salt,
			req.body.sugar,
			req.body.fat,
			req.body.protein,
			req.body.carbs,
			req.body.id,
		];
		db.query(sqlquery, newrecord, (err, result) => {
			if (err) {
				res.render("search.html", {
					title:
						"CalorieBuddy - Update Food Items",
					heading: "Update Food Items",
					mode: "update",
					success: "",
					failure:
						"Update failed - you may have submitted invalid values. Please try again.",
					availableFoods: result,
					lead:
						"Update or delete food items stored in CalorieBuddy.",
				});
				return console.error(err.message);
			} else
				res.render("search.html", {
					title:
						"CalorieBuddy - Update Food Items",
					heading: "Update Food Items",
					mode: "update",
					success: "Record updated.",
					failure: "",
					availableFoods: result,
					lead:
						"Update food items stored in CalorieBuddy.",
				});
		});
	});

	app.get("/about", function (req, res) {
		res.render("about.html");
	});

	app.post("/delete", function (req, res) {
		let sqlquery = "DELETE FROM food WHERE Id = ?"; // execute sql query

		db.query(sqlquery, [req.body.id], (err, result) => {
			res.render("search.html", {
				title: "CalorieBuddy - Update Food Items",
				heading: "Update Food Items",
				mode: "update",
				success: "Item deleted.",
				failure: "",

				lead:
					"Update or delete food items stored in CalorieBuddy.",
			});
		});
	});
};
