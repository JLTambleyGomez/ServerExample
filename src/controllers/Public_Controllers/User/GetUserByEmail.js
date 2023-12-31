const { User, Job } = require('../../../db');

const GetUserByEmail = async (req, res) => {
  try {
    const userEmail = req.user?.email; 
    const user = await User.findOne({
      where: { email: userEmail},
      include: [
        {
          model: Job,
          attributes: ['id', 'name', 'jobTitle', 'stage', 'url'],
       
       
        },
       
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = GetUserByEmail;