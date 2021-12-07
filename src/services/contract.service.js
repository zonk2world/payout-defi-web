import axios from "axios";
import * as priceService from "./price.service";
import config from "config/vars";
import abi from "config/abi";
import { STAKE_GAS_LIMIT } from "config/constants";

const web3 = require("web3");
const BN = web3.utils.BN;

//pares Number
export const parseNumber = (amount, decimal) => {
    amount = new BN(web3.utils.toWei(amount.toString()));
    let decimal_ = new BN(10).pow(new BN(decimal));
    return web3.utils.fromWei(amount.mul(decimal_));
};

export const createTransaction = async (transaction, callback, type = "") => {
    return new Promise((resolve, reject) => {
        transaction.on("transactionHash", function (hash) {
            callback(null, {
                type: 'transaction',
                data: {
                    status: 'pending',
                    txHash: hash,
                    timestamp: new Date(),
                    gas: "",
                    type,
                }
            })
        })
            .on("receipt", function (receipt) {
                callback(null, {
                    type: 'transaction',
                    data: {
                        status: 'success',
                        txHash: receipt.transactionHash,
                        timestamp: new Date(),
                        gas: receipt.gasUsed,
                        type,
                    }
                })
                resolve(receipt)
            })
            .on('error', function (error, receipt) {
                callback(null, {
                    type: 'transaction',
                    data: {
                        status: 'failed',
                        txHash: receipt.transactionHash,
                        timestamp: new Date(),
                        gas: receipt.gasUsed,
                        type,
                    }
                })
                reject(error)
            });
    });
};

export const getAccountData = async (base) => {
    const { web3, account } = base;
    const lendingPoolContract = new web3.eth.Contract(
        abi.lendingPoolABI,
        config.lendingPoolAddress
    );

    try {
        const accountData = await lendingPoolContract.methods
            .getUserAccountData(account.address)
            .call({ account: account.address });

        account.totalLiquidityBalanceETH = accountData[0] / 10 ** 18;
        account.totalCollateralBalanceETH = accountData[1] / 10 ** 18;
        account.totalBorrowBalanceETH = accountData[2] / 10 ** 18;
        account.totalFeesETH = accountData[3] / 10 ** 18;
        account.availableBorrows = accountData[4] / 10 ** 18;
        account.currentLiquidationThreshold = accountData[5];
        account.currentLtv = accountData[6];
        account.healthFactor = accountData[7] / 10 ** 18;
        return account;
    } catch (e) {
        return {};
    }
};

export const makeRepay = async (data, base, callback) => {
    const { address, amount, decimals } = data;
    const { web3, account } = base;

    const lendingPoolContract = new web3.eth.Contract(
        abi.lendingPoolABI,
        config.lendingPoolAddress
    );
    const ERC20Contract = new web3.eth.Contract(abi.erc20ABI, address);
    try {
        const max = parseNumber("999999999999999", decimals);
        const amount_ = parseNumber(amount, decimals);

        const allowance = await ERC20Contract.methods
            .allowance(account.address, config.lendingPoolCoreAddress)
            .call();
        if (allowance < amount_) {
            await createTransaction(
                ERC20Contract.methods
                    .approve(config.lendingPoolCoreAddress, max)
                    .send({ from: account.address }),
                callback,
                "Approve"
            );
        }
        const reserves = await createTransaction(
            lendingPoolContract.methods
                .repay(address, amount_, account.address)
                .send({ from: account.address, value: 0 }),
            callback,
            "Repay"
        );

        callback(null, { repay: reserves });
    } catch (ex) {
        return callback(ex);
    }
};

export const makeDeposit = async (data, base, callback) => {
    const { address, amount, decimals } = data;
    const { web3, account } = base;

    const lendingPoolContract = new web3.eth.Contract(
        abi.lendingPoolABI,
        config.lendingPoolAddress
    );
    const ERC20Contract = new web3.eth.Contract(abi.erc20ABI, address);
    try {
        let approveResult, reserves;
        const max = parseNumber("999999999999999", decimals);
        if (address.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
            const amount_ = parseNumber(amount, decimals);
            const allowance = await ERC20Contract.methods
                .allowance(account.address, config.lendingPoolCoreAddress)
                .call();
            if (allowance < amount_) {
                approveResult = await createTransaction(
                    ERC20Contract.methods
                        .approve(config.lendingPoolCoreAddress, max)
                        .send({ from: account.address }),
                    callback,
                    "Approve"
                );
            }
            reserves = await createTransaction(
                lendingPoolContract.methods
                    .deposit(address, amount_, "0x00")
                    .send({ from: account.address, value: 0 }),
                callback,
                "Deposit"
            );
        } else {
            const amount_ = web3.utils.toWei(amount.toString());
            reserves = await createTransaction(
                lendingPoolContract.methods
                    .deposit(address, amount_, "0x00")
                    .send({ from: account.address, value: amount_ }),
                callback,
                "Deposit"
            );
        }
        callback(null, { approve: approveResult, deposit: reserves });
    } catch (ex) {
        return callback(ex);
    }
};

