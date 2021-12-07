const mongoose = require('mongoose');

const GraphSchema = new mongoose.Schema({
    address : {
        type: String,
        required : true,
    },
    stableBorrowRate : {
        type : String,
        required : true
    },
    variableBorrowRate : {
        type : String,
        required : true
    },
    liquidityRate : {
        type : String,
        required : true
    },
    utilizationRate : {
        type : String,
        required : true
    },
    totalBorrowed : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Graph', GraphSchema);