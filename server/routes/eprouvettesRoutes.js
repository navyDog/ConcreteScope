const express = require('express');
const router = express.Router();
const C = require('../controllers/eprouvettesController');

router.get('/all', C.getAllEprouvettes);
router.get('/', C.getEprouvettes);
router.get('/:id', C.getEprouvetteById);
router.post('/', C.addEprouvettes);
router.put('/:id', C.updateEprouvette);
router.delete('/:id', C.deleteEprouvette);

module.exports = router;
