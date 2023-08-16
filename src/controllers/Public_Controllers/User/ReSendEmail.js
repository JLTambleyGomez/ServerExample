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
  subject: "Nuevo enlace de verificacion de Programmers Guru",
  html: `
    <h1>¡Hola ${name}!</h1>
    <img src="https://res.cloudinary.com/ddectuilp/image/upload/v1691336612/Programmers_d0arws.png" alt="Programmers Guru" width="300">
    <p>Gracias por registrarte en nuestra aplicación. ¡Esperamos que disfrutes usando nuestros servicios!</p>
    <p>Puedes dejar comentarios y puntuaciones en tu proyecto una vez publicado en nuestra página para esto.</p>
    <h2>Haz clic en el siguiente enlace para verificar tu correo electrónico:</h2>
    <a href="${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}">${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}</a>
    <p>Saludos,</p>
    <p>El equipo de ProgrammersGuru</p>
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
  
  
