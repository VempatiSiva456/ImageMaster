const imageService = require('../services/imageService');

exports.uploadImage = async (req, res) => {
    if (!req.files.length) {
        return res.status(400).send({ error: 'No files uploaded' });
    }

    try {
        console.log("came here");
        const files = req.files
        console.log(req.user._id)
        const results = await Promise.all(files.map(async file => {
            console.log(file);
            return await imageService.uploadImage(file, req.user._id);
        }));
        console.log(results);
        res.status(201).send(results);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).send({ error: error.message });
    }
};

exports.getImages = async (req, res) => {
    try {
        const images = await imageService.fetchImages();
        res.status(200).send(images);
    } catch (error) {
        res.status(error.status || 500).send({ error: error.message });
    }
};