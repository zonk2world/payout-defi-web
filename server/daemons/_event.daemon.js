const { saveEvent, isExistingEvent } = require('../helpers/event.helper');
const config = require('../config/vars');
const { governanceV2ABI } = require('../config/abi');
const utils = require('../utils');
const { EventTypeObjArray } = require('../utils/constants');
const {
    getBlock,
    getLastBlockNumber,
    subscribeNewBlockHeader,
    decodeLog,
    numberToHex,
} = require('../services/web3.service');
const { getBlockHeader, setBlockHeader } = require('../services/cache.service');
const { getBlockReceipts } = require('../services/alchemy.service');

let lastBlockNumber = 0;

/**
 * Filter event logs from tx Receipt
 * @param txReceipt
 * @returns {[]}
 */
const filterEventLogs = (txReceipt) => {
    if (!txReceipt || txReceipt.status === false || !txReceipt.logs || txReceipt.logs.length === 0) {
        return [];
    }
    return txReceipt.logs.filter((log) => {
        return utils.isEqualLowerStrings(log.address, config.governanceV2Address) && log.topics.length
    });
};

/**
 * Handle transaction
 *
 * @param block
 */
const handleTransaction = async (block) => {
    try {
        const transactions = block.transactions;
        const timestamp = block.timestamp;
        if (transactions.findIndex(tx => {
            return utils.isEqualLowerStrings(tx.from || '', config.governanceV2Address) ||
            utils.isEqualLowerStrings(tx.to || '', config.governanceV2Address)
        }) === -1) {
           return;
        }
        const txReceipts = await getBlockReceipts(numberToHex(block.number));
        if (!txReceipts || !txReceipts.result.length) {
            return;
        }
        // iterate transactions array
        for(const tx of txReceipts.result) {
            // filter event logs
            const logs = filterEventLogs(tx);
            for(const log of logs) {
                const event = EventTypeObjArray.find(event => utils.isEqualLowerStrings(event.signature, log.topics[0]));
                if (event) {
                    // get event json
                    const eventJson = governanceV2ABI.find(item => item.name === event.name);

                    if (eventJson) {
                        const data = {
                            name: event.name,
                            signature: event.signature,
                            transactionHash: log.transactionHash,
                            transactionIndex: log.transactionIndex,
                            fromAddress: tx.from,
                            toAddress: tx.to,
                            contractAddress: tx.contractAddress,
                            blockHash: log.blockHash,
                            blockNumber: log.blockNumber,
                            topics: log.topics,
                            data: log.data,
                            decodedData: await decodeLog(eventJson.inputs, log.data, log.topics),
                            timestamp
                        };
                        console.log(data);

                        // check duplicated event data
                        const isExisting = await isExistingEvent({
                            transactionHash: data.transactionHash,
                            transactionIndex: data.transactionIndex
                        });
                        if (!isExisting) {
                            // save Event data
                            await saveEvent(data);
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.log('Handle Transaction Error: ', e.message);
    }
};

/**
 * Process block
 *
 * @param blockNumber
 * @returns {Promise<void>}
 */
const processBlock = async (blockNumber) => {
    // get block data
    const block = await getBlock(blockNumber);

    // handle transaction
    if (block && block.transactions) {
        await handleTransaction(block);
    }

    // set block header
    setBlockHeader(blockNumber + 1);
};

/**
 * Process event
 *
 * @returns {Promise<void>}
 */
const processEvent = async () => {
    let subscription;
    try {
        // get synced blockNumber from cached data
        const syncedBlockNumber = getBlockHeader();

        // get last blocNumber from network
        if (!lastBlockNumber || lastBlockNumber <= syncedBlockNumber) {
            lastBlockNumber = await getLastBlockNumber();
        }

        if (lastBlockNumber >= syncedBlockNumber) {
            console.log(`>>>>>>>>> syncing block: ${syncedBlockNumber}`);
            await processBlock(syncedBlockNumber);
            // time delay
            processEvent();
        } else {
            console.log(`>>>>>>>>> finished block syncing and start subscribe <<<<<<<<<<<<<`);
            // subscribe new blocks from here
            subscription = subscribeNewBlockHeader( (blockHeader) => {
                if (blockHeader && blockHeader.number) {
                    processBlock(blockHeader.number);
                }
            });
        }
    } catch (e) {
        console.log(e);
        if (subscription) {
            subscription.unsubscribe((error, success) => {
                if(success)
                    console.log('Successfully web3 unsubscribed!');
            });
        }
    }
};

/**
 * Start Event
 */
const startEventDaemon = () => {
    if (config.blockHeaderReset) {
        console.log('config.blockHeaderNumber: ', config.blockHeaderNumber)
        setBlockHeader(config.blockHeaderNumber);
    }
    processEvent();
};

module.exports = startEventDaemon;