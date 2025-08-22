const db = require('../db');

module.exports = {
  getByChantierId: (chantier_id) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM eprouvettes WHERE chantier_id = ?', [chantier_id], (err, rows) => err ? reject(err) : resolve(rows));
    });
  },

    getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM eprouvettes', (err, rows) => err ? reject(err) : resolve(rows));
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM eprouvettes WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row));
    });
  },

  getChantierDate: (chantier_id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT date_reception FROM chantiers WHERE id = ?', [chantier_id], (err, row) => err ? reject(err) : resolve(row));
    });
  },

  createBatch: (list) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO eprouvettes (chantier_id, age_jour, date_creation, date_ecrasement, hauteur, diametre, surface, force, masse)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      list.forEach(e => stmt.run([
        e.chantier_id, e.age_jour, e.date_creation, e.date_ecrasement,
        e.hauteur, e.diametre, e.surface, e.force, e.masse
      ]));

      stmt.finalize((err) => err ? reject(err) : resolve({ changes: list.length }));
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE eprouvettes SET
          hauteur = ?, diametre = ?, surface = ?, force = ?, masse = ?,
          age_jour = ?, date_creation = ?, date_ecrasement = ?
        WHERE id = ?
      `;
      const params = [
        data.hauteur, data.diametre, data.surface, data.force, data.masse,
        data.age_jour, data.date_creation, data.date_ecrasement, id
      ];
      db.run(sql, params, function(err) { if (err) reject(err); else resolve(this); });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM eprouvettes WHERE id = ?', [id], function(err) { if (err) reject(err); else resolve(this); });
    });
  }
};
