const M = require('../models/chantiersModel');

// GET tous les chantiers
exports.getChantiers = async (req, res, next) => {
  try {
    const rows = await M.getAll();
    res.json(rows);
  } catch(err) {
    next(err);
  }
};

// GET chantier par ID
exports.getChantierById = async (req, res, next) => {
  try {
    const row = await M.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Chantier introuvable' });
    res.json(row);
  } catch(err) {
    next(err);
  }
};

// POST création chantier avec numéro auto
exports.addChantier = async (req, res, next) => {
  try {
    const {
      affaire_id, entreprise_id, nomOuvrage, nomPartieOuvrage, fabricantBeton,
      lieuFabrication, modeLivraison, date_reception, date_prelevement, cBeton, vBeton,
      norme, infoFormule, melangeBeton, tEprouvette, lieuPrelevement, slump, serrage,
      conservation, couches, tVibration, typeEssai, preparation, presse
    } = req.body;

    if (!nomOuvrage?.trim() || !affaire_id || !entreprise_id) {
      return res.status(400).json({ message: 'Nom du chantier, affaire et entreprise requis' });
    }

    // Génération automatique du numéro : "AAAA-B-XXXX"
    const year = new Date().getFullYear();
    const prefix = `${year}-B-`;

    const row = await new Promise((resolve, reject) =>
      M.getCountByPrefix(prefix, (err, r) => err ? reject(err) : resolve(r))
    );

    const numero = `${prefix}${String(row.count + 1).padStart(4,'0')}`;

    const chantierData = {
      affaire_id,
      entreprise_id,
      numero,
      nomOuvrage,
      nomPartieOuvrage: nomPartieOuvrage || null,
      fabricantBeton: fabricantBeton || null,
      lieuFabrication: lieuFabrication || null,
      modeLivraison: modeLivraison || null,
      date_reception: date_reception || null,
      date_prelevement: date_prelevement || null,
      cBeton: cBeton || null,
      vBeton: vBeton || null,
      norme: norme || null,
      infoFormule: infoFormule || null,
      melangeBeton: melangeBeton || null,
      tEprouvette: tEprouvette || null,
      lieuPrelevement: lieuPrelevement || null,
      slump: slump || null,
      serrage: serrage || null,
      conservation: conservation || null,
      couches: couches || null,
      tVibration: tVibration || null,
      typeEssai: typeEssai || null,
      preparation: preparation || null,
      presse: presse || null
    };

    const result = await M.create(chantierData);
    res.status(201).json(result);

  } catch(err) {
    next(err);
  }
};

// PUT mise à jour chantier
exports.updateChantier = async (req, res, next) => {
  try {
    const {
      affaire_id, entreprise_id, nomOuvrage, nomPartieOuvrage, fabricantBeton,
      lieuFabrication, modeLivraison, date_reception, date_prelevement, cBeton, vBeton,
      norme, infoFormule, melangeBeton, tEprouvette, lieuPrelevement, slump, serrage,
      conservation, couches, tVibration, typeEssai, preparation, presse
    } = req.body;

    if (!nomOuvrage?.trim()) return res.status(400).json({ message: 'Nom du chantier requis' });

    const chantierData = {
      affaire_id,
      entreprise_id,
      // On ne change pas le numéro lors de la mise à jour
      numero: undefined,
      nomOuvrage,
      nomPartieOuvrage: nomPartieOuvrage || null,
      fabricantBeton: fabricantBeton || null,
      lieuFabrication: lieuFabrication || null,
      modeLivraison: modeLivraison || null,
      date_reception: date_reception || null,
      date_prelevement: date_prelevement || null,
      cBeton: cBeton || null,
      vBeton: vBeton || null,
      norme: norme || null,
      infoFormule: infoFormule || null,
      melangeBeton: melangeBeton || null,
      tEprouvette: tEprouvette || null,
      lieuPrelevement: lieuPrelevement || null,
      slump: slump || null,
      serrage: serrage || null,
      conservation: conservation || null,
      couches: couches || null,
      tVibration: tVibration || null,
      typeEssai: typeEssai || null,
      preparation: preparation || null,
      presse: presse || null
    };

    const result = await M.update(req.params.id, chantierData);
    if (!result.changes) return res.status(404).json({ message: 'Chantier non trouvé' });
    res.json({ message: 'Chantier mis à jour' });

  } catch(err) {
    next(err);
  }
};

// DELETE chantier
exports.deleteChantier = async (req, res, next) => {
  try {
    const result = await M.delete(req.params.id);
    if (!result.changes) return res.status(404).json({ message: 'Chantier non trouvé' });
    res.json({ message: 'Chantier supprimé' });
  } catch(err) {
    next(err);
  }
};
