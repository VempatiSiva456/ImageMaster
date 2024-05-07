const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');
const upload = multer({ storage: multer.memoryStorage() });
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/upload', auth, upload.array('images', 10), imageController.uploadImage);
router.get('/get', auth, imageController.getImages);

module.exports = router;