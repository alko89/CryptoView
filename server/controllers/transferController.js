const mongoose = require("mongoose");
const { Contract, Web3 } = require('web3');
const { erc20Abi } = require('viem');
require('dotenv').config();

const web3 = new Web3(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
const sender = web3.eth.accounts.wallet.add(process.env.SENDER_PRIVATE_KEY)[0];

const transfer = async (req, res) => {
  const { address } = req.params;

  try {
    const contract = new Contract(erc20Abi, process.env.TOKEN_ADDRESS, web3);
    const receipt = await contract.methods.transfer(address, 1).send({ from: sender.address });
    res.status(200).json({ hash: receipt.transactionHash });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { transfer };
