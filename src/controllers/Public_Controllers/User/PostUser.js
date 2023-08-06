const cloudinary = require('cloudinary').v2;
const { User } = require('../../../db');
const fs = require('fs'); 
const bcrypt = require('bcrypt');
require('dotenv').config();

const { CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY,
});
const PostUser = async (req, res) => {
    try {
      const { name, email, password, country, admin } = req.body;
      let pictureUrl = '';
      const existingUser = await User.findOne({ where: { email } });

      

      if (req.file) {
        const uploadedImage = await cloudinary.uploader.upload(req.file.path);
        pictureUrl = uploadedImage.secure_url;

        fs.unlinkSync(req.file.path);
      }
      if (existingUser) {
        return res.status(409).json({ message: 'El email ya está en uso. Por favor, elija otro email.' });
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        picture: pictureUrl,
        country,
        admin,
      });
      console.log("Posting New User, your cool man ");
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  
  module.exports = PostUser;
  
  
