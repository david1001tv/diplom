const nodemailer = require('nodemailer');
const config =require('./../../../config');

function sendMail (user = {}, password = '') {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.mail.login,
      pass: config.mail.pass
    }
  });

  const mailOptions = {
    from: '"CoolConfa TEAM" <no-reply@coolconfa.com>',
    to: user.email,
    subject: 'Your password',
    text: 'Login: ' + user.login + '\n\nPassword: ' + password
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

module.exports = sendMail;
