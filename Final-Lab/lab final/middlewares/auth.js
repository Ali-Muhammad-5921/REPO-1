// auth.js in middleware folder
const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
    const userId = req.cookies?.uid;

    if (!userId) {
        return res.redirect("/admin/login"); // Redirect to login if no userId cookie
    }

    const user = getUser(userId);

    if (!user) {
        return res.redirect("/admin/login"); // Redirect if user doesn't exist
    }

    req.user = user;
    next(); // Proceed if user is authenticated
}

module.exports = { restrictToLoggedInUserOnly };
