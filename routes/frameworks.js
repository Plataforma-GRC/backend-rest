const express = require('express');
const router = express.Router();
const controller = require('../controllers/frameworks'); 


/* GET clientes listing. */
router.get('/', controller.getFrameworks);

router.get('/:framework_id', controller.getFrameworksId);

router.get('/tipo/:framework_tipo_id', controller.getFrameworksTipo);

router.get('/orgao/:framework_orgao_id', controller.getFrameworksOrgao);

router.get('/cliente/:clientes_id_fk', controller.getFrameworksCliente);

/* POST clientes listing. */

router.post('/', controller.postFrameworks);

router.post('/escolher', controller.postFrameworksEscolher);

/* PATCH clientes listing. */

router.patch('/:framework_id', controller.patchFrameworks)

/* DELETE clientes listing. */

router.delete('/:framework_id', controller.deleteFrameworks)

router.delete('/escolhido/:clientes_frameworks', controller.deleteFrameworksEscolhido)


module.exports = router;  