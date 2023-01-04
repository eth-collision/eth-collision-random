const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const { apiKey, tgKey, tgChatId } = require("./config.js");

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
    getFileCount("no.txt").then((res) => (msg += `no: ${res}\n`)),
    getFileCount("yes.txt").then((res) => (msg += `yes: ${res}\n`)),
    getFileCount("err.txt").then((res) => (msg += `err: ${res}\n`)),
    getFileCount("no-numbers.txt").then((res) => (msg += `no: ${res}\n`)),
    getFileCount("yes-numbers.txt").then((res) => (msg += `yes: ${res}\n`)),
  ]).then(() => {
    sendTgMsg(msg);
  });
}

countFile();
setInterval(countFile, 60 * 60 * 1000);
