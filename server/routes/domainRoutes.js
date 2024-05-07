const express = require('express');
const router = express.Router();
const domainController = require('../controllers/domainController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, domainController.createDomain);
router.delete('/delete/:id', auth, domainController.deleteDomain);
router.get('/getAll', auth, domainController.getAllDomains);

module.exports = router;
