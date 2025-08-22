
const express = require('express');
const c = require('../controllers/chantiersController');
const router = express.Router();

router.get('/', c.getChantiers);
router.get('/:id', c.getChantierById);
router.post('/', c.addChantier);
router.put('/:id', c.updateChantier);
router.delete('/:id', c.deleteChantier);

module.exports = router;
