const Minio = require('minio');
const Image = require('../models/Image');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

const bucketName = "images";

createBucketIfNotExists(bucketName);

async function createBucketIfNotExists(bucketName) {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
    }
  } catch (error) {
    throw error;
  }
}

exports.uploadImage = async (mode, file, userId) => {
    const folder = mode === 'public' ? 'public' : 'private';
    const uniqueFilename = `${folder}/${uuidv4()}_${file.originalname}`;
    console.log(uniqueFilename, bucketName);

    try {
        await minioClient.putObject(bucketName, uniqueFilename, file.buffer, {
            'Content-Type': file.mimetype
        });

        const imageUrl = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/${bucketName}/${uniqueFilename}`;

        const image = new Image({
            filename: uniqueFilename,
            imageUrl: imageUrl,
            owner: userId,
            mode: mode,  
            status: 'pending'
        });

        await image.save();

        return { message: 'Image uploaded successfully', imageUrl, metadata: image };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw { message: 'Error uploading image', status: 500 };
    }
};

exports.fetchImages = async (mode, userId) => {
    try {
        let images;
        if (mode === "public") {
            images = await Image.find({ mode: mode });
        } else if (mode === "private") {
            images = await Image.find({ owner: userId, mode: mode });
        } else {
            throw new Error("Invalid mode specified");
        }
        if (images.length === 0) {
            throw { message: 'No images found', status: 404 };
        }
        return images.map(image => ({
            imageUrl: image.imageUrl,
            filename: image.filename
        }));
    } catch (error) {
        console.error('Error fetching images:', error);
        throw { message: 'Failed to retrieve images', status: error.status || 500 };
    }
};
