const Web3 = require('web3')
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const config = require("../config/vars");
const web3 = createAlchemyWeb3(config.wss);


/**
 * Get contract Instance
 *
 * @param abi
 * @param address
 * @returns {web3.eth.Contract}
 */
const getContractInstance = (abi, address) => {
    return new web3.eth.Contract(abi, address);
};

/**
 * Get Block Data from BlockHash or ID
 *
 * @param blockHashOrId
 * @returns {Object}
 */
const getBlock = async (blockHashOrId) => {
    return await web3.eth.getBlock(blockHashOrId, true);
};

/**
 * Get last block number
 *
 * @returns {Promise<number>}
 */
const getLastBlockNumber = async () => {
    return await web3.eth.getBlockNumber();
};

/**
 * Get Transaction Receipt
 * @param hash
 * @returns {Promise<*>}
 */
const getTransactionReceipt = async (hash) => {
    return await web3.eth.getTransactionReceipt(hash);
};

/**
 * Decode event log
 *
 * @param inputs
 * @param hexString
 * @param topics
 * @returns {Promise<*>}
 */
const decodeLog = async (inputs, hexString, topics) => {
    if (hexString === "0x") {
        hexString = "";
    }
    return web3.eth.abi.decodeLog(inputs, hexString, topics);
};

/**
 * @param hexString
 * @returns {number}
 */
const hexToNumber = (hexString) => {
    return web3.utils.hexToNumber(hexString);
};

/**
 * @param number
 * @returns {string}
 */
const numberToHex = (number) => {
    return web3.utils.numberToHex(number);
};

/**
 * @param hexString
 * @returns {string}
 */
const hexToNumberString = (hexString) => {
    return web3.utils.hexToNumberString(hexString);
};

const hexToString = (hexString) => {
    return web3.utils.hexToString(hexString);
};

/**
 * Subscribe new block header
 *
 * @param callback
 * @returns {Promise<void>}
 */
const subscribeNewBlockHeader = async (callback) => {
    return web3.eth
        .subscribe("newBlockHeaders", (error, result) => {
            if (!error) {
                return;
            }
            console.error(error);
        })
        .on("connected", (subscriptionId) => {
            // console.log(subscriptionId);
        })
        .on("data", (blockHeader) => {
            callback(blockHeader);
        })
        .on("error", (error) => {
            console.error(error);
        });
};

module.exports = {
    web3,
    getContractInstance,
    getBlock,
    getLastBlockNumber,
    getTransactionReceipt,
    decodeLog,
    hexToNumber,
    hexToNumberString,
    hexToString,
    numberToHex,
    subscribeNewBlockHeader,
};
