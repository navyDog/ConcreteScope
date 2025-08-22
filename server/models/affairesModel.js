const db = require('../db');

module.exports = {
  getAll() {
    return new Promise((resolve, reject) =>
      db.all('SELECT * FROM affaires', [], (err, rows) => err ? reject(err) : resolve(rows))
    );
  },
  getById(id) {
    return new Promise((resolve, reject) =>
      db.get('SELECT * FROM affaires WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row))
    );
  },
  create({ nom, contact, courriel, telephone, MOA, MOE }) {
    return new Promise((resolve, reject) =>
      db.run(
        'INSERT INTO affaires (nom, contact, courriel, telephone, MOA, MOE) VALUES (?, ?, ?, ?, ?, ?)',
        [nom, contact ?? null, courriel ?? null, telephone ?? null, MOA ?? null, MOE ?? null],
        function(err) { err ? reject(err) : resolve({ id: this.lastID, nom, contact, courriel, telephone, MOA, MOE }); }
      )
    );
  },
  update(id, { nom, contact, courriel, telephone, MOA, MOE }) {
    return new Promise((resolve, reject) =>
      db.run(
        'UPDATE affaires SET nom=?, contact=?, courriel=?, telephone=?, MOA=?, MOE=? WHERE id=?',
        [nom, contact ?? null, courriel ?? null, telephone ?? null, MOA ?? null, MOE ?? null, id],
        function(err) { err ? reject(err) : resolve({ changes: this.changes }); }
      )
    );
  },
  delete(id) {
    return new Promise((resolve, reject) =>
      db.run('DELETE FROM affaires WHERE id=?', [id], function(err) { err ? reject(err) : resolve({ changes: this.changes }); })
    );
  }
};
