require("dotenv").config();
const express = require("express");
const db = require("mysql-promise")();
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const putObjectsInAllViews = require("./middlewares/putObjectsInAllViews");
const flash = require("express-flash");

//db configuration
db.configure({
	connectionLimit: 1000,
	connectTimeout: 60 * 60 * 1000,
	acquireTimeout: 60 * 60 * 1000,
	timeout: 60 * 60 * 1000,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	ssl: {
		rejectUnauthorized: false,
	},
});
global.db = db;

// initialize server
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize db session
const sessionStore = new MySQLStore({}, db);
app.use(
	session({
		key: "gradez-session",
		secret: process.env.SESSION_SECRET,
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
	})
);

// initialize passport and supporting middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(putObjectsInAllViews); //must go after passport.initialize()/.session()
app.use(flash());
require("./routes/main")(app, passport);
require("./config/passport")(passport);


// set redirects
app.use(function (req, res, next) {
	res.status(404);

	// respond with html page
	if (req.accepts("html")) {
		res.render("pages/error.html", { url: escape(req.url) });
		return;
	}

	// respond with json
	if (req.accepts("json")) {
		res.send({ error: "Not found" });
		return;
	}

	// default to plain-text. send()
	res.type("txt").send("Not found");
});

// confiure server
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
