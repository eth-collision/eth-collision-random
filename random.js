const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const { apiKey, tgKey, tgChatId } = require("./config.js");

let fileSuffix = "random";
let yesFilename = `yes-${fileSuffix}.txt`;
let noFilename = `no-${fileSuffix}.txt`;
let errFilename = `err-${fileSuffix}.txt`;

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
      if (res.data.status == "1") {
        if (res.data.result == "0") {
          writeFile(priKey, address, res.data.result, noFilename);
        } else {
          writeFile(priKey, address, res.data.result, yesFilename);
        }
      }
      if (res.data.status == "0") {
        writeFile(priKey, address, res.data.result, errFilename);
      }
    })
    .catch((err) => console.log(err));
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
            writeFile(priKey[i], account, balance, noFilename);
          } else {
            writeFile(priKey[i], account, balance, yesFilename);
          }
        }
      }
      if (res.data.status == "0") {
        writeFile(priKey, address, res.data.result, errFilename);
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

function execOnceSingleAddr() {
  let priKey = genRandPriKey();
  let addr = getAddress(priKey);
}

function execOnceMultiAddr() {
  let keys = [];
  let addrs = "";
  for (let i = 0; i < 20; i++) {
    let priKey = genRandPriKey();
    let addr = getAddress(priKey);
    keys.push(priKey);
    addrs += addr[1] + ",";
  }
  addrs = addrs.slice(0, -1);
  getBalanceMultiAddr(keys, addrs);
}

setInterval(execOnceMultiAddr, 1000);

function sendTgMsg(message) {
  const { tgKey, tgChatId } = require("./config.js");
  const url = `https://api.telegram.org/bot${tgKey}/sendMessage?chat_id=${tgChatId}&text=${message}`;
  axios.get(url);
}

function getFileCount(file) {
  return new Promise((resolve, reject) => {
    var i;
    var count = 0;
    fs.createReadStream(file)
      .on("data", function (chunk) {
        for (i = 0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
      })
      .on("end", function () {
        resolve(count);
      })
      .on("error", function (err) {
        resolve(0);
      });
  });
}

function countFile() {
  let msg = "";
  Promise.all([
    getFileCount(noFilename).then((res) => (msg += `no: ${res}; `)),
    getFileCount(yesFilename).then((res) => (msg += `yes: ${res}; `)),
    getFileCount(errFilename).then((res) => (msg += `err: ${res}; `)),
  ]).then(() => {
    sendTgMsg(msg);
  });
}

countFile();
setInterval(countFile, 60 * 60 * 1000);
