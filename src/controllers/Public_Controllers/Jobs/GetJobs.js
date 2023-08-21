const { Job, User} = require('../../../db');

const GetJobs = async (req, res) => {
  const id = req.user?.id; //

  try {
    const jobs = await Job.findAll({
      where: {
        userId: id, 
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'picture'],
        },
      ],
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = GetJobs;
