const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const { apiKey } = require("./config.js");

function genRandPriKey() {
  let s = "0123456789abcdef";
  let hex = "0x";
  for (let i = 0; i < 64; i++) {
    hex += s[Math.floor(Math.random() * 16)];
  }
  return hex;
}

function getAddress(privateKey) {
  let wallet = new ethers.Wallet(privateKey);
  return [privateKey, wallet.address];
}

function getBalance(priKey, address) {
  url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;
  axios
    .get(url)
    .then((res) => {
      writeFile(priKey, address, res.data.result);
    })
    .catch((err) => console.log(err));
}

function writeFile(priKey, address, balance) {
  filename = "";
  if (balance == '0') {
    filename = "no.txt";
  } else {
    filename = "yes.txt";
  }
  data = `${priKey},${address},${balance}\n`;
  fs.appendFile(filename, data, function (err) {
    if (err) console.log(err);
    console.log(`Saved: ${address}`);
  });
}

function execOnce() {
  let priKey = genRandPriKey();
  let addr = getAddress(priKey);
  getBalance(addr[0], addr[1]);
}

setInterval(execOnce, 1000);
