const nodemailer = require("../config/nodemailer");

exports.newPassword = (data) => {
    // receive the user mail ID and send the new password to user through mail
    let htmlString = nodemailer.renderTemplate({ user: data.user, password: data.password }, "/forgot_password/new_pass.ejs");
    nodemailer.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: data.user.email,
        subject: "Here's your new Password",
        html: htmlString
    }, (err, info) => {
        if (err) { console.log("Error in sending mail", err); return; }
        console.log("Message sent", info);
        return;
    })
}