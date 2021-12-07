const populousFarmService = require('../services/populousFarm.service');
const rewardPoolService = require('../services/rewardPool.service');

module.exports = {
    execute: async () => {
        console.log("Getting Pool Info: In Progress", new Date());
        await populousFarmService.updatePoolInfo();
        await rewardPoolService.getPoolInfo();
        console.log("Getting Pool Info: Completed", new Date());
    }
};