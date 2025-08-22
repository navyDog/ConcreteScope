const db = require('../db');

module.exports = {
  getAll() {
    return new Promise((resolve, reject) =>
      db.all('SELECT * FROM entreprises', [], (err, rows) => err ? reject(err) : resolve(rows))
    );
  },
  getById(id) {
    return new Promise((resolve, reject) =>
      db.get('SELECT * FROM entreprises WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row))
    );
  },
  create({ nom, contact, courriel, telephone }) {
    return new Promise((resolve, reject) =>
      db.run(
        'INSERT INTO entreprises (nom, contact, courriel, telephone) VALUES (?, ?, ?, ?)',
        [nom, contact ?? null, courriel ?? null, telephone ?? null],
        function(err) { err ? reject(err) : resolve({ id: this.lastID, nom, contact, courriel, telephone }); }
      )
    );
  },
  update(id, { nom, contact, courriel, telephone }) {
    return new Promise((resolve, reject) =>
      db.run(
        'UPDATE entreprises SET nom = ?, contact = ?, courriel = ?, telephone = ? WHERE id = ?',
        [nom, contact ?? null, courriel ?? null, telephone ?? null, id],
        function(err) { err ? reject(err) : resolve({ changes: this.changes }); }
      )
    );
  },
  delete(id) {
    return new Promise((resolve, reject) =>
      db.run('DELETE FROM entreprises WHERE id = ?', [id], function(err) { err ? reject(err) : resolve({ changes: this.changes }); })
    );
  }
};
