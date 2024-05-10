const imageService = require("../services/imageService");

exports.uploadImage = async (req, res) => {
  const { mode } = req.query;
  if (!mode) {
    return res.status(400).send({ error: "Mode parameter is required" });
  }

  if (!req.files.length) {
    return res.status(400).send({ error: "No files uploaded" });
  }

  try {
    const files = req.files;
    const results = await Promise.all(
      files.map(async (file) => {
        return await imageService.uploadImage(mode, file, req.user._id);
      })
    );
    res.status(201).send(results);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).send({ error: error.message });
  }
};

exports.getImages = async (req, res) => {
  const { mode } = req.query;
  if (!mode) {
    return res.status(400).send({ error: "Mode parameter is required" });
  }
  try {
    const images = await imageService.fetchImages(mode, req.user._id);
    res.status(200).send(images);
  } catch (error) {
    res.status(error.status || 500).send({ error: error.message });
  }
};

exports.updateImageClass = async (req, res) => {
    try {
        const imageId = req.params.imageId;
        const classId = req.body.classId;
        const updatedImage = await imageService.updateImageClass(imageId, classId, req.user._id);
        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.removeImageClass = async (req, res) => {
  try {
      const imageId = req.params.imageId;
      const updatedImage = await imageService.removeImageClass(imageId);
      res.status(200).json(updatedImage);
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
};

exports.updateBulkImagesClass = async (req, res) => {
  try {
      const imageIds = req.body.imageIds;
      const classId = req.body.classId;
      const updatedImages = await imageService.updateBulkImagesClass(imageIds, classId, req.user._id);
      res.status(200).json(updatedImages);
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
};

exports.deleteImages = async (req, res) => {
  try {
    const imageIds = req.body.imageIds;
    if (!imageIds || !Array.isArray(imageIds)) {
      return res.status(400).json({ error: "Invalid image IDs provided" });
    }

    const deleted = await imageService.deleteImages(imageIds);
    res.status(200).json({ deletedCount: deleted.deletedCount });
  } catch (error) {
    console.error("Error in deleteImages controller:", error);
    res.status(500).json({ error: error.message });
  }
};