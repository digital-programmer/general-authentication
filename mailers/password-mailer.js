const nodemailer = require("../config/nodemailer");

exports.newPassword = (user) => {
    let htmlString = nodemailer.renderTemplate({ user }, "/forgot_password/new_pass.ejs");
    nodemailer.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Here's your new Password",
        html: htmlString
    }, (err, info) => {
        if (err) { console.log("Error in sending mail", err); return; }
        console.log("Message sent", info);
        return;
    })
}