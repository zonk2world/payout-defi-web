import axios from "axios";
import config from "config/vars";

const getProposals = async (params) => {
    return new Promise(function(resolve, reject) {
        const apiUrl = `${config.apiUrl}/proposals/all`;
        axios
            .get(apiUrl, { params })
            .then(response => {
                resolve(response.data);
            }).catch(e => {
            reject(e);
        });
    });
};

const getProposal = async (params) => {
    const { proposalId, ...rest } = params;
    return new Promise(function(resolve, reject) {
        const apiUrl = `${config.apiUrl}/proposals/${proposalId}`;
        axios
            .get(apiUrl, { params: rest })
            .then(response => {
                resolve(response.data);
            }).catch(e => {
            reject(e);
        });
    });
};

const getProposalStatusesCount = async (params) => {
    return new Promise(function (resolve, reject) {
        const apiUrl = `${config.apiUrl}/proposals/statuses-count`;
        axios
            .get(apiUrl, { params })
            .then((response) => {
                resolve(response.data);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

export default {
    getProposals,
    getProposal,
    getProposalStatusesCount
};