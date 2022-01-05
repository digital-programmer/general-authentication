const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const passwordMailer = require("../mailers/password-mailer");
const commentEmailWorker = require("../workers/forgot_password_email_worker");
const queue = require("../config/kue");
const bcryptSalt = process.env.BCRYPT_SALT;

module.exports.index = function (req, res) {
    return res.render('forgot_pass', {
        title: 'Forgot Password'
    })
};

module.exports.sendPassword = function (req, res) {
    try {
        User.findOne({ email: req.body.email }, async function (err, user) {
            if (err) {
                console.log("Error in finding user in signing up");
                req.flash('error', "An error occured, please try again");
                return res.redirect('back');
            }

            if (user) {
                let newPassword = crypto.randomBytes(12).toString("hex");
                const hash = await bcrypt.hash(newPassword, Number(bcryptSalt));

                let job = queue.create('emails', { user, password: newPassword }).save(function (err) {
                    if (err) {
                        console.log("Error in creating queue");
                        return;
                    }
                });

                user.password = hash;
                user.save();
                req.logout();
                req.flash('success', 'New Password sent. Check your mail');
                return res.redirect('/users/sign-in');

            } else {
                req.flash('error', 'Account does not exist, sign up');
                return res.redirect("/users/sign-up");
            }
        });

    } catch (err) {
        console.log(err);
        req.flash('error', "An error occured, please try again");
        return res.redirect('back');
    }

};