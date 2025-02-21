const nftModel = require("../models/nftModel.js");
const txModel = require("../models/txModel.js");
const mongoose = require("mongoose");
const { Contract, Web3 } = require('web3');
const axios = require('axios');
const { erc721Abi, erc20Abi } = require('viem');
const { getUnixTime } = require("date-fns");
const { isDate } = require("validator");
require('dotenv').config();

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

/**
 * Read an NFT and store it's metadata in the database.
 */
const getNft = async (req, res) => {
  const { address, id } = req.params;

  try {
    // Check if the nft is already in the database.
    const nft = await nftModel.findOne({ address: address, id: id });
    if (nft) {
      return res.status(200).json(nft);
    }

    const contract = new Contract(erc721Abi, address, web3);
    const tokenUri = await contract.methods.tokenURI(id).call();
    const { data } = await axios.get(tokenUri);
    
    const newNft = new nftModel({
      address,
      id,
      name: data.name,
      description: data.description,
      image: data.image,
    });
    newNft.save();

    res.status(200).json(newNft);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fetchTransactionsFromExplorer = async (address, fromTimestamp, toTimestamp) => {
  const fromBlock = await axios.get(`https://api.etherscan.io/api`, {
    params: {
      module: 'block',
      action: 'getblocknobytime',
      timestamp: fromTimestamp,
      closest: 'after',
      apikey: process.env.ETHERSCAN_API_KEY
    }
  });

  const toBlock = await axios.get(`https://api.etherscan.io/api`, {
    params: {
      module: 'block',
      action: 'getblocknobytime',
      timestamp: toTimestamp,
      closest: 'before',
      apikey: process.env.ETHERSCAN_API_KEY
    }
  });

  // let page = 1;
  // let offset = 1000;
  // const transactions = [];
  // while (true) {
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: fromBlock.data?.result || 0,
        endblock: toBlock.data?.result || Number.MAX_SAFE_INTEGER,
        sort: 'desc',
        // page: page,
        // offset: offset,
        apikey: process.env.ETHERSCAN_API_KEY
      }
    });

  //   if (response.data.result.length === 0) {
  //     break;
  //   }

  //   transactions.push(...response.data.result);

  //   page++;
  // }

  return response.data.result.slice(0, 5);
}

const getTransactions = async (req, res) => {
  const address = req.params.address.toLowerCase();
  const { from, to } = req.query;

  try {
    const fromTimestamp = isDate(from) ? getUnixTime(from) : 0;
    const toTimestamp = isDate(to) ? getUnixTime(to) : getUnixTime(new Date());
  
    // Check if the transactions are already in the database.
    const transactions = await txModel.find({
      $or: [
        { from: address },
        { to: address }
      ],
      timeStamp: { $gte: fromTimestamp, $lte: toTimestamp }
    });
    if (transactions.length > 0) {
      return res.status(200).json(transactions);
    }

    const tx = await fetchTransactionsFromExplorer(address, fromTimestamp, toTimestamp);

    // Save transactions to the database
    const newTransactions = await txModel.insertMany(tx);

    res.status(200).json(newTransactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBalance = async (req, res) => {
  const { token, address } = req.params;

  try {
    const contract = new Contract(erc20Abi, token, web3);
    const balance = await contract.methods.balanceOf(address).call();
    const decimals = await contract.methods.decimals().call();
    const symbol = await contract.methods.symbol().call();
    const normalized = web3.utils.fromWei(balance, Number(decimals));

    res.status(200).json({ balance: normalized, symbol });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { getNft, getTransactions, getBalance };
