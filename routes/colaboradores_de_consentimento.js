const express = require('express');
const router = express.Router();
const controller = require('../controllers/colaboradores_de_consentimento'); 


/* GET clientes listing. */
router.get('/', controller.getColaboradoresConsentimentos);

router.get('/:empresa_id', controller.getColaboradoresConsentimentosPorEmpresa);

router.get('/respostas/:empresa_id', controller.getColaboradoresConsentimentosRespostaEmpresa);

router.get('/resposta/:empresa_id/colaborador/:id_colaborador_de_consentimento_resposta', controller.getColaboradoresConsentimentosResostaEmpresaColaborador);

router.get('/resposta/:empresa_id/categoria/:categoria_da_pergunta', controller.getColaboradoresConsentimentosResostaEmpresaCategoria);

/* POST clientes listing. */

router.post('/', controller.postColaboradoresConsentimentos);

router.post('/responder', controller.postColaboradoresConsentimentosRespostas);

/* PATCH clientes listing. */

router.patch('/:id_colaborador_de_consentimento', controller.patchColaboradoresConsentimentos)

/* DELETE clientes listing. */

router.delete('/:id_colaborador_de_consentimento', controller.deleteColaboradoresConsentimentos)


module.exports = router;  