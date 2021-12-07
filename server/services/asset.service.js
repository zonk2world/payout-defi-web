const abi = require('../config/abi');
const utils = require('../utils');
const config = require('../config/vars');
const { getContractInstance, web3, hexToNumber } = require('../services/web3.service');
const { getPools } = require('../helpers/rewardPool.helper');

// initialize contract instances
const lendingPoolContract = getContractInstance(abi.lendingPoolABI, config.lendingPoolAddress);
const lendingPoolCoreContract = getContractInstance(abi.lendingPoolCoreABI, config.lendingPoolCoreAddress);
const lendingPoolDataProviderContract = getContractInstance(abi.lendingPoolDataProviderABI, config.lendingPoolDataProviderAddress);
const governanceStrategyContract = getContractInstance(abi.governanceStrategyABI, config.governanceStrategyAddress);


const getAccountDataPromise = (address, data) => {
    return new Promise(async (resolve) => {
        const _data = await lendingPoolContract.methods.getUserAccountData(address).call();
        data.account.totalLiquidityBalanceETH = _data[0] / 10 ** 18;
        data.account.totalCollateralBalanceETH = _data[1] / 10 ** 18;
        data.account.totalBorrowBalanceETH = _data[2] / 10 ** 18;
        data.account.totalFeesETH = _data[3] / 10 ** 18;
        data.account.availableBorrows = _data[4] / 10 ** 18;
        data.account.currentLiquidationThreshold = hexToNumber(_data[5]);
        data.account.currentLtv = hexToNumber(_data[6]);
        data.account.healthFactor = _data[7] / 10 ** 18;
        data.account.address = address;
        resolve(true)
    });
};

const getAddtionalRewardPools = (address, data) => {
    return new Promise(async (resolve) => {
        let additionalRewardPools = [];
        try {
            additionalRewardPools = await getPools();
        } catch {}
        const resultArray = additionalRewardPools.map(async (rewardPool, index) => {
            const rewardPoolContract = new web3.eth.Contract(
                abi.rewardPoolABI,
                rewardPool.poolAddress
            );

            let addtionalRewardPool = {
                rewardPool: rewardPool.poolAddress,
                decimals: rewardPool.decimals
            }

            try {
                let youStakedValue = await rewardPoolContract.methods.getuserinfo(address).call()
                if (youStakedValue) {
                    addtionalRewardPool.youStakedValue = Number(youStakedValue._hex) / 10 ** 8
                } else {
                    addtionalRewardPool.youStakedValue = 0
                }
            } catch (e) {
                console.log('You Staked Error: ', e)
                addtionalRewardPool.youStakedValue = 0
            }

            try {
                let totalDeposit = await rewardPoolContract.methods.getTotalDeposit().call()
                if (totalDeposit) {
                    addtionalRewardPool.totalDeposit = Number(totalDeposit._hex) / 10 ** 8
                } else {
                    addtionalRewardPool.totalDeposit = 0
                }
            } catch (e) {
                console.log('Total Deposit Error: ', e)
                addtionalRewardPool.totalDeposit = 0
            }

            // addtionalRewardPool.youStakedValue = await rewardPoolContract.methods.getuserinfo(address).call()
            // addtionalRewardPool.earned = await rewardPoolContract.methods.earned(address).call()

            try {
                let earned = await rewardPoolContract.methods.earned(address).call()
                if (earned) {
                    addtionalRewardPool.earned = Number(earned._hex) / 10 ** 8
                } else {
                    addtionalRewardPool.earned = null
                }
            } catch (e) {
                console.log("Error with reward pool withdraws: ", e)
                addtionalRewardPool.earned = 0;
            }

            try {

                let rewardsPerSec = await rewardPoolContract.methods.rewardRate().call()
                if (rewardsPerSec && addtionalRewardPool.totalDeposit !== 0) {

                    let rewardRate = rewardsPerSec / (10 ** 8);
                    let rewardsPerYear = rewardRate * 31536000;

                    let APY = (rewardsPerYear / addtionalRewardPool.totalDeposit) * 100;
                    addtionalRewardPool.APY = APY.toFixed(0);

                } else {
                    addtionalRewardPool.APY = 0
                }

                //here.....
                console.log(`calculation is using: rewardRate ${addtionalRewardPool.rewardRate} (which should be per/week)\b youStakedValue: ${addtionalRewardPool.youStakedValue} and totalDeposit ${addtionalRewardPool.totalDeposit} multiply by 100 = ${addtionalRewardPool.rewardRate}`)
                console.log(" ---- ------ ----- ----- ----- ------ ------ ------ ------ ------ ")
            } catch (e) {
                addtionalRewardPool.APY = 0
                console.log("Error with APY calc: ", e)
            }

            data.additionalRewardPools.push(addtionalRewardPool)
        })
        await Promise.all(resultArray)
        resolve(true)
    })
}

const getVotingPowerPromise = (address, data) => {
    return new Promise(async (resolve) => {
        const totalVotingPower = await governanceStrategyContract.methods.getVotingPower(address).call();
        data.totalVotingPower = totalVotingPower / (10 ** 8);
        resolve(true);
    });
}

