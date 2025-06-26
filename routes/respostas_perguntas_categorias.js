const express = require('express');
const router = express.Router();
const controller = require('../controllers/respostas_perguntas_categorias'); 


/* GET clientes listing. */
router.get('/', controller.getRespostasCategoriazadas);

router.get('/id_resposta', controller.getRespostasCategoriazadasPoResposta);

router.get('/por-pergunta/:pergunta_id', controller.getRespostasCategoriazadasPoPergunta);

router.get('/por-pergunta/:pergunta_id/categoria/:categoria_da_pergunta', controller.getRespostasCategoriazadasPoPerguntaECategoria);

/* POST clientes listing. */

router.post('/', controller.postRespostasCategoriazadas);

/* PATCH clientes listing. */

router.patch('/:id_resposta', controller.patchRespostasCategoriazadas)

/* DELETE clientes listing. */

router.delete('/:id_resposta', controller.deleteRespostasCategoriazadas)


module.exports = router;  