export const makeWithdraw = async (data, base, callback) => {
    const { address, amount, decimals } = data;
    const { web3, account } = base;

    const lendingPoolCoreContract = new web3.eth.Contract(
        abi.lendingPoolCoreABI,
        config.lendingPoolCoreAddress
    );
    try {
        const pTokenAddress = await lendingPoolCoreContract.methods
            .getReservePTokenAddress(address)
            .call({ account: account.address });

        const pTokenContract = new web3.eth.Contract(
            abi.pTokenABI,
            pTokenAddress
        );

        const amount_ = parseNumber(amount, decimals);
        const reserves = await createTransaction(pTokenContract.methods
            .redeem(amount_)
            .send({ from: account.address, value: 0 }),
            callback,
            "Redeem"
        );

        callback(null, reserves);
    } catch (ex) {
        return callback(ex);
    }
};

export const makeRewardsClaim = async (data, base, callback) => {
    const { address, rewardPool, decimals } = data;
    const { web3, account } = base;

    const rewardPoolContract = new web3.eth.Contract(
        abi.rewardPoolABI,
        rewardPool
    );
    try {
        const reserves = await createTransaction(
            rewardPoolContract.methods
                .getReward()
                .send({ from: account.address, gas: 150000 }),
            callback,
            "Get Reward"
        );
        callback(null, {
            approve: null,
            reward: reserves,
        });
    } catch (ex) {
        return callback(ex);
    }
};

export const makeRewardsWithdraw = async (data, base, callback) => {
    const { address, amount, rewardPool, decimals } = data;
    const { web3, account } = base;

    const rewardPoolContract = new web3.eth.Contract(
        abi.rewardPoolABI,
        rewardPool
    );
    try {
        console.log(amount);
        const amount_ = parseNumber(amount, decimals);
        const reserves = await createTransaction(
            rewardPoolContract.methods
                .withdraw(amount_)
                .send({ from: account.address, gas: 150000 }),
            callback,
            "Withdraw Reward"
        );
        callback(null, {
            approve: null,
            reward: reserves,
        });
    } catch (ex) {
        return callback(ex);
    }
};

export const makeBorrow = async (data, base, callback) => {
    const { address, amount, rateType, decimals } = data;
    const { web3, account } = base;

    const lendingPoolContract = new web3.eth.Contract(
        abi.lendingPoolABI,
        config.lendingPoolAddress
    );

    try {
        const amount_ = parseNumber(amount, decimals);
        const rateType_ = rateType === "variable" ? "0x2" : "0x1";
        const reserves = await createTransaction(
            lendingPoolContract.methods
                .borrow(address, amount_, rateType_, "0x00")
                .send({
                    from: account.address,
                    gas: 150000,
                    value: "0x0",
                }),
            callback,
            "Borrow"
        );
        callback(null, { borrow: reserves });
    } catch (ex) {
        return callback(ex);
    }
};

export const makeStake = async (data, base, callback) => {
    const { reserve, ptoken, rewardPool, amount, decimals } = data;
    const { web3, account } = base;

    const rewardPoolContract = new web3.eth.Contract(
        abi.rewardPoolABI,
        rewardPool
    );
    const ERC20Contract = new web3.eth.Contract(abi.erc20ABI, ptoken);

    try {
        const max = parseNumber("999999999999999", decimals);

        const amount_ = parseNumber(amount, decimals);
        console.log(rewardPool, account.address);
        const allowance = await ERC20Contract.methods
            .allowance(account.address, rewardPool)
            .call();
        let approveResult;

        console.log(
            "approved rewardPool: ",
            rewardPool,
            " allowance: ",
            allowance.toString(),
            " pToken: ",
            ptoken,
            " amount: ",
            amount_.toString(),
            " max: ",
            " decimals: ",
            decimals
        );

        // console.log(amount_.toString(), allowance)
        if (allowance < amount_) {
            approveResult = await createTransaction(
                ERC20Contract.methods
                    .approve(rewardPool, max)
                    .send({ from: account.address }),
                callback,
                "Approve"
            );
        }

        const reserves = await createTransaction(
            rewardPoolContract.methods
                .stake(amount_)
                .send({ from: account.address, gas: STAKE_GAS_LIMIT }),
            callback,
            "Stake"
        );
        callback(null, { approve: null, reward: reserves });
    } catch (ex) {
        return callback(ex);
    }
};

