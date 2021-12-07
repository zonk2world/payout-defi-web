require("dotenv").config();

const env = process.env.REACT_APP_ENV;
const vars = {
    env,
    apiUrl: process.env.REACT_APP_SERVER_URL + "/api",
    lendingPoolAddress: process.env.REACT_APP_LENDING_POOL_ADDRESS,
    lendingPoolCoreAddress: process.env.REACT_APP_LENDING_POOL_CORE_ADDRESS,
    lendingPoolDataProviderAddress:
        process.env.REACT_APP_LENDING_POOL_DATA_PROVIDER_ADDRESS,
    lendingPoolConfiguratorAddress:
        process.env.REACT_APP_LENDING_POOL_CONFIGURATOR_ADDRESS,
    rewardPoolAddressManagerAddress:
        process.env.REACT_APP_REWARD_POOL_ADDRESS_MANAGER_ADDRESS,
    chainlinkProxyPriceProviderAddress:
        process.env.REACT_APP_CHAINLINK_PROXY_PRICE_PROVIDER_ADDRESS,
    pxtRewardPoolAddress: process.env.REACT_APP_PXT_REWARD_POOL_ADDRESS,
    pptRewardPoolAddress: process.env.REACT_APP_PPT_REWARD_POOL_ADDRESS,
    pptOldRewardPoolAddress: process.env.REACT_APP_PPT_OLD_REWARD_POOL_ADDRESS,
    populousFarmAddress: process.env.REACT_APP_POPULOUS_FARM_ADDRESS,
    pxtRewardPoolPToken: process.env.REACT_APP_PXT_REWARD_POOL_PTOKEN,
    pptRewardPoolPToken: process.env.REACT_APP_PPT_REWARD_POOL_PTOKEN,
    pptOldRewardPoolPToken: process.env.REACT_APP_PPT_REWARD_POOL_PTOKEN,
    feeProviderAddress: process.env.REACT_APP_FEE_PROVIDER_ADDRESS,
    testFaucetAddress: process.env.REACT_APP_TEST_FAUCET_ADDRESS,
    governanceV2Address: process.env.REACT_APP_GOVERNANCE_V2_ADDRESS,
    governanceStrategyAddress:
        process.env.REACT_APP_GOVERNANCE_STRATEGY_ADDRESS,
    daiAddress: process.env.REACT_APP_DAI_ADDRESS,
    rpcUrl: process.env.REACT_APP_ETH_RPC_URL,
    rpcChainId: process.env.REACT_APP_ETH_RPC_CHAIN_ID,
    ropstenApiKey: process.env.REACT_APP_ROPSTEN_API_KEY,
    etherScanUrl: process.env.REACT_APP_ETH_SCAN_URL
};

env === "production"
    ? console.log("This app is using production settings")
    : console.log("This app is using development settings");

console.log(vars);

export default vars;
