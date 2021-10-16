// middleware for blocking access to routes based on permissions
async function checkPermission(req, res, next) {
	const action = `${req.method} ${req.path.toLowerCase()}`;
	let permit = false;

	try {
		switch (action) {
			// Cases for each route where checkPermission is used
			case "POST /add-grade": {
				permit = true;
				break;
			}
			case "POST /edit-grade": {
				// Check if user owns record
				[user, _] = await db.query("SELECT user_id FROM grades WHERE id=?", [req.body.grade_id]);
				permit = req.user.id == user[0].user_id;
				break;
			}
		}
		if (permit) {
			next();
		} else {
			res.status(403).send("<h3>403: Forbidden</h3>");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("<h3>500: Internal server error</h3>");
	}
}

module.exports = checkPermission;
