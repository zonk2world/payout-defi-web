import Web3 from "web3";
import config from "config/vars";
import configAbi from "config/abi";

export const calculateLoanOriginationFee = async (store, amount, callback) => {
    const account = store.getStore("account");
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const feeProviderContract = new web3.eth.Contract(
        configAbi.feeProviderABI,
        config.feeProviderAddress
    );

    try {
        var fee = await feeProviderContract.methods
            .calculateLoanOriginationFee(account.address, amount)
            .call({ account: account.address });

        // fee = fee ;/// 10 ** 18;
        callback(null, fee);
    } catch (ex) {
        console.log(ex);
        return callback(ex);
    }
};
