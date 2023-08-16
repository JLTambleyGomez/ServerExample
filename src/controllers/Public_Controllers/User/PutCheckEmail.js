const { User } = require('../../../db');

const PutCheckEmail = async (req, res) => {
  const verificationToken = req.body.verificationToken; // Asegúrate de acceder al token correctamente
  try {
    const user = await User.findOne({
      where: {
        verificationToken: verificationToken
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado o token inválido' });
    }

    // Verificar si el token ha expirado
    const currentTime = new Date();
    const tokenCreationTime = new Date(user.tokenCreationTime);
    const tokenExpirationTimeInHours = 24; // Tiempo de expiración en horas

    const timeDifferenceInMilliseconds = currentTime - tokenCreationTime;
    const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

    if (timeDifferenceInHours > tokenExpirationTimeInHours) {
      return res.status(400).json({ error: 'El token de verificación ha expirado' });
    }

    // Actualizar la propiedad checkedemail
    user.checkedemail = true;
    user.verificationToken = null; 
    user.tokenCreationTime = null; 

    await user.save();

    return res.status(200).json({ message: 'Correo electrónico verificado exitosamente' });
  } catch (err) {
    console.error('Error updating checked email:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = PutCheckEmail;