export const makeFaucet = async (data, base, callback) => {
    const { reserve, amount, decimals } = data;
    const { web3, account } = base;

    const testFaucetContract = new web3.eth.Contract(
        abi.testFaucetABI,
        config.testFaucetAddress
    );

    try {
        console.log("faucet", reserve);
        const reserves = await createTransaction(
            testFaucetContract.methods
                .mint(reserve)
                .send({ from: account.address, value: 0 }),
            callback,
            "Mint"
        );

        callback(null, { faucet: reserves });
    } catch (ex) {
        return callback(ex);
    }
};

export const updateCollateral = async (data, base, callback) => {
    const { reserve, isCollateral, store } = data;
    const { web3, account } = base;

    const lendingPoolContract = new web3.eth.Contract(
        abi.lendingPoolABI,
        config.lendingPoolAddress
    );
    const lendingPoolCoreContract = new web3.eth.Contract(
        abi.lendingPoolCoreABI,
        config.lendingPoolCoreAddress
    );
    try {
        const result = await createTransaction(
            lendingPoolContract.methods
                .setUserUseReserveAsCollateral(reserve, isCollateral)
                .send({ from: account.address, gas: 150000 }),
            callback,
            "Collateral"
        );
        const _isCollateral = await lendingPoolCoreContract.methods
            .isUserUseReserveAsCollateralEnabled(reserve, account.address)
            .call({ account: account.address });
        let reserveData = store.getStore("assets");
        reserveData.filter(
            (value) => value.reserveAddress === reserve
        )[0].isCollateral = _isCollateral;
        store.setStore({ assets: reserveData });
        callback(null, result);
    } catch (err) {
        callback(err);
    }
};

export const swapBorrowRate = async (data, base, callback) => {
    const { reserve, store } = data;
    const { web3, account } = base;

    const lendingPoolContract = new web3.eth.Contract(
        abi.lendingPoolABI,
        config.lendingPoolAddress
    );
    const lendingPoolCoreContract = new web3.eth.Contract(
        abi.lendingPoolCoreABI,
        config.lendingPoolCoreAddress
    );
    try {
        const result = await createTransaction(
            lendingPoolContract.methods
                .swapBorrowRateMode(reserve)
                .send({ from: account.address, gas: 150000 }),
            callback,
            "Swap"
        );
        const borrowRate = await lendingPoolCoreContract.methods
            .getUserCurrentBorrowRateMode(reserve, account.address)
            .call({ account: account.address });
        let reserveData = store.getStore("assets");
        reserveData.filter(
            (value) => value.reserveAddress === reserve
        )[0].borrowRate = borrowRate;
        store.setStore({ assets: reserveData });
        callback(null, result);
    } catch (err) {
        callback(err);
    }
};

export const createProposal = async (data, base, callback) => {
    const {
        executor,
        targets,
        values,
        signatures,
        calldatas,
        withDelegatecalls,
        ipfsHash
    } = data;
    const { web3, account } = base;

    const governanceV2Contract = new web3.eth.Contract(
        abi.governanceV2ABI,
        config.governanceV2Address
    );
    try {
        const reserves = await createTransaction(
            governanceV2Contract.methods
                .create(
                    executor,
                    targets,
                    values,
                    signatures,
                    calldatas,
                    withDelegatecalls,
                    ipfsHash
                )
                .send({ from: account.address, gas: 150000 }),
            callback,
            "Create Proposal"
        );
        callback(null, {
            approve: null,
            reward: reserves,
        });
    } catch (ex) {
        return callback(ex);
    }
};

export const submitVote = async (data, base, callback) => {
    const { tokenAddress, tokenAmount, proposalId, support } = data;
    const { web3, account } = base;

    const governanceV2Contract = new web3.eth.Contract(
        abi.governanceV2ABI,
        config.governanceV2Address
    );
    try {
        const result = await createTransaction(
            governanceV2Contract.methods
                .submitVote(tokenAddress, tokenAmount, proposalId, support)
                .send({ from: account.address, gas: 150000 }),
            callback,
            "Submit Vote"
        );
        callback(null, result);
    } catch (ex) {
        return callback(ex);
    }
};

