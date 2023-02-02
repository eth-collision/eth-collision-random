const { ethers } = require("ethers");
const { Wallet } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const { apiKey, tgKey, tgChatId } = require("./config.js");

let fileSuffix = "random-word";
let yesFilename = `yes-${fileSuffix}.txt`;
let noFilename = `no-${fileSuffix}.txt`;
let errFilename = `err-${fileSuffix}.txt`;

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

let arr =
  "candy maple cake sugar pudding cream honey rich smooth crumble treat sweet".split(" "
);

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function execOnceMultiAddr() {
  let keys = [];
  let addrs = "";
  for (let i = 0; i < 20; i++) {
    let priKey = "";
    let addr = "";
    while (true) {
      let wallet;
      try {
        arr = shuffle(arr);
        // console.log(arr)
        wallet = Wallet.fromMnemonic(arr.join(" "));
      } catch (error) {}
      if (wallet != undefined) {
        priKey = wallet.privateKey;
        addr = wallet.address
        break;
      }
    }
    keys.push(priKey);
    addrs += addr + ",";
    // console.log(keys, addrs)
  }
  addrs = addrs.slice(0, -1);
  getBalanceMultiAddr(keys, addrs);
}

setInterval(execOnceMultiAddr, 1000);
