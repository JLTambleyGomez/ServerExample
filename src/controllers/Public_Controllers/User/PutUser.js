const cloudinary = require('cloudinary').v2;
const { User } = require('../../../db');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
require('dotenv').config();


const {PASSWORD,OFFICIAL_EMAIL, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY,DEPLOYMENT_URL } = process.env;


cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY,
});

const PutUser = async (req, res) => {

    try {  
    const Userid = req.user.id
    const email = req.user.email
    const UserAdmin= req.user.admin

    const { name, password, country,admin } = req.body;

    console.log(name, password, country, admin,)
        const user = await User.findOne({
          where: {
            id: Userid
          }
        });
  
    
//////////SE TOMA EL ARCHIVO (USAR MULTER VERIFICA LAS RUTAS)/////////////////
if (req.file) {
    try {
        const buffer = req.file.buffer;
        const uploadedImage = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        console.log("Subiendo imagen a Cloudinary");
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            ).end(buffer);
        });

        const pictureUrl = uploadedImage.secure_url;
        user.picture = pictureUrl;
    } catch (error) {
        console.error("Error al subir el archivo a Cloudinary:", error);
        return res.status(500).json({
            error: "Error interno del servidor al subir la imagen",
        });
    }
}
/////////////////SI NO HAY NOMBRE OCUPAR PARTE DEL EMAIL /////////////////////////////////////////////////////////////////////////////
if (name) {
    user.name = name;
  }
  
  if (country) {
    user.country = country;
  }
  
  if (UserAdmin && admin ) {
    user.admin = admin;
  }
  
if (password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }
  
///////////////////////////generacion de token de verificacion de email //////////////////////////////////////////////////////////////////////////////
    

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

  

    // Actualizar la propiedad del usuario 

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
    subject: "Usuario Modificado Programmers Guru",
    html: `
      <h1>¡Hola ${name}!</h1>
      <img src="https://res.cloudinary.com/ddectuilp/image/upload/v1691336612/Programmers_d0arws.png" alt="Programmers Guru" width="300">
      <p> Usuario ha sido modificado exitosamente </p>
      <p>Gracias por usar  nuestra aplicación. ¡Esperamos que disfrutes usando nuestros servicios!</p>
      <p>Saludos,</p>
      <p>El equipo de ProgrammersGuru</p>
    `,
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending welcome email:', error);
    } else {
      console.log(' email sent:', info.response);
    }
  });
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  transporter.close(); // Cerrar la conexión del transportador

    return res.status(200).json({ message: 'Usuario modificado exitosamente' });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = PutUser;
