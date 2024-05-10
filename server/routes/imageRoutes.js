const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');
const upload = multer({ storage: multer.memoryStorage() });
const auth = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/upload', auth, upload.array('images', 10), imageController.uploadImage);
router.get('/get', auth, imageController.getImages);
router.put('/updateClass/:imageId', auth, imageController.updateImageClass);
router.put('/removeClass/:imageId', auth, imageController.removeImageClass);
router.put('/updateBulkClass', auth, imageController.updateBulkImagesClass);
router.delete('/delete', auth, imageController.deleteImages);

module.exports = router;