require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (token == "") return res.status(401).json({
    message: "Unauthorized, please use authorization token."
  });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json(({
      message: `${err.message}, JWT verification failed.`
    }));
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
