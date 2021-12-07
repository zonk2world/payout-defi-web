const utils = require('../utils');
const eventHelper = require('../helpers/event.helper');

exports.getEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        res.status(200).json(await eventHelper.getEvent({ '_id': eventId }));
    } catch (error) {
        utils.handleError(res, error)
    }
};

exports.getEvents = async (req, res) => {
    try {
        res.status(200).json(await eventHelper.getEvents(req));
    } catch (error) {
        utils.handleError(res, error)
    }
};

exports.getVoteEvents = async (req, res) => {
    try {
        const events = await eventHelper.getVoteEvents(req);
        res.status(200).json(events);
    } catch (error) {
        utils.handleError(res, error)
    }
};