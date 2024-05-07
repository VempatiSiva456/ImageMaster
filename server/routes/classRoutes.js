const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.post('/create', classController.createClass);
router.delete('/delete/:id', classController.deleteClass)

module.exports = router;
