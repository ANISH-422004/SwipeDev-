const nodeMailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth:{
        user : config.EMAIL_USER , 
        pass : config.EMAIL_PASS
    }

})
// Email send function for HTML content
const sendEmail = async ({to, subject, htmlContent}) => {
    try {
      const info = await transporter.sendMail({
        from: config.EMAIL_USER, // Sender address
        to, // Receiver address
        subject, // Subject line
        html: htmlContent, // HTML content
      });
  
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  };
  
  module.exports = { sendEmail };