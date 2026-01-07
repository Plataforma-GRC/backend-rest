const express = require('express');
const router = express.Router();
const controller = require('../controllers/escala_matriz'); 


/* GET clientes listing. */
router.get('/', controller.getEscalaMatriz);

router.get('/:risco_matriz_id', controller.getEscalaMatrizId);

router.get('/pela-escala/:risco_escala_matrix_id', controller.getEscalaMatrizPorEscala);

router.get('/pela-empresa/:riscos_matriz_empresa_fk', controller.getEscalaMatrizPorEmpresa);

router.get('/escalas/todas', controller.getEscalaMatrizEscalas);

/* POST clientes listing. */

router.post('/', controller.postEscalaMatriz);

/* PATCH clientes listing. */

router.patch('/:risco_matriz_id', controller.patchEscalaMatriz)

/* DELETE clientes listing. */

router.delete('/:risco_matriz_id', controller.deleteEscalaMatriz)


module.exports = router;  