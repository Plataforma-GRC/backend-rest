const express = require('express');
const router = express.Router();
const controller = require('../controllers/apresentacao_cliente'); 


/* GET clientes listing. */
router.get('/', controller.getApresentacaoCliente); 

router.get('/:id_apresenta', controller.getApresentacaoClienteId);

router.get('/cliente/:cliente_apresentado', controller.getClientesApresentacaoCliente);

/* POST clientes listing. */

router.post('/', controller.postApresentacaoCliente);

/* PATCH clientes listing. */

router.patch('/:id_apresenta', controller.patchApresentacaoCliente)

/* DELETE clientes listing. */

router.delete('/:id_apresenta', controller.deleteApresentacaoCliente)


module.exports = router;  