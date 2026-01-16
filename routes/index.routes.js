const express = require("express")
const isLoggedIn = require("../middleware/auth")
const router = express.Router()
const File = require("../models/file.model");
const { query } = require("express-validator");

router.get("/", (req, res) => {
    res.render("entry")
})
router.get("/home", isLoggedIn, async (req, res) => {
  const files = await File.find({
    owner: req.user.id
  }).sort({ createdAt: -1 });

  res.render("home", {
    user: req.user,
    files: files,
    query : req.query
  });
});


module.exports = router