const { User } = require('../../../db');
const Nodemailer_Emails_Notifications = require('../../Utils/Nodemailer_Emails_Notifications');



const ReSendEmail = async (req, res) => {
    try {
        const id = req.user?.id
        const email = req.user?.email

      const user = await User.findOne({ where: { id } });
       const name = user.name
       const verificationToken = user.verificationToken
    
      user.tokenCreationTime = new Date()
      await user.save();


//Nodemailer /////////////////////////////////////////////////////////////////////////////////
await Nodemailer_Emails_Notifications.ReSendEmail(email, name,verificationToken);


      return res.status(201).json({message: 'Token Actualizado'});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  
  module.exports = ReSendEmail;
  
  
