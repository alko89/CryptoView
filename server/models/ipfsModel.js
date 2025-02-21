const mongoose = require("mongoose");

const { Schema } = mongoose;

const IpfsSchema = new Schema(
  {
    hash: {
      type: String,
      unique: [true, "Data Exist"],
    },
  },
);

module.exports = mongoose.model("IPFS", IpfsSchema);
