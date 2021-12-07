const utils = require('../utils');
const { getGraphsByAddress } = require('../helpers/graph.helper');

exports.getGraphs = async (req, res) => {
    try {
        const { reserve } = req.body;
        const graphData = await getGraphsByAddress(reserve);
        res.status("200").json(graphData);
    } catch (error) {
        utils.handleError(res, error)
    }
};