export const executeProposal = async (data, base, callback) => {
    const { proposalId } = data;
    const { web3, account } = base;

    const governanceV2Contract = new web3.eth.Contract(
        abi.governanceV2ABI,
        config.governanceV2Address
    );
    try {
        const result = await createTransaction(
            governanceV2Contract.methods
                .execute(proposalId)
                .send({ from: account.address, gas: 150000 }),
            callback,
            "Execute Proposal"
        );
        callback(null, result);
    } catch (ex) {
        return callback(ex);
    }
};

export const queueProposal = async (data, base, callback) => {
    const { proposalId } = data;
    const { web3, account } = base;

    const governanceV2Contract = new web3.eth.Contract(
        abi.governanceV2ABI,
        config.governanceV2Address
    );
    try {
        const result = await createTransaction(
            governanceV2Contract.methods
                .queue(proposalId)
                .send({ from: account.address, gas: 150000 }),
            callback,
            "Queue Proposal"
        );
        callback(null, result);
    } catch (ex) {
        return callback(ex);
    }
};

export const getVotingPower = async (base, callback) => {
    const { web3, account } = base;

    const governanceStrategyContract = new web3.eth.Contract(
        abi.governanceStrategyABI,
        config.governanceStrategyAddress
    );

    try {
        const power = await governanceStrategyContract.methods
            .getVotingPower(account.address)
            .call({ from: account.address });
        callback(null, power);
    } catch (ex) {
        return callback(ex);
    }
};

export const getReserves = async (base, callback) => {
    const { web3, account } = base;
    const lendingPoolCoreContract = new web3.eth.Contract(
        abi.lendingPoolCoreABI,
        config.lendingPoolCoreAddress
    );

    try {
        const reserves = await lendingPoolCoreContract.methods
            .getReserves()
            .call({ from: account.address });
        callback(null, reserves);
    } catch (ex) {
        return callback(ex);
    }
};

