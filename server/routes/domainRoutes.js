const express = require('express');
const router = express.Router();
const domainController = require('../controllers/domainController');


router.post('/create', domainController.createDomain);
router.delete('/delete/:id', domainController.deleteDomain);
router.get('/getAll', domainController.getAllDomains);

module.exports = router;
