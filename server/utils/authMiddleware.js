const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const RevokedToken = require('../models/revokedTokenModel');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const blacklisted = await RevokedToken.exists(token);
    if(blacklisted) return res.status(401).json({ message: 'Token révoqué' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
}

module.exports = authMiddleware;
