import axios from "axios";
import config from "config/vars";

const getReserveData = async (data) => {
    return new Promise(function (resolve, reject) {
        const apiUrl = `${config.apiUrl}/assets/all`;
        axios
            .get(apiUrl)
            .then((response) => {
                resolve(response.data);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

const getReserveDataAndPools = async () => {
    return new Promise(function (resolve, reject) {
        const apiUrl = `${config.apiUrl}/assets/all/pools`;
        axios
            .get(apiUrl)
            .then((response) => {
                resolve(response.data);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

const getAssetsWithAccount = async (data) => {
    return new Promise(function (resolve, reject) {
        const apiUrl = `${config.apiUrl}/assets/all/${data.address}`;
        axios
            .get(apiUrl)
            .then((response) => {
                resolve(response.data);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

const getAssetWithAccount = async (data) => {
    return new Promise(function (resolve, reject) {
        const apiUrl = `${config.apiUrl}/assets/${data.assetAddress}/${data.address}`;
        axios
            .get(apiUrl)
            .then((response) => {
                resolve(response.data);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

const getGraphData = async (data) => {
    return new Promise(function (resolve, reject) {
        const apiUrl = `${config.apiUrl}/graph/all`;
        axios
            .post(apiUrl, data)
            .then((response) => {
                resolve(response.data);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

export default {
    getReserveData,
    getAssetsWithAccount,
    getAssetWithAccount,
    getGraphData,
    getReserveDataAndPools
};
