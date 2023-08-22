const { Job} = require('../../../db');

const PutJob = async (req, res) => {
  try {
    const { jobId,stage } = req.body;

    const job = await Job.findOne({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.stage = stage ?? job.stage;

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = PutJob;
