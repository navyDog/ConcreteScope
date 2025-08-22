const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Champs manquants' });

    const hash = await bcrypt.hash(password, 10);
    User.create(username, hash, (err) => {
      if(err) return next(err);
      res.json({ username });
    });
  } catch(err) {
    next(err);
  }
};

exports.login = (req, res, next) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ message: 'Champs manquants' });

  User.findByUsername(username, async (err, user) => {
    if(err) return next(err);
    if(!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  });
};
