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
    const userId = req.user?.id

    if (!isAdmin) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }
    const { name, description, url, urlPicture} = req.body;
    console.log(name,description,url,urlPicture)

    let pictureUrl="https://res.cloudinary.com/ddectuilp/image/upload/v1691994192/1_bdlq4m.png"

    if(urlPicture){
      pictureUrl=urlPicture
    }

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

        const pictureUploaded = uploadedImage.secure_url;
         pictureUrl=pictureUploaded
    } catch (error) {
        console.error("Error al subir el archivo a Cloudinary:", error);
        return res.status(500).json({
            error: "Error interno del servidor al subir la imagen",
        });
    }
}

    const newProject = await Project.create({
      name:name,
      description:description,
      picture: pictureUrl,
      url:url,
      userId:userId,
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = PostProject;