export const getReserveData = async (data, base, callback) => {
    const { reserve } = data;
    const { web3, account } = base;
    const lendingPoolContract = new web3.eth.Contract(
        abi.lendingPoolABI,
        config.lendingPoolAddress
    );
    const lendingPoolCoreContract = new web3.eth.Contract(
        abi.lendingPoolCoreABI,
        config.lendingPoolCoreAddress
    );
    const lendingPoolDataProviderContract = new web3.eth.Contract(
        abi.lendingPoolDataProviderABI,
        config.lendingPoolDataProviderAddress
    );
    const lendingPoolConfiguratorContract = new web3.eth.Contract(
        abi.lendingPoolConfiguratorABI,
        config.lendingPoolConfiguratorAddress
    );
    const chainlinkProxyPriceProviderContract = new web3.eth.Contract(
        abi.chainlinkProxyPriceProviderABI,
        config.chainlinkProxyPriceProviderAddress
    );
    const rewardPoolAddressManagerContract = new web3.eth.Contract(
        abi.rewardPoolAddressManagerABI,
        config.rewardPoolAddressManagerAddress
    );
    const ERC20Contract = new web3.eth.Contract(abi.erc20ABI, reserve);
    const eth2usdValue = await priceService.fetchEthToUsd();
    try {
        const reserveData = await lendingPoolContract.methods
            .getReserveData(reserve)
            .call({ account: account.address });
        const pTokenContract = new web3.eth.Contract(
            abi.pTokenABI,
            reserveData.PTokenAddress
        );
        const userReserveData = await lendingPoolCoreContract.methods
            .getUserBasicReserveData(reserve, account.address)
            .call({ account: account.address });

        const tokenBalance = await pTokenContract.methods
            .balanceOf(account.address)
            .call({ account: account.address });
        const assetsPriceETH = await chainlinkProxyPriceProviderContract.methods
            .getAssetPrice(reserve)
            .call({ account: account.address });
        const totalBorrowed = await lendingPoolCoreContract.methods
            .getReserveTotalBorrows(reserve)
            .call({ account: account.address });

        reserveData.eth2usdValue = eth2usdValue.price;
        reserveData.compoundedBalance = await lendingPoolCoreContract.methods
            .getUserBorrowBalances(reserve, account.address)
            .call({ account: account.address });
        reserveData.isCollateral = await lendingPoolCoreContract.methods
            .isUserUseReserveAsCollateralEnabled(reserve, account.address)
            .call({ account: account.address });
        reserveData.isActive = await lendingPoolCoreContract.methods
            .getReserveIsActive(reserve)
            .call({ account: account.address });
        reserveData.borrowRate = await lendingPoolCoreContract.methods
            .getUserCurrentBorrowRateMode(reserve, account.address)
            .call({ account: account.address });
        reserveData.isReserveEnabled = await lendingPoolConfiguratorContract.methods
            .isReserveEnabledForInvoicePool(reserve)
            .call({ account: account.address });
        reserveData.balanceDecreaseAllowed = await lendingPoolDataProviderContract.methods
            .balanceDecreaseAllowed(
                reserve,
                account.address,
                userReserveData[0]
            )
            .call({ account: account.address });

        let walletBalance;
        if (reserve.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
            reserveData.name = "Ether";
            reserveData.symbol = "ETH";
            reserveData.decimals = 18;
            const _weiValue = await web3.eth.getBalance(account.address);
            walletBalance = _weiValue;
            // walletBalance = await web3.utils.fromWei(_weiValue, "ether");
        } else {
            reserveData.name = await ERC20Contract.methods
                .name()
                .call({ account: account.address });
            reserveData.symbol = await ERC20Contract.methods
                .symbol()
                .call({ account: account.address });
            reserveData.decimals = await ERC20Contract.methods
                .decimals()
                .call({ account: account.address });
            walletBalance = await ERC20Contract.methods
                .balanceOf(account.address)
                .call({ account: account.address });
        }
        reserveData.rewardPoolAddress = await rewardPoolAddressManagerContract.methods
            .getRewardPool(reserve)
            .call({ account: account.address });

        reserveData.reserveAddress = reserve;
        reserveData.address = account;
        reserveData.liquidityRate = (
            reserveData.liquidityRate /
            10 ** 27
        ).toFixed(2);
        reserveData.stableBorrowRate = (
            reserveData.stableBorrowRate /
            10 ** 27
        ).toFixed(2);
        reserveData.variableBorrowRate = (
            reserveData.variableBorrowRate /
            10 ** 27
        ).toFixed(2);
        reserveData.totalLiquidity = (
            reserveData.totalLiquidity /
            10 ** reserveData.decimals
        ).toFixed(2);
        reserveData.utilizationRate = (
            (reserveData.utilizationRate / 10 ** 27) *
            100
        ).toFixed(2);
        reserveData.availableLiquidityETH = (
            reserveData.availableLiquidity /
            10 ** 18
        ).toFixed(2);
        reserveData.availableLiquidity = (
            reserveData.availableLiquidity * eth2usdValue.price
        ).toFixed(2);
        reserveData.depositBalance = (
            userReserveData[0] /
            10 ** reserveData.decimals
        ).toFixed(2);
        reserveData.availableWithdraw = (
            userReserveData[0] /
            10 ** reserveData.decimals
        ).toFixed(2);
        reserveData.youBorrowed = (
            userReserveData[1] /
            10 ** reserveData.decimals
        ).toFixed(2);
        reserveData.amountOwed =
            userReserveData[1] / 10 ** reserveData.decimals +
            userReserveData[2] / 10 ** reserveData.decimals;
        reserveData.totalBorrowed = (
            totalBorrowed /
            10 ** reserveData.decimals
        ).toFixed(2);
        reserveData.walletBalance = walletBalance / 10 ** reserveData.decimals;
        reserveData.tokenBalance = (
            tokenBalance /
            10 ** reserveData.decimals
        ).toFixed(2);
        reserveData.assetsPriceETH = assetsPriceETH / 10 ** 18;
        reserveData.assetsPrice =
            reserveData.assetsPriceETH * eth2usdValue.price;

        if (
            reserveData.rewardPoolAddress !==
            0x0000000000000000000000000000000000000000
        ) {
            const rewardPoolContract = new web3.eth.Contract(
                abi.rewardPoolABI,
                reserveData.rewardPoolAddress
            );
            reserveData.rewardDeposited = (
                (await rewardPoolContract.methods
                    .getuserinfo(account.address)
                    .call({ account: account.address })) /
                10 ** reserveData.decimals
            ).toFixed(2);
            reserveData.rewardWithdraws = (
                (await rewardPoolContract.methods
                    .earned(account.address)
                    .call({ account: account.address })) /
                10 ** 8
            ).toFixed(2);
        }
        callback(null, reserveData);
    } catch (ex) {
        console.log(ex);
        return callback(ex);
    }
};

export const getTransactions = async (address) => {
    return new Promise(function (resolve, reject) {
        const apiUrl = `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${config.ropstenApiKey}`;
        axios
            .get(apiUrl)
            .then((response) => {
                resolve(response.data.result);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
