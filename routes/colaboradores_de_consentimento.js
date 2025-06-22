const express = require('express');
const router = express.Router();
const controller = require('../controllers/colaboradores_de_consentimento'); 


/* GET clientes listing. */
router.get('/', controller.getColaboradoresConsentimentos);

router.get('/:empresa_id', controller.getColaboradoresConsentimentosPorEmpresa);

/* POST clientes listing. */

router.post('/', controller.postColaboradoresConsentimentos);

/* PATCH clientes listing. */

router.patch('/:id_colaborador_de_consentimento', controller.patchColaboradoresConsentimentos)

/* DELETE clientes listing. */

router.delete('/:id_colaborador_de_consentimento', controller.deleteColaboradoresConsentimentos)


module.exports = router;  