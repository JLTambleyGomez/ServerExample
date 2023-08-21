const { User } = require('../../../db');
const nodemailer = require("nodemailer");
require('dotenv').config();

const {PASSWORD,OFFICIAL_EMAIL,DEPLOYMENT_URL } = process.env;

const ReSendEmail = async (req, res) => {
    try {
        const id = req.user?.id

      const user = await User.findOne({ where: { id } });
       const name = user.name
       const verificationToken = user.verificationToken
    
      user.tokenCreationTime = new Date()
      await user.save();


//Nodemailer /////////////////////////////////////////////////////////////////////////////////
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: OFFICIAL_EMAIL,
    pass: PASSWORD,
  },
});

const mailOptions = {
  from: OFFICIAL_EMAIL,
  to: email,
  subject: "New JobAppTracker Verification Link",
  html: `
  <h1>Hello ${name}!</h1>
  <img src="https://res.cloudinary.com/ddectuilp/image/upload/v1692577472/_e2a8c7ab-240a-43e1-88ba-08eae9b0b5ba_mcpwjk.jpg" alt="Programmers Guru" width="300">
  <p>Thank you for registering with our application. We hope you enjoy using our services!</p>
  <h2>This is your new link to verify your email:</h2>
  <a href="${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}">${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}</a>
  <p>Best regards,</p>
  <p>The JobAppTracker Team</p>
  
  `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error Re-sending verification email:', error);
  } else {
    console.log('Verification email sent:', info.response);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
transporter.close(); // Cerrar la conexión del transportador

      return res.status(201).json({message: 'Token Actualizado'});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  
  module.exports = ReSendEmail;
  
  
