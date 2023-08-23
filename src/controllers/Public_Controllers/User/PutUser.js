const cloudinary = require('cloudinary').v2;
const { User } = require('../../../db');
const bcrypt = require('bcrypt');
const Nodemailer_Emails_Notifications = require('../../Utils/Nodemailer_Emails_Notifications');
const CloudinaryService = require('../../Utils/CloudinaryService');


require('dotenv').config();




const PutUser = async (req, res) => {

    try {  
    const Userid = req.user.id
    const email = req.user.email
    const UserAdmin= req.user.admin

    const { name, password,admin } = req.body;

        const user = await User.findOne({
          where: {
            id: Userid
          }
        });
  
    
//////////SE TOMA EL ARCHIVO (USAR MULTER VERIFICA LAS RUTAS)/////////////////
if (req.file) {
    try {
       const pictureUrl = await CloudinaryService.uploadImage(req.file.buffer);
        user.picture = pictureUrl;
  
    } catch (error) {
        console.error( error);
        return res.status(500).json({
            error: "Error interno del servidor al subir la imagen",
        });
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
user.name = name || user.name;

if (UserAdmin && admin) {
  user.admin = admin;
}  
if  (password !== null && password !== undefined && password !== "") {
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
    await Nodemailer_Emails_Notifications.sendProfileUpdateEmail(email, name);


    return res.status(200).json({ message: 'Usuario modificado exitosamente' });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = PutUser;
