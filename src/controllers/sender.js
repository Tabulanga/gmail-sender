const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.password,
  },
});

const sender = options => transporter.sendMail(options, (error, info) => {
  if (error) return console.error('Sending error', error.message);

  return console.log('Email sent: ', info.response);
});

exports.send = ({ to, subject, message }) => sender({
  from: config.gmail.user,
  to,
  subject,
  text: message,
});
