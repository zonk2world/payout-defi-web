const utils = require('../utils');
const ipfsService = require('../services/ipfs.service');

exports.getIpfsData = async (req, res) => {
    try {
        const hash = req.params.hash;
        const data = ipfsService.fetchIpfsData(hash);
        res.status("200").json(data);
    } catch (error) {
        utils.handleError(res, error)
    }
};