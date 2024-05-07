const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.post('/create', classController.createClass);
router.delete('/delete/:id', classController.deleteClass);
router.get('/getAll', classController.getAllClasses);

module.exports = router;
