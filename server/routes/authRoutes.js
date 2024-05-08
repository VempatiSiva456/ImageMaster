const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verifySession', authController.verifySession);
router.post('/logout', auth, authController.logout);
router.get('/getAll', auth, authController.getUsers);
module.exports = router;