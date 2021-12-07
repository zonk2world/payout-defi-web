const fetch = require('node-fetch');
const bs58 = require('bs58');

/**
 * @param bytesString
 * @returns {*}
 */
const convertByte32ToIpfsHash = (bytesString) => {
    bytesString = '1220' + bytesString.slice(2);
    const bytes = Buffer.from(bytesString, 'hex')
    return bs58.encode(bytes);
};

/**
 * @param hash
 * @returns {*}
 */
const convertIpfsHashToByte32 = (hash) => {
    return `0x${bs58.decode(hash).toString('hex')}`;
};

/**
 * @param hash
 * @returns {Promise<unknown>}
 */
const fetchIpfsData = async (hash) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(`https://cloudflare-ipfs.com/ipfs/${hash}`)
                .then((response) => response.text())
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
    fetchIpfsData,
    convertByte32ToIpfsHash,
    convertIpfsHashToByte32
};