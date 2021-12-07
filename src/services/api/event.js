import axios from "axios";
import config from "config/vars";

const getEvents = async (params) => {
    return new Promise(function(resolve, reject) {
        const apiUrl = `${config.apiUrl}/events/all`;
        axios
            .get(apiUrl, { params })
            .then(response => {
                resolve(response.data);
            }).catch(e => {
            reject(e);
        });
    });
};

const getVoteEvents = async (params) => {
    const { proposalId, ...rest } = params;
    return new Promise(function(resolve, reject) {
        const apiUrl = `${config.apiUrl}/events/proposals/${proposalId}/votes`;
        axios
            .get(apiUrl, { params: rest })
            .then(response => {
                resolve(response.data);
            }).catch(e => {
            reject(e);
        });
    });
};

export default {
    getEvents,
    getVoteEvents
};