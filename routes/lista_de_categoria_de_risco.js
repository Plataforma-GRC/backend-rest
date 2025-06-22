const express = require('express');
const router = express.Router();
const controller = require('../controllers/lista_de_categoria_de_risco'); 


/* GET clientes listing. */
router.get('/', controller.getListaDeCategorias);

/* POST clientes listing. */

router.post('/', controller.postListaDeCategorias);

/* PATCH clientes listing. */

router.patch('/:id_lista_de_categoria_de_risco', controller.patchListaDeCategorias)

/* DELETE clientes listing. */

router.delete('/:id_lista_de_categoria_de_risco', controller.deleteListaDeCategorias)


module.exports = router;  