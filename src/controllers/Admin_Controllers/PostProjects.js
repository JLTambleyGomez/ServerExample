const cloudinary = require('cloudinary').v2;
const { Project } = require('../../db');
require("dotenv").config();

const { CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY } = process.env;

// Configura las credenciales de Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY,
});

const PostProject = async (req, res) => {
  try {
    const isAdmin = req.user?.admin; //

    if (!isAdmin) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const { name, description, picture, url, userId } = req.body;

    const uploadedImage = await cloudinary.uploader.upload(picture);
    const pictureUrl = uploadedImage.secure_url;

    const newProject = await Project.create({
      name,
      description,
      picture: pictureUrl,
      url,
      userId,
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = PostProject;
