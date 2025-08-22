const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // format "Bearer <token>"

  if(!token) return res.status(401).json({ message: 'Token manquant' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user; // contient id et username
    next();
  });
};
