const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios_funcoes'); 


/* GET clientes listing. */
router.get('/', controller.getUsuariosFuncoes); 

router.get('/:id_usuarios_funcoes', controller.getUsuariosFuncoesId);

router.get('/cliente/:empresa_funcao_fk', controller.getClientesUsuariosFuncoes);

/* POST clientes listing. */

router.post('/', controller.postUsuariosFuncoes);

/* PATCH clientes listing. */

router.patch('/:id_usuarios_funcoes', controller.patchUsuariosFuncoes)

/* DELETE clientes listing. */

router.delete('/:id_usuarios_funcoes', controller.deleteUsuariosFuncoes)


module.exports = router;  