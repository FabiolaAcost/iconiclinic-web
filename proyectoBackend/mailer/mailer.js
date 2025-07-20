const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fabiestefania307@gmail.com",
    pass: "myqwaiczeywfqckh" 
  }
});

module.exports = transporter;