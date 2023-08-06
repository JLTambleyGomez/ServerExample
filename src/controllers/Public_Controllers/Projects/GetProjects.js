const { Project, User, Review } = require('../../../db');

const GetProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'picture'],
        },
        {
          model: Review,
          attributes: ['id', 'Name', 'Opinion', 'rating'],
          include: {
            model: User,
            attributes: ['id', 'name', 'email', 'picture'],
          },
        },
      ],
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = GetProjects;
