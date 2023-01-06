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

let priKey = genRandPriKey();
let [p, a] = getAddress(priKey);
// console.log(p, a);

var Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');
const privateKeyString = '0x61ce8b95ca5fd6f55cd97ac60817777bdf64f1670e903758ce53efc32c3dffeb';
const privateKeyBuffer = EthUtil.toBuffer(p);
const wallet = Wallet['default'].fromPrivateKey(privateKeyBuffer);
const publicKey = wallet.getPublicKeyString();
// console.log(publicKey);
const address = wallet.getAddressString();
console.log(address);
const keystoreFilename = wallet.getV3Filename();
console.log(keystoreFilename);
const keystore = wallet.toV3("PASSWORD");
keystore.then(function(result) {
    console.log(result);
});