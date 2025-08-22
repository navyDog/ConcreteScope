const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const RevokedToken = require('../models/revokedTokenModel');
const { JWT_SECRET } = require('../config');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ message: 'Username et password requis' });
  
  try {
    const user = await User.create(username, password);
    res.json(user);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ message: 'Username et password requis' });

  try {
    const user = await User.findByUsername(username);
    if(!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) return res.status(400).json({ message: 'Token manquant' });

  try {
    await RevokedToken.add(token);
    res.json({ message: 'Déconnecté et token révoqué' });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};
