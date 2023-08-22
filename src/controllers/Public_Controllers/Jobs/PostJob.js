const { Job } = require('../../../db');

const PostJob = async (req, res) => {
  try {
    const id = req.user?.id; //

    const { name,url, jobTitle, stage  } = req.body;

    const newJob = await Job.create({
      name,
      url,
      jobTitle,
      stage,
      userId:id ,
      date: new Date(),
    });

    return res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = PostJob;
