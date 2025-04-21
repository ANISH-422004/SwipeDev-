const ImageKit = require("imagekit");
const { Readable } = require("stream");
const mongoose = require("mongoose");
const config = require("../config/config");

const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

// Upload buffer stream
const uploadBufferStream = async (fileBuffer) => {
  const result = await imagekit.upload({
    file: Readable.from(fileBuffer),
    fileName: new mongoose.Types.ObjectId().toString(),
    isPublished: true,
    folder: "/SWAPDEV",
  });
  return result;
};

// Delete file by fileId
const deleteImage = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
    console.log("Deleted image from ImageKit:", fileId);
  } catch (err) {
    console.error("Error deleting file from ImageKit:", err.message);
  }
};

module.exports = {
  imagekit,
  uploadBufferStream,
  deleteImage,
};
