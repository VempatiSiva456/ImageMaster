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
