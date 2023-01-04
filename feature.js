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

async function execOnceMultiAddr(keys, addrs) {
  for (let i = 0; i < addrs.length; i += 20) {
    let k = [];
    let s = "";
    for (let j = i; j < i + 20 && j < addrs.length; j++) {
      k.push(keys[j]);
      s += addrs[j] + ",";
    }
    s = s.slice(0, -1);
    getBalanceMultiAddr(k, s);
    await sleep(1000);
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

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
function rule2() {
  let s = "0123456789abcdef";
  let arr = [];
  for (let t = 50; t < 64; t++) {
    for (let k = 1; k < 16; k++) {
      for (let j = 64 - t; j >= 0; j--) {
        let hex = "0x";
        for (let i = 0; i < j; i++) {
          hex += "0";
        }
        for (let d = 0; d < t; d++) {
          hex += s[k];
        }
        for (let i = hex.length; i < 66; i++) {
          hex += "0";
        }
        arr.push(hex);
      }
    }
  }
  return arr;
}
// console.log(rule2());
// getAddrs(rule2());

function rule3() {
  let s = "0123456789abcdef";
  let arr = [];
  let hex = "0x";
  hex += s;
  hex += s;
  hex += s;
  hex += s;
  arr.push(hex);
  return arr;
}
// console.log(rule3());
// getAddrs(rule3());

function rule4() {
  let arr = [];
  arr.push("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  return arr;
}
getAddrs(rule4());