const getAssetsPromises = (address, reserve) => {
    const promiseArray = [];
    const reserveAddress = reserve.reserveAddress
    const decimals = reserve.decimals;
    const PTokenAddress = reserve.PTokenAddress;
    const rewardPoolAddress = reserve.rewardPoolAddress;
    let walletBalance = 0;

    const ERC20Contract = getContractInstance(abi.erc20ABI, reserveAddress);
    const pTokenContract = getContractInstance(abi.pTokenABI, PTokenAddress);
    const rewardPoolContract = getContractInstance(abi.rewardPoolABI, rewardPoolAddress)

    const userReservePromise = new Promise(async (resolve) => {
        const userReserveData = await lendingPoolCoreContract.methods.getUserBasicReserveData(reserveAddress, address).call();
        const balanceDecreaseAllowed = await lendingPoolDataProviderContract.methods.balanceDecreaseAllowed(reserveAddress, address, userReserveData[0]).call();

        if (!utils.isEqualLowerStrings(rewardPoolAddress, '0x0000000000000000000000000000000000000000')) {

            let totalDeposit = await rewardPoolContract.methods.getTotalDeposit().call()
            if (totalDeposit) {
                totalDeposit = Number(totalDeposit._hex)
            } else {
                totalDeposit = 0
            }

            let youStakedValue = await rewardPoolContract.methods.getuserinfo(address).call()
            if (youStakedValue) {
                youStakedValue = Number(youStakedValue._hex)
            } else {
                youStakedValue = 0
            }

            let earned = await rewardPoolContract.methods.earned(address).call()
            if (earned) {
                earned = Number(earned._hex)
            } else {
                earned = 0
            }

            // // let rewardRate = await rewardPoolContract.methods.rewardPerToken().call()

            // console.log("direct reward rate: ", rewardRate)
            // if (rewardRate) {
            //     rewardRate = Number(rewardRate._hex)
            // } else {
            //     rewardRate = 0
            // }

            reserve.totalDeposit = (totalDeposit / (10 ** decimals)).toFixed(2);
            reserve.youStaked = (youStakedValue / (10 ** decimals)).toFixed(2);
            reserve.earned = (earned / (10 ** 8)).toFixed(2);

            let rewardsPerSec = await rewardPoolContract.methods.rewardRate().call()
            let rewardRate = rewardsPerSec / (10 ** 8);
            let rewardsPerYear = rewardRate * 31536000;

            let APY = (rewardsPerYear / reserve.totalDeposit) * 100;
            reserve.APY = APY.toFixed(0);

            console.log(`
            APY: ${APY}% \b
            Users Staked value: ${reserve.youStaked}\b
            Total Deposit: ${reserve.totalDeposit}\b
            Earned: ${reserve.earned}\b
            reward per/token rate: ${rewardRate}\b
            Reward Pool: ${rewardPoolAddress}\b
            `)

        }


        reserve.balanceDecreaseAllowed = balanceDecreaseAllowed;
        reserve.depositBalance = (userReserveData[0] / (10 ** decimals)).toFixed(2);
        reserve.availableWithdraw = (userReserveData[0] / (10 ** decimals)).toFixed(2);
        reserve.youBorrowed = (userReserveData[1] / (10 ** decimals)).toFixed(2);
        reserve.amountOwed = userReserveData[1] / (10 ** decimals) + userReserveData[2] / (10 ** decimals);
        resolve(true)
    });
    promiseArray.push(userReservePromise);

    const tokenBalancePromise = new Promise(async (resolve) => {
        const tokenBalance = await pTokenContract.methods.balanceOf(address).call();
        reserve.tokenBalance = (tokenBalance / (10 ** decimals)).toFixed(2);
        resolve(true)
    });
    promiseArray.push(tokenBalancePromise);

    const compoundPromise = new Promise(async (resolve) => {
        reserve.compoundedBalance = await lendingPoolCoreContract.methods.getUserBorrowBalances(reserveAddress, address).call();
        resolve(true)
    });
    promiseArray.push(compoundPromise);

    const collateralPromise = new Promise(async (resolve) => {
        reserve.isCollateral = await lendingPoolCoreContract.methods.isUserUseReserveAsCollateralEnabled(reserveAddress, address).call();
        resolve(true)
    });
    promiseArray.push(collateralPromise);

    const borrowPromise = new Promise(async (resolve) => {
        reserve.borrowRate = await lendingPoolCoreContract.methods.getUserCurrentBorrowRateMode(reserveAddress, address).call();
        resolve(true)
    });
    promiseArray.push(borrowPromise);

    const balancePromise = new Promise(async (resolve) => {
        if (utils.isEqualLowerStrings(reserveAddress, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")) {
            walletBalance = await web3.eth.getBalance(address);
            reserve.walletBalance = web3.utils.fromWei(walletBalance, "ether");
        } else {
            walletBalance = await ERC20Contract.methods.balanceOf(address).call();
            reserve.walletBalance = walletBalance / (10 ** decimals);
        }
        resolve(true);
    });
    promiseArray.push(balancePromise);

    if (!utils.isEqualLowerStrings(rewardPoolAddress, '0x0000000000000000000000000000000000000000')) {
        const rewardPromise = new Promise(async (resolve) => {
            reserve.rewardDeposited = ((await rewardPoolContract.methods.getuserinfo(address).call()) / 10 ** decimals).toFixed(2);
            reserve.rewardWithdraws = ((await rewardPoolContract.methods.earned(address).call()) / 10 ** 8).toFixed(2);
            resolve(true);
        });
        promiseArray.push(rewardPromise);
    }

    return promiseArray;
};

module.exports = {
    getAccountDataPromise,
    getVotingPowerPromise,
    getAssetsPromises,
    getAddtionalRewardPools
}