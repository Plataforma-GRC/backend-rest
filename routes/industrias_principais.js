const express = require('express');
const router = express.Router();
const controller = require('../controllers/industrias_principais'); 


/* GET clientes listing. */
router.get('/', controller.getIndustriasPrincipais);

/* POST clientes listing. */

router.post('/', controller.postIndustriasPrincipais);

/* PATCH clientes listing. */

router.patch('/:id_industrias_principal', controller.patchIndustriasPrincipais)

/* DELETE clientes listing. */

router.delete('/:id_industrias_principal', controller.deleteIndustriasPrincipais)


module.exports = router;  