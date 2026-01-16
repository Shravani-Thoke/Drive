const express = require("express");
const isLoggedIn = require("../middleware/auth");
const upload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");
const File = require("../models/file.model");
const router = express.Router();
router.post(
  "/upload",
  isLoggedIn,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        // Multer errors
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.redirect(
              "/home?uploadError=Image size must be under 5MB"
            );
          }
        }

        if (err.message === "Only image files are allowed") {
          return res.redirect(
            "/home?error=Invalid file type. Only image files are allowed."
          );
        }

        return res.status(400).json({
          message: err.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.redirect("/home?error=No file uploaded");
      }
      
      let uploadOptions = { resource_type: "image" };
      const result = await cloudinary.uploader.upload(
        req.file.path,
        uploadOptions
      );

      await File.create({
        owner: req.user.id,
        originalName: req.file.originalname,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        fileType: req.file.mimetype,
        size: req.file.size,
        resourceType: result.resource_type,
      });

      res.redirect("/home");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.redirect("/home?error=Upload failed. Please try again.");
    }
  }
);

router.post("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!file) {
      return res.redirect("/home?error=File not found");
    }
    await cloudinary.uploader.destroy(file.cloudinaryPublicId, {
      resource_type: "image",
    });

    await File.deleteOne({ _id: req.params.id });

    res.redirect("/home?success=File deleted successfully");
  } catch (err) {
    res.redirect("/home?error=Error deleting file. Try again ");
  }
});

router.post("/rename/:id", isLoggedIn, async (req, res) => {
  try {
    const { newName } = req.body;
    if (!newName || newName.trim().length === 0) {
      return res.redirect("/home?error=Invalid file name");
    }
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!file) {
      return res.redirect("/home?error=File not found");
    }
    file.originalName = newName.trim();
    await file.save();
    res.redirect("/home?success=File renamed successfully");
  } catch (err) {
    res.redirect("/home?error=Error renaming file. Try again ");
  }
});
module.exports = router;
