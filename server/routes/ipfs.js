const express = require("express");
const {
  getText,
  postText
} = require("../controllers/ipfsController.js");

const router = express.Router();

// Get nft
router.get("/:hash", getText);
router.post("/", postText);

module.exports = router;
