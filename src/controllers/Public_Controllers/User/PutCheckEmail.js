const { User } = require('../../../db');

const PutCheckEmail = async (req, res) => {

  const userId = req.user?.id

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the "checkedemail" property with the new value
    user.checkedemail = true;
    await user.save();

    return res.status(200).json({ message: 'Checked email updated successfully' });
  } catch (err) {
    console.error('Error updating checked email:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = PutCheckEmail;
