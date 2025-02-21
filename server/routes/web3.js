const express = require("express");
const {
  getNft,
  getTransactions,
  getBalance,
} = require("../controllers/web3Controller.js");
const {
  transfer,
} = require("../controllers/transferController.js");

const router = express.Router();

router.get("/nft/:address/:id", getNft);
router.get("/transactions/:address", getTransactions);
router.get("/balance/:token/:address", getBalance);

router.post("/transfer/:address", transfer);

module.exports = router;
