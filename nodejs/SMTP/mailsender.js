const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'challenge.noreply@gmail.com',
    pass: 'ChaNor170623!&',
  },
});

 const sendValidationEmail = (email, token) => {
    const mailOptions = {
      from: 'challenge.noreply@gmail.com',
      to: email,
      subject: 'Email Validation',
      text: `Please click the following link to validate your email: ${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = {
    sendValidationEmail,
  };