const express = require('express');
const router = express.Router();
const controller = require('../controllers/perguntas_categorias'); 


/* GET clientes listing. */
router.get('/', controller.getPerguntasCategorias);

router.get('/:categoria_id', controller.getPerguntasCategoriasPorCategoria);

/* POST clientes listing. */

router.post('/', controller.postPerguntasCategorias);

/* PATCH clientes listing. */

router.patch('/:id_pergunta', controller.patchPerguntasCategorias)

/* DELETE clientes listing. */

router.delete('/:id_pergunta', controller.deletePerguntasCategorias)


module.exports = router;  