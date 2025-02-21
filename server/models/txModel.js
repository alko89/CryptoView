const mongoose = require("mongoose");

const { Schema } = mongoose;

const TxSchema = new Schema(
  {
    hash: {
      type: String,
      unique: [true, "Transaction Exist"],
    },

    blockNumber: {
      type: Number,
    },

    blockHash: {
      type: String,
    },

    timeStamp: {
      type: Number,
    },

    nonce: {
      type: Number,
    },

    transactionIndex: {
      type: Number,
    },

    from: {
      type: String,
    },

    to: {
      type: String,
    },

    value: {
      type: String,
    },

    gas: {
      type: Number,
    },

    gasPrice: {
      type: String,
    },

    input: {
      type: String,
    },

    gasUsed: {
      type: Number,
    },
  },
);

module.exports = mongoose.model("TX", TxSchema);
