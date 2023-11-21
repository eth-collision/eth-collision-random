# Eth Collision Random

**Eth Collision Random** is a tool designed to generate random Ethereum private keys and then query the associated addresses' balances using the Etherscan.io API. Additionally, it offers a separate utility to count the occurrences of these generated keys. This process is sometimes referred to as the "Ethereum Address Collision" experiment, as it checks for the extremely unlikely event that two different private keys collide and generate the same Ethereum address.

## Features

- Generates random Ethereum private keys.
- Efficiently queries balances of associated Ethereum addresses using the Etherscan.io API.
- Logs addresses with a balance (a "hit") for further examination.
- Sends regular summary reports via Telegram.
- Optional utility (`count.js`) to monitor and report the occurrences of generated keys.


## Docker Support

Eth Collision Random now also supports deployment using Docker, making it easier to set up and run in a containerized environment.

### Using Docker

1. Basic Docker Run: To run Eth Collision Random using Docker, you can use the following command. This will pull the image and run the container in detached mode. Make sure to replace 'your_etherscan_api_key' with your actual Etherscan API key.

```
docker run \
  -d \
  --name eth-collision-random \
  --env ETHERSCAN_API_KEY='your_etherscan_api_key' \
  smallyu/eth-collision-random:latest
```

2. Docker Run with Telegram Support: If you want to enable Telegram notifications, you can also set the Telegram API key and Chat ID as environment variables. Replace 'your_telegram_bot_key' and 'your_telegram_chat_id' with your actual Telegram credentials.

```
docker run \
  -d \
  --name eth-collision-random \
  --env ETHERSCAN_API_KEY='your_etherscan_api_key' \
  --env TELEGRAM_API_KEY='your_telegram_bot_key' \
  --env TELEGRAM_CHAT_ID='your_telegram_chat_id' \
  smallyu/eth-collision-random:latest
```

### Docker Image

The Docker image for Eth Collision Random is available on Docker Hub and can be pulled using the tag smallyu/eth-collision-random:latest.

## Run from source

### Prerequisites

- [Node.js](https://nodejs.org/) (recommended version 14 or above)
- An [Etherscan.io](https://etherscan.io/) API key. You can obtain one by registering on the Etherscan website.

### Installation

1. Clone the repository:

```
git clone https://github.com/eth-collision/eth-collision-random.git
```


2. Navigate to the project directory:

```
cd eth-collision-random
```


3. Install the required dependencies:

```
npm install
```


### Usage

1. Export your Etherscan.io API key:


```
export ETHERSCAN_API_KEY='your_etherscan_api_key'
```


2. Run the primary script:

```
node random.js
```


### Optional: Count Utility (`count.js`)

If you wish to monitor and report on the occurrences of generated keys:

1. Configure the Telegram bot (this is optional, only if you want to receive reports via Telegram):


```
export TELEGRAM_API_KEY='your_telegram_bot_key'
export TELEGRAM_CHAT_ID='your_telegram_chat_id'
```


2. Run the count utility:


```
node count.js
```


## Caution

Please remember that generating and probing random Ethereum private keys poses both ethical and legal questions. Ensure you're aware of and compliant with relevant regulations and ethical standards. This tool is meant for educational and research purposes only.

## Contribution

If you have suggestions or want to improve the tool, feel free to open an issue or submit a pull request. All contributions are welcome!

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments

- Etherscan.io for providing the API service.
- Ethereum community for the resources and tools.

---

Enjoy exploring the Ethereum universe!
