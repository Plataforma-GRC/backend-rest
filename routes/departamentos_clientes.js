const express = require('express');
const router = express.Router();
const controller = require('../controllers/departamentos_clientes'); 


/* GET clientes listing. */
router.get('/', controller.getDepartamentosClientes);

router.get('/:empresa_dona', controller.getDepartamentosClientesPorEmpresa);

/* POST clientes listing. */

router.post('/', controller.postDepartamentosClientes);

/* PATCH clientes listing. */

router.patch('/:id_departamento', controller.patchDepartamentosClientes)

/* DELETE clientes listing. */

router.delete('/:id_departamento', controller.deleteDepartamentosClientes)


module.exports = router;  