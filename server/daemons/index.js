const cron = require('node-cron');
const startEventDaemon = require('./_event.daemon');
const startProposalDaemon = require('./_proposal.daemon');
const { getGraphData } = require('./_graph.daemon');
const { geReserveData } = require('./_reserve.daemon');
const poolDaemon = require('./_pool.daemon');

module.exports = () => {
    // start event daemon

    console.log(">>>>>>>>>>> Event Daemon Started <<<<<<<<<<<<<");
    startEventDaemon();

    // start proposal daemon
    console.log(">>>>>>>>>>> Proposal Daemon Started <<<<<<<<<<<<<");
    startProposalDaemon();

    console.log(">>>>>>>>>>> Graph Daemon Started <<<<<<<<<<<<<");
    cron.schedule('0 0 * * *', function () {
        getGraphData();
    });

    console.log(">>>>>>>>>>> Reserve Daemon Started <<<<<<<<<<<<<");
    cron.schedule('*/1 * * * *', function () {
        geReserveData();
    });

    console.log(">>>>>>>>>>> Pool Daemon Started <<<<<<<<<<<<<");
    cron.schedule('*/1 * * * *', function () {
        poolDaemon.execute();
    });
};