const { User, Project, Review } = require('../../db');

const GetUsers = async (req, res) => {
  try {
    const isAdmin = req.user?.admin; //

    if (!isAdmin) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const users = await User.findAll({
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'description', 'picture', 'url'],
          include: {
            model: Review,
            attributes: ['id', 'Name', 'Opinion', 'rating'],
            include: {
              model: Project,
              attributes: ['id', 'name', 'description', 'picture', 'url'],
            },
          },
        },
        {
          model: Review,
          attributes: ['id', 'Name', 'Opinion', 'rating'],
          include: {
            model: Project,
            attributes: ['id', 'name', 'description', 'picture', 'url'],
          },
        },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = GetUsers;
