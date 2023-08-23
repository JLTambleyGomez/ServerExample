const bcrypt = require('bcrypt');
const { User } = require('../../../db');
const jwt = require('jsonwebtoken');

const { Secret_Key_Security } = process.env;
const secretKey = Secret_Key_Security;

const AuthenticateUser = async (req, res) => {
  try {
    const { email, password,admin,externalUser } = req.body;
       //validación (sanitizado)
       if (!email ) {
        return res.status(400).json({ message: 'Por favor, ingrese un email y una contraseña válida' });
      }
      //

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    if (!externalUser) {
      if (!password) {
        return res.status(400).json({ message: 'Por favor, ingrese una contraseña válida' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Email o contraseña incorrectos' });
      }
    }


    // Incluir el campo 'admin' en el payload del token
    const payload = { id: user.id, email: user.email, admin: user.admin };
     
    let expirationToken = '3h'
    if (admin) {
      expirationToken = '24h'
    }
    // Generar el token de autenticación
    const token = jwt.sign(payload, secretKey, { expiresIn: expirationToken });
   

    return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = AuthenticateUser;

 