const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = process.env.BCRYPT_SALT;

// tell passport to use a new strategy to use google login
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},

    function (accessToken, refreshToken, profile, done) {
        // find a user
        User.findOne({ email: profile.emails[0].value }).exec(async function (err, user) {
            if (err) {
                console.log("Error in google strategy: ", err);
                return;
            }
            if (user) {
                // if user found, set this user as req.user
                return done(null, user);
            } else {
                let resetToken = await crypto.randomBytes(32).toString("hex");
                const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
                // if no user found, create a user and set user as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: hash,
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