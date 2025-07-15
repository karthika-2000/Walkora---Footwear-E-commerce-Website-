const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {
    const authheader = req.headers.authorization;

    if (!authheader) {
        return res.status(401).json({ message: 'Access Denied. Unauthorized - Missing token' });
    }

    const token = authheader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports = verifytoken;
