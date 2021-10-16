const SlackStrategy = require("passport-slack").Strategy;

// serialUser() and deserializeUser() are expected by
// passport.authenticate("slack", ... ) callback in "/auth/slack/callback"
// route. The SlackStrategy saves user info to db and passes the user obj
// to serializeUser which passes the user id to deserializeUser which
// gets the user from the db by the id and saves to req.user. User info could
// be passed directly through these functions instead of saving/recalling from
// db but we still need to store user id and name in database for relating to
// other data. If we don't recall from database then the user could change
// their name or picture which would either lead to inconsistent records or
// errors when trying to submit new grades.

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser(async (id, done) => {
		try {
			// get user from db
			let sql = "SELECT * FROM users WHERE id = ? LIMIT 1";
			var [user, _] = await db.query(sql, [id]);
			// return user's row from db - attaches to req.user
			done(null, { ...user[0] });
		} catch (error) {
			console.log(error);
		}
	});

	// setup the strategy
	passport.use(
		"slack",
		new SlackStrategy(
			{
				clientID: process.env.SLACK_CLIENT_ID,
				clientSecret: process.env.SLACK_CLIENT_SECRET,
				callbackURL: process.env.SLACK_CALLBACK_URL,
				
				scope: ["identity.basic", "identity.email", "identity.avatar"],
			},
			// removing accessToken and refreshToken causes errors and 
			// authentication failure  
			async (accessToken, refreshToken, profile, done) => {
				try {
					// query db for user
					let sql = "SELECT * FROM users WHERE id = ?";
					var [result, _] = await db.query(sql, [profile.id]);
					// add to db if new user
					if (result.length == 0) {
						let sql = "INSERT INTO users (id, name, email, avatar_url) \
									values (?,?,?,?)";
						let values = [profile.id, profile.user.name, profile.user.email, profile.user.image_512];
						var [result, _] = await db.query(sql, values);
					}
					done(null, profile.user);
				} catch (error) {
					console.log(error);
				}
			}
		)
	);
};
