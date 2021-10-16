// This makes req.user available via 'user' and req via 'req' in all views.
// Alternative is passing these manually to every route
// for use in nav and other views.
function putObjectsInAllViews(req, res, next) {
	res.locals.user = req.user;
	res.locals.req = req;
	next();
}

module.exports = putObjectsInAllViews;
