const User = require('../models/user');

module.exports.home = function (req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect("/users/sign-in");
    }
    return res.render("home", {
        title: "Home",
    });
};