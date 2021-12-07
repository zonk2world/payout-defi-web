const mongoose = require('mongoose');

const PoolSchema = new mongoose.Schema({
    symbol : {
        type : String,
        required : true
    },
    decimals : {
        type : String,
        required : true
    },
    poolAddress: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('reward_pools', PoolSchema);