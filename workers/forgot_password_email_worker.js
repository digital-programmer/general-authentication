const queue = require("../config/kue");
const passwordMailer = require("../mailers/password-mailer");


queue.process('emails', function (job, done) {
    console.log(job.data);
    passwordMailer.newPassword(job.data);
    done();
})