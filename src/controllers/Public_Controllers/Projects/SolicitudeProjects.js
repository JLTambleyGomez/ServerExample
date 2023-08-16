const nodemailer = require("nodemailer");
require('dotenv').config();

const SolicitudeProjects = async (req, res) => {
  const user = req.user
  const email = req.user.email
  if (!user) {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }
  const { message,phone} = req.body;
  const { OFFICIAL_EMAIL, PASSWORD } = process.env;

  console.log(email,message,phone)

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: OFFICIAL_EMAIL,
        pass: PASSWORD
      }
    });

    const sendEmail = async (mailOptions) => {
      try {
        await transporter.sendMail(mailOptions);
        console.log("Correo enviado:", mailOptions.to);
      } catch (error) {
        console.error("Error al enviar correo:", error);
        throw error;
      }
    };

    const sender = {
      from: "yo",
      to: email,
      subject: "Notificación de: Nuestra página",
      text: `Ha solicitado nuestro servicio y le contestaremos lo más pronto posible. Si tiene alguna duda, consulte a ${OFFICIAL_EMAIL}`
    };
    const service = {
      from: "yo",
      to: OFFICIAL_EMAIL,
      subject: "Notificación de: Nuestra página",
      text: `${message}, solicitud enviada por ${email}, numero de telefono ${phone}`
    };

    await sendEmail(sender);
    await sendEmail(service);

    transporter.close(); // Cerrar la conexión del transportador

    res.status(200).send("Correos electrónicos enviados correctamente.");
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).send("Error al enviar correos electrónicos.");
  }
};

module.exports = SolicitudeProjects;
