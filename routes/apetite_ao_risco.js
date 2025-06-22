const express = require('express');
const router = express.Router();
const controller = require('../controllers/apetite_ao_risco'); 


/* GET clientes listing. */
router.get('/', controller.getApetites); 

router.get('/:id_apetite', controller.getApetiteId);

router.get('/cliente/:cliente_apetite', controller.getClientesApetite);

/* POST clientes listing. */

router.post('/', controller.postApetite);

/* PATCH clientes listing. */

router.patch('/:id_apetite', controller.patchApetite)

/* DELETE clientes listing. */


module.exports = router;  