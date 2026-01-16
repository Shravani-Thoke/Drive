const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  originalName: String,
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  fileType: String,
  size: Number,
  resourceType: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("File", fileSchema);
