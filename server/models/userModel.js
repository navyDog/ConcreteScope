const db = require('../db');
const bcrypt = require('bcrypt');

const User = {
  create: async (username, password) => {
    const hash = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO usersCS (username, passwordHash) VALUES (?, ?)',
        [username, hash],
        function(err) {
          if(err) return reject(err);
          resolve({ id: this.lastID, username });
        }
      );
    });
  },

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM usersCS WHERE username = ?',
        [username],
        (err, row) => {
          if(err) return reject(err);
          resolve(row);
        }
      );
    });
  }
};

module.exports = User;
