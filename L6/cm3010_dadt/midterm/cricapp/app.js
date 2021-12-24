let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let app = express();
const db = require("./db/mysql");
// const cricDB = require("./routes/cric");

const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

let results;
let query =
	"SELECT Team, sum(matches) as Matches FROM ( ( select team_A as team, count(*) as matches from `match` GROUP BY team_A ) UNION ( select team_B as team, count(*) as matches from `match` GROUP BY team_B ) ) T2 GROUP BY team ORDER BY Matches DESC; SELECT batter, sum(runs) as Runs from delivery group by batter ORDER by Runs DESC LIMIT 10; SELECT delivery.bowler as Bowler, sum(delivery.runs) as Runs, count(wicket.ball) as Wickets from delivery LEFT JOIN wicket ON delivery.match_id = wicket.match_id AND delivery.innings = wicket.innings AND delivery.over = wicket.over AND delivery.ball = wicket.ball group by delivery.bowler ORDER by Wickets DESC LIMIT 10; SELECT kind as Kind, count(kind) as Count from wicket GROUP BY kind ORDER by count(kind) DESC;";

db.query(query, function (err, result) {
	if (err) console.error(err);
	results = result;
});

app.get("/", function (req, res) {
	if (results !== undefined) {
		res.render("index", { title: "CricApp", result: results });
	} else {
		res.send("Please refresh the page in a few moments - the data wasn't ready just yet. It can take up to a minute for the data to be prepared, as this version of the app doesn't optimize yet for performance.");
	}
});

app.get("/favicon.ico", (req, res) => res.status(204));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
