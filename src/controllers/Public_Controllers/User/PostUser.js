const cloudinary = require('cloudinary').v2;
const { User } = require('../../../db');
const nodemailer = require("nodemailer");
const fs = require('fs'); 
const bcrypt = require('bcrypt');
require('dotenv').config();

const {PASSWORD,OFFICIAL_EMAIL, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY,DEPLOYMENT_URL } = process.env;


cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY,
});
const PostUser = async (req, res) => {
    try {
      const { name, email, password, country } = req.body;
      let pictureUrl = 'https://res.cloudinary.com/ddectuilp/image/upload/v1691329757/_b79b5441-a3f7-449e-ba5d-24c5be6c9207_q4m1au.jpg';
      const existingUser = await User.findOne({ where: { email } });

//////////SE TOMA EL ARCHIVO (USAR MULTER VERIFICA LAS RUTAS)/////////////////
      if (req.file) {
        const uploadedImage = await cloudinary.uploader.upload(req.file.path);
        pictureUrl = uploadedImage.secure_url;
////////////////////BORRAR LA IMAGEN DEL CACHE////////////////////////////////////////////////////////
        fs.unlinkSync(req.file.path); }
/////////////////SI NO HAY NOMBRE OCUPAR PARTE DEL EMAIL /////////////////////////////////////////////////////////////////////////////
      if (!name) {
        name = email.split('@')[0]; 
      }
      if (!country) {
        country= "No Especificado"
      }
//////////////////////////////////////////////////////////////////////////////////////////////
      if (existingUser) {
        return res.status(409).json({ message: 'El email ya está en uso. Por favor, elija otro email.' });
      }
/////////////PROCESO DE ENCRIPTADO DE CONTRASEÑA (CAMBIAR SALTROUNDS PARA AUMENTAR SEGURIDAD)//////////////////////////////////////////////////////////////////////////////
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
///////////////////////////////////////////////////////////////////////////////////////////////////////////
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        picture: pictureUrl,
        country,
      });

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
  subject: "Bienvenido a Programmers Guru",
  html: `
    <h1>¡Hola ${name}!</h1>
    <img src="https://res.cloudinary.com/ddectuilp/image/upload/v1691336612/Programmers_d0arws.png" alt="Programmers Guru" width="300">
    <p>Gracias por registrarte en nuestra aplicación. ¡Esperamos que disfrutes usando nuestros servicios!</p>
    <p>Puedes dejar comentarios y puntuaciones en tu proyecto una vez publicado en nuestra página para esto.</p>
    <h2>Haz clic en el siguiente enlace para verificar tu correo electrónico:</h2>
    <a href="${DEPLOYMENT_URL}/VerifyEmail">${DEPLOYMENT_URL}/VerifyEmail</a>
    <p>Saludos,</p>
    <p>El equipo de ProgrammersGuru</p>
  `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending welcome email:', error);
  } else {
    console.log('Welcome email sent:', info.response);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
transporter.close(); // Cerrar la conexión del transportador

      console.log("Posting New User, your cool man ");
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  
  module.exports = PostUser;
  
  
