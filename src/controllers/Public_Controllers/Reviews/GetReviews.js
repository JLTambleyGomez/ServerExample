const { Review, User, Project } = require('../../../db');

const GetReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'picture'],
        },
        {
          model: Project,
          attributes: ['id', 'name', 'description', 'picture', 'url'],
          include: {
            model: User,
            attributes: ['id', 'name', 'email', 'picture'],
          },
        },
      ],
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = GetReviews;
