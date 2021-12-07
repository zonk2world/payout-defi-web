const mongoose = require('mongoose');

const ReserveSchema = new mongoose.Schema({
    reserveAddress : {
        type: String,
        required : true,
    },
    eth2usdValue : {
        type: String,
        required : true,
    },
    isActive : {
        type : Boolean,
        required : true
    },
    isReserveEnabled : {
        type : Boolean,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    symbol : {
        type : String,
        required : true
    },
    decimals : {
        type : String,
        required : true
    },
    rewardPoolAddress : {
        type : String,
        required : true
    },
    PTokenAddress: {
        type : String
    },
    liquidityRate : {
        type : String,
        required : true
    },
    stableBorrowRate : {
        type : String,
        required : true
    },
    variableBorrowRate : {
        type : String,
        required : true
    },
    totalLiquidity : {
        type : String,
        required : true
    },
    utilizationRate : {
        type : String,
        required : true
    },
    availableLiquidityETH : {
        type : String,
        required : true
    },
    availableLiquidity : {
        type : String,
        required : true
    },
    totalBorrowed : {
        type : String,
        required : true
    },
    assetsPriceETH : {
        type : String,
        required : true
    },
    assetsPrice : {
        type : String,
        required : true
    },

    compoundedBalance : {
        type : Number,
        default : 0
    },
    borrowRate : {
        type : Number,
        default : 0
    },
    isCollateral : {
        type : Number,
        default : 0
    },
    balanceDecreaseAllowed : {
        type : Number,
        default : 0
    },
    depositBalance : {
        type : Number,
        default : 0
    },
    availableWithdraw : {
        type : Number,
        default : 0
    },
    youBorrowed : {
        type : Number,
        default : 0
    },
    amountOwed : {
        type : Number,
        default : 0
    },
    walletBalance : {
        type : Number,
        default : 0
    },
    tokenBalance : {
        type : Number,
        default : 0
    },
    rewardDeposited : {
        type : Number,
        default : 0
    },
    rewardWithdraws : {
        type : Number,
        default : 0
    },
    date : {
        type : String,
        default : 0
    },
    network : {
        type : String,
        required : true
    },
    order : {
        type : String,
        default : 0
    }
});

module.exports = mongoose.model('Reserve', ReserveSchema);