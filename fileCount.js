const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const { apiKey, tgKey, tgChatId } = require("./config.js");

let suffixs = ["random", "numbers", "rev-numbers"];

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

let list = [];
for (let suffix of suffixs) {
  list.push(
    getFileCount(`no-${suffix}.txt`).then((res) => `no-${suffix}: ${res}`)
  );
  list.push(
    getFileCount(`yes-${suffix}.txt`).then((res) => `yes-${suffix}: ${res}`)
  );
  list.push(
    getFileCount(`err-${suffix}.txt`).then((res) => `err-${suffix}: ${res}`)
  );
}

function countFile() {
  let msg = "";
  Promise.all([list]).then(() => {
    sendTgMsg(msg);
  });
}

countFile();
setInterval(countFile, 60 * 60 * 1000);
