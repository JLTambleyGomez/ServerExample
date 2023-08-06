const { Review } = require('../db');

const DeleteReview = async (req, res) => {
  try {
    const isAdmin = req.user?.admin; //
    const userId = req.user?.id; // Obtenemos el ID del usuario actual

    if (!isAdmin) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const reviewId = req.params.reviewId;

    // Verificar si el review existe antes de eliminarlo
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review no encontrado' });
    }

    // Verificar si el usuario que intenta borrar el review es el mismo que lo creó
    if (review.userId !== userId ||!isAdmin) {
      return res.status(403).json({ message: 'Acceso no autorizado para borrar este review' });
    }

    // Eliminar el review
    await review.destroy();

    return res.status(200).json({ message: 'Review eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = DeleteReview;
