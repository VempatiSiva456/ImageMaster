const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, classController.createClass);
router.delete('/delete/:id', auth, classController.deleteClass);
router.get('/getAll', auth, classController.getAllClasses);

module.exports = router;
