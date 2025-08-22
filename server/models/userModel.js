const db = require('../db');

module.exports = {
  create: (username, passwordHash, cb) => {
    db.run('INSERT INTO usersCS (username, passwordHash) VALUES (?, ?)', [username, passwordHash], cb);
  },
  findByUsername: (username, cb) => {
    db.get('SELECT * FROM usersCS WHERE username = ?', [username], cb);
  }
};
