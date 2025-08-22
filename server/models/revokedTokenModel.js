const db = require('../db');

const RevokedToken = {
  add: (token) => {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.run(
        'INSERT INTO revoked_tokens (token, revoked_at) VALUES (?, ?)',
        [token, now],
        (err) => err ? reject(err) : resolve()
      );
    });
  },

  exists: (token) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id FROM revoked_tokens WHERE token = ?',
        [token],
        (err, row) => err ? reject(err) : resolve(!!row)
      );
    });
  },

  purgeExpired: () => {
    return new Promise((resolve, reject) => {
      const now = Math.floor(Date.now() / 1000);
      db.run(
        `DELETE FROM revoked_tokens WHERE CAST(strftime('%s', revoked_at) AS INTEGER) + 8*3600 < ?`,
        [now],
        (err) => err ? reject(err) : resolve()
      );
    });
  }
};

module.exports = RevokedToken;
