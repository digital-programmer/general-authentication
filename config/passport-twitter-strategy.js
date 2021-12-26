const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// tell passport to use a new strategy to use google login
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,

},

    function (accessToken, refreshToken, profile, done) {
        // find a user
        console.log(profile);
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log("Error in Twitter strategy: ", err);
                return;
            }
            if (user) {
                // if user found, set this user as req.user
                return done(null, user);
            } else {
                // if no user found, create a user and set user as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                }, function (err, user) {
                    if (err) {
                        console.log("Error in creating user", err);
                        return;
                    }
                    return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;