const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios');

/* GET usuarios listing. */
router.get('/', controller.getUsuarios);

router.get('/:id_usuarios', controller.getUsuariosId);

router.get('/cliente/:usuario_empresa_fk', controller.getUsuariosClintes);

router.get('/hash/:hash', controller.getUsuariosHash);

router.get('/:id_usuarios/permissoes', controller.getUsuariosPermissoes);

/* POST usuarios listing. */
router.post('/', controller.postUsuarios);

router.post('/login', controller.postUsuariosLogin);

router.post('/logout', controller.postUsuariosLogout);

/* PATH usuarios listing. */
router.patch('/:id_usuarios/permissao/:permissoes_usuarios/permissoes', controller.patchUsuariosPermissoes);

router.patch('/:id_usuarios', controller.patchUsuarios);

/* DELETE usuarios listing. */ 
router.delete('/:id_usuarios', controller.deleteUsuarios);



module.exports = router;
