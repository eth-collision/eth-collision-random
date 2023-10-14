const fs = require("fs");
const { ethers } = require("ethers");
const axios = require("axios");

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const FILE_PREFIX = "random";
const YES_FILENAME = `yes-${FILE_PREFIX}.txt`;
const NO_FILENAME = `no-count-${FILE_PREFIX}.txt`;
const ERR_FILENAME = `err-count-${FILE_PREFIX}.txt`;

let noCount = readCounterFromFile(NO_FILENAME);
let errCount = readCounterFromFile(ERR_FILENAME);

function createRandomWallet() {
    return ethers.Wallet.createRandom();
}

async function fetchBalancesForAddresses(privateKeys, addresses) {
  const url = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${addresses.join(',')}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
  
  try {
    const { data } = await axios.get(url);

    if (data.status === "1") {
      data.result.forEach((result, index) => {
        const { account, balance } = result;

        if (balance === "0") {
          noCount++;
          updateCounterFile(NO_FILENAME, noCount);
        } else {
          writeToFile(privateKeys[index], account, balance, YES_FILENAME);
        }
      });
    } else if (data.status === "0") {
      errCount++;
      updateCounterFile(ERR_FILENAME, errCount);
    }

  } catch (error) {
    console.error("Failed to fetch balances:", error.message);
  }
}

function writeToFile(privateKey, address, balance, filename) {
  const record = `${privateKey},${address},${balance}\n`;
  fs.appendFile(filename, record, (err) => {
    if (err) console.error("Failed to save data:", err.message);
    else console.log(`Saved: ${address}`);
  });
}

function readCounterFromFile(filename) {
    if (fs.existsSync(filename)) {
        return parseInt(fs.readFileSync(filename, 'utf8'), 10);
    }
    return 0;
}

function updateCounterFile(filename, count) {
    fs.writeFileSync(filename, count.toString());
}

function checkBalancesForMultipleAddresses() {
    const wallets = Array.from({ length: 20 }, createRandomWallet);
    const privateKeys = wallets.map(wallet => wallet.privateKey);
    const addresses = wallets.map(wallet => wallet.address);

    fetchBalancesForAddresses(privateKeys, addresses);
}

setInterval(checkBalancesForMultipleAddresses, 1000);
