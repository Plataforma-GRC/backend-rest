const express = require('express');
const router = express.Router();
const controller = require('../controllers/jurisdicao_activa'); 


/* GET clientes listing. */
router.get('/', controller.getJurisdicaoActiva);

router.get('/com-frameworks', controller.getJurisdicaoActivaComFrameworks);

/* POST clientes listing. */

router.post('/', controller.postJurisdicaoActiva);

/* PATCH clientes listing. */

router.patch('/:jurisdicao_activa_id', controller.patchJurisdicaoActiva)

/* DELETE clientes listing. */

router.delete('/:jurisdicao_activa_id', controller.deleteJurisdicaoActiva)


module.exports = router;  