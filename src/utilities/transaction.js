import { load, set, unset } from "./storage";

export const appendTransaction = (hash) => {
    const transactions = JSON.parse(load("transactions"));

    if (transactions && !transactions.find((el) => el === hash)) {
        transactions.push(hash);
        set("transactions", transactions);
    } else {
        set("transactions", [hash]);
    }
};

export const getAllTransactions = () => {
    const transactions = JSON.parse(load("transactions"));

    return transactions;
};

export const clearTransactions = () => {
    unset("transactions");
};
