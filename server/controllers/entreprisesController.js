const M = require('../models/entreprisesModel');

exports.getEntreprises = async (req, res, next) => {
  try { res.json(await M.getAll()); } catch(e) { next(e); }
};
exports.getEntrepriseById = async (req, res, next) => {
  try {
    const row = await M.getById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Entreprise introuvable' });
    res.json(row);
  } catch(e) { next(e); }
};
exports.addEntreprise = async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!nom?.trim()) return res.status(400).json({ message: 'Nom requis' });
    res.status(201).json(await M.create(req.body));
  } catch(e) { next(e); }
};
exports.updateEntreprise = async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!nom?.trim()) return res.status(400).json({ message: 'Nom requis' });
    const r = await M.update(req.params.id, req.body);
    if (!r.changes) return res.status(404).json({ message: 'Entreprise non trouvée' });
    res.json({ message: 'Entreprise mise à jour' });
  } catch(e) { next(e); }
};
exports.deleteEntreprise = async (req, res, next) => {
  try {
    const r = await M.delete(req.params.id);
    if (!r.changes) return res.status(404).json({ message: 'Entreprise non trouvée' });
    res.json({ message: 'Entreprise supprimée' });
  } catch(e) { next(e); }
};
