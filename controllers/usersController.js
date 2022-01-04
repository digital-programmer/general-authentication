const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = process.env.BCRYPT_SALT;

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
        req.flash('error', 'Password and confirm password do not match');
        return res.redirect("back");
    }

    User.findOne({ email: req.body.email }, async function (err, user) {
        if (err) {
            console.log("Error in finding user in signing up");
            return;
        }

        if (!user) {
            const hash = await bcrypt.hash(req.body.password, Number(bcryptSalt));
            User.create({ email: req.body.email, password: hash, name: req.body.name }, function (err, user) {
                if (err) {
                    console.log("Error in signing up user");
                    return;
                }
                req.flash('success', 'Account Created Successfully');
                return res.redirect("/users/sign-in");
            });
        } else {
            req.flash('error', 'Account Already Exists, Sign in');
            return res.redirect("/users/sign-in");
        }

    });
}

// create user session
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}


// exit user session
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'Logged out successfully');
    return res.redirect('/users/sign-in');
}

// reset password page
module.exports.resetPassword = function (req, res) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You have to be logged in');
        return res.redirect("/users/sign-in");
    }
    return res.render('password_reset', {
        title: "Reset Password",
    });
}


// reset password page
module.exports.setNewPassword = function (req, res) {

    if (!req.isAuthenticated()) {
        req.flash('error', 'You have to be logged in');
        return res.redirect("/users/sign-in");
    }

    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
        req.flash('error', "Passwords don't match");
        return res.redirect('/users/reset-password');
    }

    User.findOne({ email: req.user.email }, async function (err, user) {
        if (err) {
            console.log("Error in finding user");
            return;
        }

        if (user) {
            const hash = await bcrypt.hash(newPassword, Number(bcryptSalt));
            user.password = hash.toString();
            user.save();
            req.flash('success', 'Password changed successfully');
            return res.redirect("/");
        } else {
            req.flash('error', 'User not Found');
            return res.redirect("/users/sign-in");
        }
    });

}
