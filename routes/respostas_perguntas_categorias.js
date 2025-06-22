const express = require('express');
const router = express.Router();
const controller = require('../controllers/respostas_perguntas_categorias'); 


/* GET clientes listing. */
router.get('/', controller.getRespostasCategoriazadas);

router.get('/:pergunta_id', controller.getRespostasCategoriazadasPoPergunta);

/* POST clientes listing. */

router.post('/', controller.postRespostasCategoriazadas);

/* PATCH clientes listing. */

router.patch('/:id_pergunta', controller.patchRespostasCategoriazadas)

/* DELETE clientes listing. */

router.delete('/:id_pergunta', controller.deleteRespostasCategoriazadas)


module.exports = router;  