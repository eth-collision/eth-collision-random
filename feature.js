const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const { apiKey, tgKey, tgChatId } = require("./config.js");

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

function getBalanceMultiAddr(priKey, address) {
  url = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${address}&tag=latest&apikey=${apiKey}`;
  axios
    .get(url)
    .then((res) => {
      if (res.data.status == "1") {
        for (let i = 0; i < res.data.result.length; i++) {
          let data = res.data.result[i];
          let account = data["account"];
          let balance = data["balance"];
          if (balance == "0") {
            writeFile(priKey[i], account, balance, "no.txt");
          } else {
            writeFile(priKey[i], account, balance, "yes.txt");
          }
        }
      }
      if (res.data.status == "0") {
        writeFile(priKey, address, res.data.result, "err.txt");
      }
    })
    .catch((err) => console.log(err));
}

function writeFile(priKey, address, balance, filename) {
  data = `${priKey},${address},${balance}\n`;
  fs.appendFile(filename, data, function (err) {
    if (err) console.log(err);
    console.log(`Saved: ${address}`);
  });
}

function execOnceMultiAddr(keys, addrs) {
  let keys = [];
  let addrs = "";
  for (let i = 0; i < 10; i++) {
    let priKey = genRandPriKey();
    let addr = getAddress(priKey);
    keys.push(priKey);
    addrs += addr[1] + ",";
  }
  addrs = addrs.slice(0, -1);
  getBalanceMultiAddr(keys, addrs);
}

setInterval(execOnceMultiAddr, 1000);
