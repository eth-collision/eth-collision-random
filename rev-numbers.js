const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const { apiKey, tgKey, tgChatId } = require("./config.js");

let fileSuffix = "rev-numbers";
let yesFilename = `yes-${fileSuffix}.txt`;
let noFilename = `no-${fileSuffix}.txt`;
let errFilename = `err-${fileSuffix}.txt`;

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

function execOnceMultiAddr(keys, addrs) {
  for (let i = 0; i < addrs.length; i += 20) {
    let k = [];
    let s = "";
    for (let j = i; j < i + 20 && j < addrs.length; j++) {
      k.push(keys[j]);
      s += addrs[j] + ",";
    }
    s = s.slice(0, -1);
    getBalanceMultiAddr(k, s);
  }
}

function getAddrs(priKeys) {
  let keys = [];
  let addrs = [];
  for (let i = 0; i < priKeys.length; i++) {
    let [k, v] = getAddress(priKeys[i]);
    keys.push(k);
    addrs.push(v);
  }
  execOnceMultiAddr(keys, addrs);
}

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

async function numbers() {
  for (let i = 1; i < 100; i += 20) {
    let arr = [];
    for (let j = i; j < i + 20; j++) {
      console.log(j);
      let hex = "0x";
      let s = j.toString(16);
      hex += s;
      for (let k = 0; k < 64 - s.length; k++) {
        hex += "0";
      }
      arr.push(hex);
    }
    // console.log(arr)
    getAddrs(arr);
    await sleep(1000);
  }
}
numbers();
