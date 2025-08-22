const M = require('../models/affairesModel');

exports.getAffaires = async (req, res, next) => {
  try { res.json(await M.getAll()); } catch(err) { next(err); }
};
exports.getAffaireById = async (req, res, next) => {
  try {
    const row = await M.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Affaire introuvable' });
    res.json(row);
  } catch(err) { next(err); }
};
exports.addAffaire = async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!nom?.trim()) return res.status(400).json({ message: 'Nom requis' });
    res.status(201).json(await M.create(req.body));
  } catch(err) { next(err); }
};
exports.updateAffaire = async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!nom?.trim()) return res.status(400).json({ message: 'Nom requis' });
    const r = await M.update(req.params.id, req.body);
    if (!r.changes) return res.status(404).json({ message: 'Affaire non trouvée' });
    res.json({ message: 'Affaire mise à jour' });
  } catch(err) { next(err); }
};
exports.deleteAffaire = async (req, res, next) => {
  try {
    const r = await M.delete(req.params.id);
    if (!r.changes) return res.status(404).json({ message: 'Affaire non trouvée' });
    res.json({ message: 'Affaire supprimée' });
  } catch(err) { next(err); }
};
