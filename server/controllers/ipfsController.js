const ipfsModel = require("../models/ipfsModel.js");
const mongoose = require("mongoose");

let helia, s, CID;

(async () => {
  createHelia = (await import("helia")).createHelia;
  strings = (await import("@helia/strings")).strings;
  CID = (await import('multiformats')).CID;

  helia = await createHelia()
  s = strings(helia)
})();

/**
 * Read an NFT and store it's metadata in the database.
 */
const getText = async (req, res) => {
  const { hash } = req.params;

  try {
    const cid = CID.parse(hash)
    const text = await s.get(cid)
    res.status(200).json({ text });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const postText = async (req, res) => {
  const body = req.body;

  try {
    const hash = await s.add(body.text)
    res.status(200).json(hash);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getText, postText };
