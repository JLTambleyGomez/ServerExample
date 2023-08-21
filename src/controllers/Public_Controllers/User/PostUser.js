const cloudinary = require('cloudinary').v2;
const { User } = require('../../../db');
const nodemailer = require("nodemailer");
const generacion_de_clave = require ("../../../security/generacion_de_clave")
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
      const { name, email, password, country,admin } = req.body;
      let isAdmin = false;
      let pictureUrl = 'https://res.cloudinary.com/ddectuilp/image/upload/v1691329757/_b79b5441-a3f7-449e-ba5d-24c5be6c9207_q4m1au.jpg';
      const existingUser = await User.findOne({ where: { email } });

//////////SE TOMA EL ARCHIVO (USAR MULTER VERIFICA LAS RUTAS)/////////////////

/////////////////SI NO HAY NOMBRE OCUPAR PARTE DEL EMAIL /////////////////////////////////////////////////////////////////////////////
      if (!name) {
        name = email.split('@')[0]; 
      }
      if (!country) {
        country= "No Especificado"
      }

      if(admin==="on"){
        isAdmin=true
      }
//////////////////////////////////////////////////////////////////////////////////////////////
      if (existingUser) {
        return res.status(409).json({ message: 'El email ya está en uso. Por favor, elija otro email.' });
      }
/////////////PROCESO DE ENCRIPTADO DE CONTRASEÑA (CAMBIAR SALTROUNDS PARA AUMENTAR SEGURIDAD)//////////////////////////////////////////////////////////////////////////////
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
///////////////////////////generacion de token de verificacion de email //////////////////////////////////////////////////////////////////////////////
      const keyLengthInBytes = 32;
       const secretKey = await generacion_de_clave(keyLengthInBytes)
      const verificationToken = secretKey
      console.log(verificationToken)

/////////////////////////////////////////////////////
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        picture: pictureUrl,
        admin:isAdmin,
        country,
        verificationToken,
        tokenCreationTime: new Date()
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
  subject: "Welcome to JobAppTracker",
  html: `
    <h1>Hello ${name}!</h1>
    <img src="https://res.cloudinary.com/ddectuilp/image/upload/v1692577472/_e2a8c7ab-240a-43e1-88ba-08eae9b0b5ba_mcpwjk.jpg" alt="Programmers Guru" width="300">
    <p>Thank you for registering with our application. We hope you enjoy using our services!</p>
    <p>You can keep track of and manage your job applications on our website.</p>
    <h2>Click on the following link to verify your email:</h2>
    <a href="${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}">${DEPLOYMENT_URL}/VerifyEmail?token=${verificationToken}</a>
    <p>Best regards,</p>
    <p>The JobAppTracker Team</p>
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
  
  
