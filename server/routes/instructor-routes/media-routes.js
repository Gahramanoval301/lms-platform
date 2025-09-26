const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

// const upload = multer({ dest: "uploads/" });
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file);
    res.status(200).json({
      message: "File uploaded successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error uploading file",
      sucess: false,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid publicId",
      });
    }
    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      message: "File deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading file",
      sucess: false,
    });
    console.log(error);
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      message: "Files uploaded successfully",
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in bulk uploading files",
      sucess: false,
    });
    console.log(error);
  }
});

module.exports = router;
