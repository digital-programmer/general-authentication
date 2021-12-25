const User = require('../models/user')

// render signup page
module.exports.signUp = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return res.render("user_signup", {
        title: "Sign Up",
    });
}


// render signin page
module.exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return res.render("user_signin", {
        title: "Sign In",
    });
}

// get the signup data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect("back");
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log("Error in finding user in signing up");
            return;
        }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) {
                    console.log("Error in signing up user");
                    return;
                }
                return res.redirect("/users/sign-in");
            });
        } else {
            return res.redirect("back");
        }

    })

}

// create user session
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}


// exit user session
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    return res.redirect('/users/sign-in');
}