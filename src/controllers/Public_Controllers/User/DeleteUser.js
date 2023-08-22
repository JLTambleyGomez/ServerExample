const { User, Job } = require('../../../db');

const DeleteUser = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming the authenticated user's ID is available in req.user
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Delete the user's jobs before deleting the user
    await Job.destroy({ where: { userId } });

    // Delete the user
    const deletedUser = await User.destroy({ where: { id: userId } });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User deleted successfully');
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = DeleteUser;
