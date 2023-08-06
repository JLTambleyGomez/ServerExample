    const jwt = require('jsonwebtoken');
    require ("dotenv").config()

    const {Secret_Key_Security}= process.env

    const secretKey = Secret_Key_Security; 

    const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
    };

    module.exports = authMiddleware;
