const mongoose = require("mongoose");

const { Schema } = mongoose;

// TODO: compound index on address and id

const NftSchema = new Schema(
  {
    address: {
      type: String,
    },

    id: {
      type: String,
    },

    name: {
      type: String,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },
  },
);

module.exports = mongoose.model("NFT", NftSchema);
