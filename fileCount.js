const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const { apiKey, tgKey, tgChatId } = require("./config.js");

function sendTgMsg(message) {
  const { tgKey, tgChatId } = require("./config.js");
  const url = `https://api.telegram.org/bot${tgKey}/sendMessage`;
  axios.post(url, {
    chat_id: tgChatId,
    text: message,
  });
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
    getFileCount("no-random.txt").then((res) => (msg += `no-random: ${res}\n`)),
    getFileCount("yes-random.txt").then(
      (res) => (msg += `yes-random: ${res}\n`)
    ),
    getFileCount("err-random.txt").then(
      (res) => (msg += `err-random: ${res}\n`)
    ),
    getFileCount("no-numbers.txt").then(
      (res) => (msg += `no-numbers: ${res}\n`)
    ),
    getFileCount("yes-numbers.txt").then(
      (res) => (msg += `yes-numbers: ${res}\n`)
    ),
    getFileCount("err-numbers.txt").then(
      (res) => (msg += `err-numbers: ${res}\n`)
    ),
    getFileCount("no-rev-numbers.txt").then(
      (res) => (msg += `no-rev-numbers: ${res}\n`)
    ),
    getFileCount("yes-rev-numbers.txt").then(
      (res) => (msg += `yes-rev-numbers: ${res}\n`)
    ),
    getFileCount("err-rev-numbers.txt").then(
      (res) => (msg += `err-rev-numbers: ${res}\n`)
    ),
  ]).then(() => {
    sendTgMsg(msg);
  });
}

countFile();
setInterval(countFile, 60 * 60 * 1000);
