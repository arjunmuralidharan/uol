const mysql = require("mysql2");


const connection = mysql.createPool({
	connectionLimit: 1,
	host: "localhost",
	user: "root",
	password: "root",
	database: "cricapp",
	multipleStatements: true
});

// connection.connect(function(err) {
// 	if (err) throw err;
// 	console.log("Connected to database");
// });

module.exports = connection;