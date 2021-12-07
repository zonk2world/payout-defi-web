const fetch = require('node-fetch');
const config = require('../config/vars');

/**
 * @param blockNumber
 * @returns {Promise<unknown>}
 */
const getBlockReceipts = async (blockNumber) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'jsonrpc': '2.0',
                'id': 1,
                'method': 'parity_getBlockReceipts',
                'params': [blockNumber]
            })
        };

        try {
            fetch(config.ethRPCUrl, options)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data)
                });
        } catch (ex) {
            console.log(ex);
            reject();
        }
    });
};

module.exports = {
    getBlockReceipts,
};