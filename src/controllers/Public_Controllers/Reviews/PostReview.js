const { Review } = require('../../../db');

const PostReview = async (req, res) => {
  try {
    const { name,projectName, opinion, rating,userId  } = req.body;

    const newReview = await Review.create({
      name,
      projectName,
      opinion,
      rating,
      userId ,
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = PostReview;
