const { Job } = require('../../../db');


const PutJob = async (req, res) => {
    try {
      const id = req.user?.id; //
      const { name, url, jobTitle, stage, } = req.body;
  
      const job = await Job.findOne({
        where: {
          userId: id
        }
      });
  
      job.name = name ?? job.name;
      job.url = url ?? job.url;
      job.jobTitle = jobTitle ?? job.jobTitle;
      job.stage = stage ?? job.stage;
  
      await job.save();
  
      return res.status(201).json(job);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  
  module.exports = PutJob;
  