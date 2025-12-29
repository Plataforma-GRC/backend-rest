const express = require('express');
const router = express.Router();
const controller = require('../controllers/lista_categoria_sub_de_risco'); 


/* GET clientes listing. */
router.get('/', controller.getListaCategoriaSubAoRisco); 

router.get('/:id_lista_categoria_sub_de_risco', controller.getListaCategoriaSubAoRiscoId);

router.get('/categoria/:categoria_de_risco_id_fk', controller.getClientesListaCategoriaSubAoRisco);

//router.get('/categoria/:categoria_de_risco_id_fk/cliente/:cliente_categorizado_fk', controller.getClientesCategoriaDefinidoSubAoRisco);

/* POST clientes listing. */

router.post('/', controller.postListaCategoriaSubAoRisco);

/* PATCH clientes listing. */

router.patch('/:id_lista_categoria_sub_de_risco', controller.patchListaCategoriaSubAoRisco)

/* DELETE clientes listing. */

router.delete('/:id_lista_categoria_sub_de_risco', controller.deleteListaCategoriaSubAoRisco)


module.exports = router;  