const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        // find a user to establish identity
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                req.flash('error', err);
                return done(err);
            }

            if (!user || user.password != password) {
                req.flash('error', 'Invalid Username or password');
                return done(null, false);
            }

            return done(null, user);
        })
    }
));


// serialising the user to decide which key is to be kept in cookies and cookie is send to browser automatically in response
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// deserialising the user from the key in the cookies when browser makes a request
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log("Error in finding user --> Passport");
            return done(err);
        }

        return done(null, user);
    })
});


// check if user is already authenticated
passport.checkAuthentication = function (req, res, next) {
    // pass on the request to next() function i.e controller
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not signed in
    return res.redirect("/users/sign-in");

}


passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        // req.user contains the current user from session cookie and we are sending it to the res.locals for viewing
        res.locals.user = req.user;
    }
    return next();
}


module.exports = passport;