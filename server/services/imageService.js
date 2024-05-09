const Minio = require("minio");
const Image = require("../models/Image");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
require("dotenv").config();
const { ObjectId } = mongoose.Types;

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_END_POINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
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
    throw new Error(error);
  }
}

async function generatePresignedUrl(objectName, bucketName, expiry) {
  try {
    await minioClient.statObject(bucketName, objectName);

    const presignedUrl = await new Promise((resolve, reject) => {
      minioClient.presignedGetObject(
        bucketName,
        objectName,
        expiry,
        {
          "Content-Disposition": "inline",
        },
        function (err, presignedUrl) {
          if (err) {
            reject(err);
          }
          resolve(presignedUrl);
        }
      );
    });
    return presignedUrl;
  } catch (error) {
    if (error.code === "NotFound") {
      throw new Error("File not found", 404);
    } else {
      throw new Error(error.message, 500);
    }
  }
}

exports.uploadImage = async (mode, file, userId) => {
  const folder = mode === "public" ? "public" : "private";
  const uniqueFilename = `${folder}/${uuidv4()}_${file.originalname}`;
  console.log(uniqueFilename, bucketName);

  try {
    await minioClient.putObject(bucketName, uniqueFilename, file.buffer, {
      "Content-Type": file.mimetype,
    });

    const expiry = 6 * 24 * 60 * 60; // URL valid for 6 days
    const imageUrl = await generatePresignedUrl(
      uniqueFilename,
      bucketName,
      expiry
    );

    const image = new Image({
      filename: uniqueFilename,
      imageUrl: imageUrl,
      owner: userId,
      mode: mode,
      status: "pending",
    });

    await image.save();

    return {
      message: "Image uploaded successfully",
      imageUrl,
      metadata: image,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error({ message: "Error uploading image", status: 500 });
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
      throw new Error({ message: "No images found", status: 404 });
    }
    return images.map((image) => ({
      _id: image._id,
      imageUrl: image.imageUrl,
      filename: image.filename,
      status: image.status,
      annotator: image.annotator,
      annotation: image.annotation
    }));
  } catch (error) {
    console.error("Error fetching images:", error);
    throw new Error({ message: "Failed to retrieve images", status: error.status || 500 });
  }
};

exports.updateImageClass = async (imageId, classId, userId) => {
  const updatedImage = await Image.findByIdAndUpdate(
      imageId,
      { annotation: classId, status: "annotated", annotator: userId },
      { new: true, populate: 'annotation' } 
  );
  if (!updatedImage) {
      throw new Error('Image not found or failed to update');
  }
  return updatedImage;
};

exports.removeImageClass = async (imageId) => {
  const updatedImage = await Image.findByIdAndUpdate(
      imageId,
      { annotation: null, status: "pending", annotator: null } 
  );
  if (!updatedImage) {
      throw new Error('Image not found or failed to remove class');
  }
  return updatedImage;
};

exports.updateBulkImagesClass = async (imageIds, classId, userId) => {
  try {
    const objectIds = imageIds.map(id => new ObjectId(id));

    const updatedImages = await Image.updateMany(
      { _id: { $in: objectIds } }, 
      {
        $set: {
          annotation: classId, 
          annotator: userId,   
          status: 'annotated'  
        }
      },
      { new: true }
    );

    const updatedDocs = await Image.find({ _id: { $in: objectIds } });

    return updatedDocs;
  } catch (error) {
    console.error('Error updating bulk images:', error);
    throw error;
  }
};