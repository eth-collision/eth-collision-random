const axios = require("axios");
const fs = require("fs");

const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`;

async function sendMessageViaTelegram(message) {
  try {
    await axios.post(TELEGRAM_API_URL, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error("Failed to send message via Telegram:", error.message);
  }
}

function readCountFromFile(filePath) {
  try {
    return parseInt(fs.readFileSync(filePath, 'utf8'), 10);
  } catch (error) {
    return 0;  // If the file doesn't exist or there's any other error, return 0
  }
}

async function reportCounts() {
  try {
    const noCount = readCountFromFile("no-count-random.txt");
    const yesCount = await countLinesInFile("yes-random.txt");  // We still count lines for "yes" because it contains detailed records
    const errCount = readCountFromFile("err-count-random.txt");

    const reportMessage = `No: ${noCount}\nYes: ${yesCount}\nErr: ${errCount}`;
    await sendMessageViaTelegram(reportMessage);
  } catch (error) {
    console.error("Error reporting counts:", error.message);
  }
}

function countLinesInFile(filePath) {
  return new Promise((resolve) => {
    let lineCount = 0;

    fs.createReadStream(filePath)
      .on("data", (chunk) => {
        for (let byte of chunk) {
          if (byte === 10) lineCount++;
        }
      })
      .on("end", () => resolve(lineCount))
      .on("error", () => resolve(0));
  });
}

reportCounts();
setInterval(reportCounts, 60 * 60 * 1000);
