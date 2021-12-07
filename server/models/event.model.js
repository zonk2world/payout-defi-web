const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { EventTypes } = require('../utils/constants');

const EventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: EventTypes,
            maxlength: 1000
        },
        transactionIndex : {
            type:  Number,
        },
        transactionHash : {
            type: String,
        },
        fromAddress : {
            type:  String,
        },
        toAddress : {
            type: String,
        },
        contractAddress: {
            type: String,
        },
        blockHash : {
            type: String,
        },
        blockNumber : {
            type:  Number,
        },
        timestamp: {
            type: Number,
        },
        signature: {
            type: String,
            maxlength: 70
        },
        topics: [{
                type: String
        }],
        data: {
            type: String,
        },
        decodedData: {
            type: Object,
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

EventSchema.plugin(mongoosePaginate);
EventSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Event', EventSchema);