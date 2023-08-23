const cloudinary = require('cloudinary').v2;

require('dotenv').config();

const { CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY,
});

const uploadImage = async (buffer) => {
  try {
    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'Users_Images', // Especifica la carpeta en Cloudinary
        },
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

    return uploadedImage.secure_url;
  } catch (error) {
    console.error("Error al subir el archivo a Cloudinary:", error);
    throw new Error("Error interno del servidor al subir la imagen");
  }
};

module.exports = {
  uploadImage,
};
