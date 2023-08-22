const { Job } = require('../../../db');

const DeleteJob = async (req, res) => {
  try {
    const { jobId } = req.params; // Usar req.params en lugar de req.body para obtener jobId
    console.log(jobId);
    // Buscar el trabajo en la base de datos
    const job = await Job.findOne({ where: { id: jobId } });

    // Si no se encuentra el trabajo, devuelve un error
    if (!job) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    // Eliminar el trabajo
    await job.destroy();

    return res.status(200).json({ message: 'Trabajo eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = DeleteJob;
