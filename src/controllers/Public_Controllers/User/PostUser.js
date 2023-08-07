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
      let pictureUrl = '';
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
  text: `¡Hola ${name}!\n\nGracias por registrarte en nuestra aplicación. 
  ¡Esperamos que disfrutes usando nuestros servicios!\n\nPor favor,
   haz clic en el siguiente enlace para verificar tu correo electrónico:
    ${DEPLOYMENT_URL}/VerifyEmail\n\nSaludos,\nEl equipo de ProgrammersGuru`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending welcome email:', error);
  } else {
    console.log('Welcome email sent:', info.response);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

      console.log("Posting New User, your cool man ");
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  
  module.exports = PostUser;
  
  
