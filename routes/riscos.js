const express = require('express');
const router = express.Router();
const controller = require('../controllers/riscos'); 


/* GET clientes listing. */
router.get('/', controller.getRiscos); 

router.get('/:riscos_id', controller.getRiscosId);

router.get('/cliente/:empresa_id', controller.getClientesRiscos);

/* POST clientes listing. */

router.post('/', controller.postRiscos);

/* PATCH clientes listing. */

router.patch('/:riscos_id', controller.patchRiscos)

/* DELETE clientes listing. */

router.delete('/:riscos_id', controller.deleteRiscos)


module.exports = router;  