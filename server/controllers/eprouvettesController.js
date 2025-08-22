const M = require('../models/eprouvettesModel');

// GET erpouvettes d'un chantier
exports.getEprouvettes = async (req, res, next) => {
  try {
    const chantierId = req.query.chantier_id;
    if (!chantierId) return res.status(400).json({ message: 'chantier_id requis' });

    const rows = await M.getByChantierId(chantierId);
    res.json(rows);
  } catch(err) {
    next(err);
  }
};

// GET toutes les éprouvettes
exports.getAllEprouvettes = async (req, res, next) => {
  try {
   

    const rows = await M.getAll();
    res.json(rows);
  } catch(err) {
    next(err);
  }
};

// GET éprouvette par ID
exports.getEprouvetteById = async (req, res, next) => {
  try {
    const row = await M.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Éprouvette introuvable' });
    res.json(row);
  } catch(err) {
    next(err);
  }
};

// POST création d'une ou plusieurs éprouvettes
exports.addEprouvettes = async (req, res, next) => {
  try {
    const { chantier_id, nb, jours } = req.body;

    if (!chantier_id) return res.status(400).json({ message: 'chantier_id requis' });
    if (!nb || nb <= 0) return res.status(400).json({ message: 'nb > 0 requis' });
    if (!jours || jours <= 0) return res.status(400).json({ message: 'jours > 0 requis' });

    // Récupérer date_reception du chantier
    const chantier = await M.getChantierDate(chantier_id);
    if (!chantier || !chantier.date_reception) {
      return res.status(400).json({ message: 'Date de réception non définie pour ce chantier' });
    }

    const date_creation = new Date(chantier.date_reception);

    const eprouvettes = [];
    for (let i = 0; i < nb; i++) {
      const date_ecrasement = new Date(date_creation);
      date_ecrasement.setDate(date_creation.getDate() + parseInt(jours));

      eprouvettes.push({
        chantier_id,
        age_jour: parseInt(jours),
        date_creation: date_creation.toISOString().split('T')[0],
        date_ecrasement: date_ecrasement.toISOString().split('T')[0],
        hauteur: null,
        diametre: null,
        surface: null,
        force: null,
        masse: null
      });
    }

    const result = await M.createBatch(eprouvettes);
    res.status(201).json({ success: true, inserted: result.changes });

  } catch(err) {
    next(err);
  }
};

// PUT mise à jour éprouvette
exports.updateEprouvette = async (req, res, next) => {
  try {
    const { hauteur, diametre, surface, force, masse, age_jour, date_creation, date_ecrasement } = req.body;

    const eprouvettesData = {
      hauteur: hauteur || null,
      diametre: diametre || null,
      surface: surface || null,
      force: force || null,
      masse: masse || null,
      age_jour: age_jour || null,
      date_creation: date_creation || null,
      date_ecrasement: date_ecrasement || null
    };

    const result = await M.update(req.params.id, eprouvettesData);
    if (!result.changes) return res.status(404).json({ message: 'Éprouvette non trouvée' });

    res.json({ message: 'Éprouvette mise à jour' });
  } catch(err) {
    next(err);
  }
};

// DELETE éprouvette
exports.deleteEprouvette = async (req, res, next) => {
  try {
    const result = await M.delete(req.params.id);
    if (!result.changes) return res.status(404).json({ message: 'Éprouvette non trouvée' });
    res.json({ message: 'Éprouvette supprimée' });
  } catch(err) {
    next(err);
  }
};
