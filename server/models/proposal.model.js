const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { ProposalStatuses } = require('../utils/constants');

const ProposalSchema = new mongoose.Schema(
    {
        proposalId: {
            type: Number,
            index: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ProposalStatuses,
            default: ProposalStatuses[0]
        },
        creator: {
            type: String
        },
        executor: {
            type: String
        },
        targets: [{
            type: String
        }],
        signatures: [{
            type: String
        }],
        calldatas: [{
            type: String
        }],
        withDelegatecalls: [{
            type: Boolean
        }],
        startBlock: {
            type: String
        },
        endBlock: {
            type: String
        },
        executionTime: {
            type: String
        },
        forVotes: {
            type: String
        },
        againstVotes: {
            type: String
        },
        executed: {
            type: Boolean
        },
        canceled: {
            type: Boolean
        },
        strategy: {
            type: String
        },
        ipfsHash: {
            type: String
        },
        ipfsString: {
            type: String
        },
        ipfsData: {
            type: Object
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

ProposalSchema.plugin(mongoosePaginate);
ProposalSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('Proposal', ProposalSchema);