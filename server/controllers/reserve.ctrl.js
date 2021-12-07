const utils = require('../utils');
const config = require('../config/vars');
const { getReserves } = require('../helpers/reserve.helper');
const { getAssetsPromises, getAccountDataPromise, getVotingPowerPromise, getAddtionalRewardPools } = require('../services/asset.service');
const populousFarmServices = require('../services/populousFarm.service');

exports.getReserves = async (req, res) => {
    try {
        const network = config.env === "production" ? "1" : "3";
        const reserveData = await getReserves({
            network
        });
        res.status("200").json(reserveData);
    } catch (error) {
        utils.handleError(res, error)
    }
};

exports.getReservesAndPools = async (req, res) => {
    try {
        const network = config.env === "production" ? "1" : "3";
        const [reserveData, populousFarmPools] = await Promise.all([
            getReserves({ network }),
            populousFarmServices.getAllPools()
        ]);
        
        const result = {
            reserves: reserveData,
            populousFarmPools
        }
        res.status("200").json(result);
    } catch (error) {
        utils.handleError(res, error)
    }
};

exports.getReservesWithAccount = async (req, res) => {
    try {
        const network = config.env === "production" ? "1" : "3";
        const address = req.params.address;

        const data = {
            assets: [],
            account: {},
            totalVotingPower: 0,
            additionalRewardPools: [],
            populousFarmPools: [],
            totalAssetPrice: 0
        };

        const promiseArray = [];

        promiseArray.push(getVotingPowerPromise(address, data));
        promiseArray.push(getAccountDataPromise(address, data));
        promiseArray.push(getAddtionalRewardPools(address, data));
        promiseArray.push(populousFarmServices.getPoolInfo(address, data));

        let reserves = await getReserves({ network });
        reserves = reserves.map(item => item.toObject())
        for (let i = 0; i < reserves.length; i += 1) {
            const assetsPrice = reserves[i].assetsPrice;
            const totalLiquidity = reserves[i].totalLiquidity;
            reserves[i].address = address;
            data.totalAssetPrice += assetsPrice * totalLiquidity;
            promiseArray.push(...getAssetsPromises(address, reserves[i]))
        }

        await Promise.all(promiseArray);

        res.status("200").json({
            ...data,
            assets: reserves
        });
    } catch (error) {
        utils.handleError(res, error)
    }
};

exports.getReserveWithAccount = async (req, res) => {
    try {
        const network = config.env === "production" ? "1" : "3";
        const address = req.params.address;
        const reserveAddress = req.params.assetAddress;
        const promiseArray = [];
        const data = {
            asset: {},
            account: {},
            additionalRewardPools: [],
            populousFarmPools: [],
            totalVotingPower: 0,
        };

        promiseArray.push(getVotingPowerPromise(address, data));
        promiseArray.push(getAccountDataPromise(address, data));
        promiseArray.push(getAddtionalRewardPools(address, data));
        promiseArray.push(populousFarmServices.getPoolInfo(address, data));

        const reserves = await getReserves({ reserveAddress, network });
        if (reserves && reserves.length) {
            promiseArray.push(...getAssetsPromises(address, reserves[0]))

            await Promise.all(promiseArray);
            res.status("200").json({
                ...data,
                asset: reserves[0],
            });
            return;
        }
        res.status("200").json(data);
    } catch (error) {
        utils.handleError(res, error)
    }
};