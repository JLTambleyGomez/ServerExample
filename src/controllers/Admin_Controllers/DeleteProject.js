const { Project } = require('../../db');

const DeleteProject = async (req, res) => {
  try {
    const isAdmin = req.user?.admin; //

    if (!isAdmin) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const projectId = req.params.projectId;

    // Verificar si el proyecto existe antes de eliminarlo
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Eliminar el proyecto y los reviews relacionados en cascada
    await project.destroy();

    return res.status(200).json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = DeleteProject;
