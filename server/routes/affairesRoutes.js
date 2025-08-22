const express = require('express');
const c = require('../controllers/affairesController');
const router = express.Router();

router.get('/', c.getAffaires);
router.get('/:id', c.getAffaireById);
router.post('/', c.addAffaire);
router.put('/:id', c.updateAffaire);
router.delete('/:id', c.deleteAffaire);

module.exports = router;
