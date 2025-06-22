const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoria_de_risco'); 


/* GET clientes listing. */
router.get('/', controller.getCategoriaAoRisco); 

router.get('/:id_categoria_de_risco', controller.getCategoriaAoRiscoId);

router.get('/cliente/:cliente_categorizado', controller.getClientesCategoriaAoRisco);

/* POST clientes listing. */

router.post('/', controller.postCategoriaAoRisco);

/* PATCH clientes listing. */

router.patch('/:id_categoria_de_risco', controller.patchCategoriaAoRisco)

/* DELETE clientes listing. */

router.delete('/:id_categoria_de_risco', controller.deleteCategoriaAoRisco)


module.exports = router;  