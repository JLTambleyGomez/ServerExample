const { User } = require('../../../db');

const CheckUserDb = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: { email: email }
    });
    if (user) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Cannot access to the db' });
  }
};

module.exports = CheckUserDb;
