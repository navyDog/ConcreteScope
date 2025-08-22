const express = require('express');
const c = require('../controllers/entreprisesController');
const router = express.Router();

router.get('/', c.getEntreprises);
router.get('/:id', c.getEntrepriseById);
router.post('/', c.addEntreprise);
router.put('/:id', c.updateEntreprise);
router.delete('/:id', c.deleteEntreprise);

module.exports = router;
