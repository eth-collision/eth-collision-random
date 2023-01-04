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
  for (let i = 0; i < addrs.length; i += 20) {
    let k = [];
    let s = "";
    for (let j = i; j < i + 20 && j < addrs.length; j++) {
      k.push(keys[j]);
      s += addrs[j] + ",";
    }
    s = s.slice(0, -1);
    console.log(k, s);
    getBalanceMultiAddr(k, s);
    setTimeout(() => {
      console.log("Waiting for 1 second...");
    }, 1000);
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

function rule1() {
  let s = "0123456789abcdef";
  let arr = [];
  for (let j = 1; j < 16; j++) {
    let hex = "0x";
    for (let i = 0; i < 64; i++) {
      hex += s[j];
    }
    arr.push(hex);
  }
  return arr;
}
// console.log(rule1());
// getAddrs(rule1());

function rule2() {
  let arr = [];
  for (let i = 1; i < 10000; i++) {
    let hex = "0x";
    let s = i.toString(16);
    for (let j = 0; j < 64 - s.length; j++) {
      hex += "0";
    }
    hex += s;
    arr.push(hex);
  }
  return arr;
}
let r2 = rule2();
console.log(r2[r2.length - 1]);
// getAddrs(rule2());
