export const fetchTokenPrice = async (token = "0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a", currencies = "USD") => {
    return new Promise(function(resolve, reject) {
        try {
            const apiUrl = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${token}&vs_currencies=${currencies}`;
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                });
        } catch (ex) {
            return reject();
        }
    });
};

export const fetchEthToUsd = async () => {
    return new Promise(function(resolve, reject) {
        try {
            const apiUrl = `https://api.binance.com/api/v1/ticker/price?symbol=ETHUSDT`;
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                });
        } catch (ex) {
            return reject();
        }
    });
};
