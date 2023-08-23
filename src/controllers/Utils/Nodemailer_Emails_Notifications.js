const nodemailer = require("nodemailer");
require('dotenv').config();

const { OFFICIAL_EMAIL, PASSWORD, DEPLOYMENT_URL } = process.env;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: OFFICIAL_EMAIL,
        pass: PASSWORD,
    },
});

const sendWelcomeEmail = async (toEmail, name, verificationToken) => {
    const mailOptions = {
        from: OFFICIAL_EMAIL,
        to: toEmail,
        subject: "Welcome to JobAppTracker",
        html: `
            <h1>Hello ${name}!</h1>
            <img src="https://res.cloudinary.com/ddectuilp/image/upload/v1692725809/Welcome_f74obp.png" alt="JobAppTracker" width="300">
            <p>Thank you for registering with our application. We hope you enjoy using our services!</p>
            <p>You can keep track of and manage your job applications on our website.</p>
            <h2>Click on the following link to verify your email:</h2>
            <a href="${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}">${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}</a>
            <p>Best regards,</p>
            <p>The JobAppTracker Team</p>
        `,
    };

    return transporter.sendMail(mailOptions)
    .then(() => {
        transporter.close(); 
    });
};

const sendProfileUpdateEmail = async (toEmail, name) => {
    const mailOptions = {
        from: OFFICIAL_EMAIL,
        to: toEmail,
        subject: "User Modified on JobAppTracker",
        html: `
            <h1>Hello ${name}!</h1>
            <img src="https://res.cloudinary.com/ddectuilp/image/upload/v1692663705/home2_rpur5u.png" alt="JobAppTracker" width="300">
            <p>Your user profile has been successfully modified.</p>
            <p>Thank you for using our application. We hope you continue to enjoy our services!</p>
            <p>Best regards,</p>
            <p>The JobAppTracker Team</p>
        `,
    };
    return transporter.sendMail(mailOptions)
    .then(() => {
        transporter.close(); 
    });
};

const ReSendEmail = async (toEmail, name,verificationToken) => {
    const mailOptions = {
        from: OFFICIAL_EMAIL,
        to: toEmail,
        subject: "New JobAppTracker Verification Link",
        html: `
        <h1>Hello ${name}!</h1>
        <img src="https://res.cloudinary.com/ddectuilp/image/upload/v1692663705/home2_rpur5u.png" alt="JobAppTracker" width="300">
        <p>Thank you for registering with our application. We hope you enjoy using our services!</p>
        <h2>This is your new link to verify your email:</h2>
        <a href="${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}">${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}</a>
        <p>Best regards,</p>
        <p>The JobAppTracker Team</p>
        
        `,
      };

      return transporter.sendMail(mailOptions)
      .then(() => {
          transporter.close(); 
      });
};

module.exports = {
    sendWelcomeEmail,
    sendProfileUpdateEmail,
    ReSendEmail
};
