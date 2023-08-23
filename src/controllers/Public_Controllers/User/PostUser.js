  const { User } = require('../../../db');
  const generacion_de_clave = require ("../../../security/generacion_de_clave")
  const bcrypt = require('bcrypt');
  const Nodemailer_Emails_Notifications = require('../../Utils/Nodemailer_Emails_Notifications');


  
  const PostUser = async (req, res) => {
      try {
        const { name, email, password ,externalUser,picture} = req.body;
        let pictureUrl = 'https://res.cloudinary.com/ddectuilp/image/upload/v1692725809/Welcome_f74obp.png';
        const existingUser = await User.findOne({ where: { email } });


  /////////////////SI NO HAY NOMBRE OCUPAR PARTE DEL EMAIL /////////////////////////////////////////////////////////////////////////////
        if (!name) {
          name = email.split('@')[0]; 
        }

      
  //////////////////////////////////////////////////////////////////////////////////////////////
        if (existingUser) {
          return res.status(409).json({ message: 'El email ya está en uso. Por favor, elija otro email.' });
        }



        
  ///////////////////////////generacion de token de verificacion de email //////////////////////////////////////////////////////////////////////////////
        const keyLengthInBytes = 32;
        const secretKey = await generacion_de_clave(keyLengthInBytes)
        const verificationToken = secretKey
      

  ///////////////////////////Creating User Functions//////////////////////////
/////////////////////////////////EXTERNAL USER////////////////////////////////
  if (externalUser) {

    const newUser = await User.create({
        name,
        email,
        externalUser: true, // Marca el usuario como externo
        picture: picture || pictureUrl,
        verificationToken,
        tokenCreationTime: new Date()
    });

    // Nodemailer
    await Nodemailer_Emails_Notifications.sendWelcomeEmail(email, name, verificationToken);

    return res.status(201).json(newUser);
}

/////////////////////////////////////NON-EXTERNAL-USER ///////////////////////////////////////////
 /////////////PROCESO DE ENCRIPTADO DE CONTRASEÑA (CAMBIAR SALTROUNDS PARA AUMENTAR SEGURIDAD)//////////////////////////////////////////////////////////////////////////////
 const saltRounds = 10;
 const salt = await bcrypt.genSalt(saltRounds);
 const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          picture: pictureUrl,
          verificationToken,
          tokenCreationTime: new Date()
        });

  //Nodemailer /////////////////////////////////////////////////////////////////////////////////
  await Nodemailer_Emails_Notifications.sendWelcomeEmail(email, name, verificationToken);

  /////////////////////////////////////////////////////////////////////////////////////////////////////

        return res.status(201).json(newUser);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
    };
    
    module.exports = PostUser;
    
    
