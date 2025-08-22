const db = require('../db');

module.exports = {
  getAll() {
    return new Promise((resolve, reject) =>
      db.all(`
        SELECT chantiers.*, affaires.nom AS affaire_nom, entreprises.nom AS entreprise_nom
        FROM chantiers
        LEFT JOIN affaires ON chantiers.affaire_id = affaires.id
        LEFT JOIN entreprises ON chantiers.entreprise_id = entreprises.id
      `, [], (err, rows) => err ? reject(err) : resolve(rows))
    );
  },

  getById(id) {
    return new Promise((resolve, reject) =>
      db.get('SELECT * FROM chantiers WHERE id=?', [id], (err,row)=>err?reject(err):resolve(row))
    );
  },

  create(data) {
    const values = [
      data.affaire_id, data.entreprise_id, data.numero, data.nomOuvrage, data.nomPartieOuvrage,
      data.fabricantBeton, data.lieuFabrication, data.modeLivraison, data.date_reception,
      data.date_prelevement, data.cBeton, data.vBeton, data.norme, data.infoFormule, data.melangeBeton,
      data.tEprouvette, data.lieuPrelevement, data.slump, data.serrage, data.conservation,
      data.couches, data.tVibration, data.typeEssai, data.preparation, data.presse
    ];

    return new Promise((resolve, reject) =>
      db.run(
        `INSERT INTO chantiers 
        (affaire_id, entreprise_id, numero, nomOuvrage, nomPartieOuvrage, fabricantBeton, lieuFabrication, modeLivraison,
         date_reception, date_prelevement, cBeton, vBeton, norme, infoFormule, melangeBeton, tEprouvette,
         lieuPrelevement, slump, serrage, conservation, couches, tVibration, typeEssai, preparation, presse)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values,
        function(err) { err ? reject(err) : resolve({id:this.lastID, numero:data.numero}); }
      )
    );
  },

  update(id, data) {
    const fields = [
      'affaire_id','entreprise_id','numero','nomOuvrage','nomPartieOuvrage','fabricantBeton','lieuFabrication','modeLivraison',
      'date_reception','date_prelevement','cBeton','vBeton','norme','infoFormule','melangeBeton','tEprouvette',
      'lieuPrelevement','slump','serrage','conservation','couches','tVibration','typeEssai','preparation','presse'
    ];
    const values = fields.map(f => data[f] ?? null);
    values.push(id);

    return new Promise((resolve, reject) =>
      db.run(
        `UPDATE chantiers SET affaire_id=?, entreprise_id=?, numero=?, nomOuvrage=?, nomPartieOuvrage=?, fabricantBeton=?, lieuFabrication=?, modeLivraison=?,
         date_reception=?, date_prelevement=?, cBeton=?, vBeton=?, norme=?, infoFormule=?, melangeBeton=?, tEprouvette=?,
         lieuPrelevement=?, slump=?, serrage=?, conservation=?, couches=?, tVibration=?, typeEssai=?, preparation=?, presse=? WHERE id=?`,
        values,
        function(err){err?reject(err):resolve({changes:this.changes});}
      )
    );
  },


  getCountByPrefix(prefix, callback) {
    db.get('SELECT COUNT(*) AS count FROM chantiers WHERE numero LIKE ?', [`${prefix}%`], callback);
    },

  delete(id) {
    return new Promise((resolve, reject) =>
      db.run('DELETE FROM chantiers WHERE id=?', [id], function(err){err?reject(err):resolve({changes:this.changes});})
    );
  }

  
};
