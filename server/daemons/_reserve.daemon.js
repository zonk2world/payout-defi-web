const abi = require('../config/abi');
const config = require('../config/vars');
const { getContractInstance } = require('../services/web3.service');
const priceService = require('../services/price.service');
const { getReserves, createReserve } = require('../helpers/reserve.helper');
const utils = require('../utils');

const lendingPoolCoreContract = getContractInstance(abi.lendingPoolCoreABI, config.lendingPoolCoreAddress);
const lendingPoolContract = getContractInstance(abi.lendingPoolABI, config.lendingPoolAddress);
const lendingPoolConfiguratorContract = getContractInstance(abi.lendingPoolConfiguratorABI, config.lendingPoolConfiguratorAddress);
const chainlinkProxyPriceProviderContract = getContractInstance(abi.chainlinkProxyPriceProviderABI, config.chainlinkProxyPriceProviderAddress);
const rewardPoolAddressManagerContract = getContractInstance(abi.rewardPoolAddressManagerABI, config.rewardPoolAddressManagerAddress);

/**
 * Save Reserve Data
 *
 * @param reserve
 * @param reserveData
 * @returns {Promise<void>}
 */
const saveReserveData = async (reserve, reserveData) => {
    try {
        reserveData.date = utils.formatDate(new Date());
        const result = await getReserves({ reserveAddress: reserve, network: reserveData.network });
        if (!result || result.length === 0) {
            await createReserve(reserveData);
        } else {
            // @todo remove after first fetching
            result[0].PTokenAddress = reserveData.PTokenAddress;
            result[0].eth2usdValue = reserveData.eth2usdValue;
            result[0].isActive = reserveData.isActive;
            result[0].isReserveEnabled = reserveData.isReserveEnabled;
            result[0].liquidityRate = reserveData.liquidityRate;
            result[0].stableBorrowRate = reserveData.stableBorrowRate;
            result[0].variableBorrowRate = reserveData.variableBorrowRate;
            result[0].totalLiquidity = reserveData.totalLiquidity;
            result[0].utilizationRate = reserveData.utilizationRate;
            result[0].availableLiquidityETH = reserveData.availableLiquidityETH;
            result[0].availableLiquidity = reserveData.availableLiquidity;
            result[0].totalBorrowed = reserveData.totalBorrowed;
            result[0].assetsPriceETH = reserveData.assetsPriceETH;
            result[0].assetsPrice = reserveData.assetsPrice;
            result[0].date = utils.formatDate(new Date());
            await result[0].save();
        }
    } catch (err) {
        console.log("error on Reserve Data save", err);
    }
};

/**
 * Get Reserve Data
 *
 * @returns {Promise<null>}
 */
const geReserveData = async () => {
    try {
        console.log("Reserve Data: In Progress", new Date());

        const eth2usdValue = await priceService.fetchEthToUsd();
        const reserves = await lendingPoolCoreContract.methods.getReserves().call();
      
        
        reserves.map(async (reserve, key) => {
            try {
                const reserveData = await lendingPoolContract.methods.getReserveData(reserve).call();
                const ERC20Contract = getContractInstance(abi.erc20ABI, reserve);
                if (utils.isEqualLowerStrings(reserve, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")) {
                    reserveData.name = "Ether";
                    reserveData.symbol = "ETH";
                    reserveData.decimals = 18;
                }
                else {
                    reserveData.name = await ERC20Contract.methods.name().call();
                    reserveData.symbol = await ERC20Contract.methods.symbol().call();
                    reserveData.decimals = await ERC20Contract.methods.decimals().call();
                }

                const assetsPriceETH = await chainlinkProxyPriceProviderContract.methods.getAssetPrice(reserve).call();
                const totalBorrowed = await lendingPoolCoreContract.methods.getReserveTotalBorrows(reserve).call();

                reserveData.eth2usdValue = eth2usdValue.price;
                reserveData.isActive = await lendingPoolCoreContract.methods.getReserveIsActive(reserve).call();
                reserveData.isReserveEnabled = await lendingPoolConfiguratorContract.methods.isReserveEnabledForInvoicePool(reserve).call();

                reserveData.rewardPoolAddress = await rewardPoolAddressManagerContract.methods.getRewardPool(reserve).call();
                reserveData.reserveAddress = reserve;
                reserveData.liquidityRate = (reserveData.liquidityRate / (10 ** 27)).toFixed(2);
                reserveData.stableBorrowRate = (reserveData.stableBorrowRate / (10 ** 27)).toFixed(2);
                reserveData.variableBorrowRate = (reserveData.variableBorrowRate / (10 ** 27)).toFixed(2);
                reserveData.totalLiquidity = (reserveData.totalLiquidity / (10 ** reserveData.decimals)).toFixed(2);
                reserveData.utilizationRate = ((reserveData.utilizationRate / (10 ** 27)) * 100).toFixed(2);
                reserveData.availableLiquidityETH = (reserveData.availableLiquidity / (10 ** 18)).toFixed(2);
                reserveData.availableLiquidity = ((reserveData.availableLiquidity / (10 ** 18)) * eth2usdValue.price).toFixed(2);
                reserveData.totalBorrowed = (totalBorrowed / (10 ** reserveData.decimals)).toFixed(2);
                reserveData.assetsPriceETH = assetsPriceETH / (10 ** 18);
                reserveData.assetsPrice = reserveData.assetsPriceETH * eth2usdValue.price;
                reserveData.order = key;
                reserveData.network = config.env === "production" ? "1" : "3";

                await saveReserveData(reserve, reserveData);
            } catch (e) {
                console.log('Get Reserve Error: ', e)
            }
        })

        console.log("Reserve Data: Completed", new Date());
    } catch (ex) {
        console.log(ex);
    }
};

module.exports = {
    geReserveData
};