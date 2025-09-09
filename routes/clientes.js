const express = require('express');
const router = express.Router();
const controller = require('../controllers/clientes'); 


/* GET clientes listing. */
router.get('/', controller.getClientes); 

router.get('/:id_clientes', controller.getClientesId);

router.get('/entidade/:numero_entidade', controller.getClientesEntidade);

router.get('/hash/:hash', controller.getClientesHash); 

router.get('/email/:email', controller.getClientesEmail);

/* POST clientes listing. */

router.post('/', controller.postClientes);

router.post('/login', controller.loginClientes); 

router.post('/logout', controller.logoutClientes);

router.post('/comunicar-por-email', controller.comunicarEmail); 

router.post('/activar-por-link', controller.activarPorLInk); 

router.post('/activar-por-codigo', controller.activarPorCodigo); 

router.post('/codigo-seguranca/pedir', controller.recuperarSenha);

router.post('/codigo-seguranca/autenticar', controller.redifinirSenha);

/* PATCH clientes listing. */

router.patch('/:id_clientes', controller.patchClientes)

router.patch('/:entidade/redifinir-senha', controller.patchClientesRedifinirSenha);

router.patch('/:entidade/trocar-senha-padrao', controller.patchClientesTrocarSenhaPadrao);

router.patch('/:entidade/verificar-senha-actual', controller.patchClientesVerificarSenhaActual);

router.patch('/:entidade/alterar-senha', controller.patchClientesAlterarSenha);

router.patch('/mudar/foto/:entidade', controller.mudarFotoClientes);

router.post('/mudar/arquivo-contrato/:entidade', controller.mudarArquivoContratoClientes);

router.patch('/repor-clientes/:id_clientes', controller.configurarReporClientes)

router.patch('/bloquear/:id_clientes', controller.patchClientesBloquear)

router.patch('/desbloquear/:id_clientes', controller.patchClientesDesbloquear)

/* DELETE clientes listing. */

router.delete('/:id_clientes', controller.deleteClientes)


module.exports = router;  