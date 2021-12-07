export const STAKE_GAS_LIMIT = 150000;

export const ERROR = "ERROR";
export const RESET_PROFILE = "RESET_PROFILE";
export const CONFIGURE = "CONFIGURE";

// Transaction management - Logical Unit
export const TRANSACTION_STARTED = "TRANSACTION_STARTED";
export const TRANSACTION_FINISHED = "TRANSACTION_FINISHED";
export const TRANSACTION_FAILED = "TRANSACTION_FAILED";

// Transaction management - Blockchain unit
export const TRANSACTION_EMITTED = "TRANSACTION_EMITTED";

// #Accounts
export const CHANGE_EVENT = "CHANGE";

export const CONNECTION_CONNECTED = "CONNECTION_CONNECTED";
export const CONNECTION_DISCONNECTED = "CONNECTION_DISCONNECTED";
export const CONNECTION_ERROR = "CONNECTION_ERROR";

export const GET_BALANCES = "GET_BALANCES";
export const BALANCES_RETURNED = "BALANCES_RETURNED";

export const GET_BALANCES_LIGHT = "GET_BALANCES_LIGHT";
export const BALANCES_LIGHT_RETURNED = "BALANCES_LIGHT_RETURNED";

export const GET_VAULT_BALANCES_FULL = "GET_VAULT_BALANCES_FULL";
export const VAULT_BALANCES_FULL_RETURNED = "VAULT_BALANCES_FULL_RETURNED";

export const GET_VAULT_BALANCES = "GET_VAULT_BALANCES";
export const VAULT_BALANCES_RETURNED = "VAULT_BALANCES_RETURNED";

export const GET_EXPERIMENTAL_VAULT_BALANCES_FULL =
    "GET_EXPERIMENTAL_VAULT_BALANCES_FULL";
export const EXPERIMENTAL_VAULT_BALANCES_FULL_RETURNED =
    "EXPERIMENTAL_VAULT_BALANCES_FULL_RETURNED";

export const GET_EXPERIMENTAL_VAULT_BALANCES =
    "GET_EXPERIMENTAL_VAULT_BALANCES";
export const EXPERIMENTAL_VAULT_BALANCES_RETURNED =
    "EXPERIMENTAL_VAULT_BALANCES_RETURNED";

// #Dashboard
export const GET_DASHBOARD_SNAPSHOT = "GET_DASHBOARD_SNAPSHOT";
export const DASHBOARD_SNAPSHOT_RETURNED = "DASHBOARD_SNAPSHOT_RETURNED";

export const GET_USD_PRICE = "GET_USD_PRICE";
export const USD_PRICE_RETURNED = "USD_PRICE_RETURNED";

// #Earn
export const INVEST = "INVEST";
export const INVEST_RETURNED = "INVEST_RETURNED";

export const INVEST_ALL = "INVEST_ALL";
export const INVEST_ALL_RETURNED = "INVEST_ALL_RETURNED";

export const REDEEM = "REDEEM";
export const REDEEM_RETURNED = "REDEEM_RETURNED";

// #Vaults
export const DEPOSIT_VAULT = "DEPOSIT_VAULT";
export const DEPOSIT_VAULT_RETURNED = "DEPOSIT_VAULT_RETURNED";

export const DEPOSIT_ALL_VAULT = "DEPOSIT_ALL_VAULT";
export const DEPOSIT_ALL_VAULT_RETURNED = "DEPOSIT_ALL_VAULT_RETURNED";

export const WITHDRAW_VAULT = "WITHDRAW_VAULT";
export const WITHDRAW_VAULT_RETURNED = "WITHDRAW_VAULT_RETURNED";

export const WITHDRAW_ALL_VAULT = "WITHDRAW_ALL_VAULT";
export const WITHDRAW_ALL_VAULT_RETURNED = "WITHDRAW_ALL_VAULT_RETURNED";

// #experimental
export const DEPOSIT_EXPERIMENTAL_VAULT = "DEPOSIT_EXPERIMENTAL_VAULT";
export const DEPOSIT_EXPERIMENTAL_VAULT_RETURNED =
    "DEPOSIT_EXPERIMENTAL_VAULT_RETURNED";

export const DEPOSIT_ALL_EXPERIMENTAL_VAULT = "DEPOSIT_ALL_EXPERIMENTAL_VAULT";
export const DEPOSIT_ALL_EXPERIMENTAL_VAULT_RETURNED =
    "DEPOSIT_ALL_EXPERIMENTAL_VAULT_RETURNED";

export const CLAIM_EXPERIMENTAL_VAULT = "CLAIM_EXPERIMENTAL_VAULT";
export const CLAIM_EXPERIMENTAL_VAULT_RETURNED =
    "CLAIM_EXPERIMENTAL_VAULT_RETURNED";

export const ZAP_EXPERIMENTAL_VAULT = "ZAP_EXPERIMENTAL_VAULT";
export const ZAP_EXPERIMENTAL_VAULT_RETURNED =
    "ZAP_EXPERIMENTAL_VAULT_RETURNED";

// #Zap
export const ZAP = "ZAP";
export const ZAP_RETURNED = "ZAP_RETURNED";

export const SWAP = "SWAP";
export const SWAP_RETURNED = "SWAP_RETURNED";

export const TRADE = "TRADE";
export const TRADE_RETURNED = "TRADE_RETURNED";

export const GET_CURV_BALANCE = "GET_CURV_BALANCE";
export const GET_CURV_BALANCE_RETURNED = "GET_CURV_BALANCE_RETURNED";

export const GET_BEST_PRICE = "GET_BEST_PRICE";
export const GET_BEST_PRICE_RETURNED = "GET_BEST_PRICE_RETURNED";

// #APR
export const GET_AGGREGATED_YIELD = "GET_AGGREGATED_YIELD";
export const GET_AGGREGATED_YIELD_RETURNED = "GET_AGGREGATED_YIELD_RETURNED";

// #Manage
export const DONATE = "DONATE";
export const DONATE_RETURNED = "DONATE_RETURNED";

export const REBALANCE = "REBALANCE";
export const REBALANCE_RETURNED = "REBALANCE_RETURNED";

export const GET_CONTRACT_EVENTS = "GET_CONTRACT_EVENTS";
export const GET_CONTRACT_EVENTS_RETURNED = "GET_CONTRACT_EVENTS_RETURNED";

export const IDAI = "IDAI";
export const IDAI_RETURNED = "IDAI_RETURNED";

export const GET_STATISTICS = "GET_STATISTICS";
export const STATISTICS_RETURNED = "STATISTICS_RETURNED";

// #Deposit

export const GET_RESERVES = "GET_RESERVES";

//Action Type
export const ActionTypes = {
    CONFIGURE: "configure",
    VOTING_POWER: "voting power",
    DEPOSIT: "deposit",
    WITHDRAW: "withdraw",
    BORROW: "borrow",
    REWARDS: "rewards",
    REPAY: "repay",
    FAUCET: "faucet",
    REWARDS_CLAIM: "rewards claim",
    REWARDS_WITHDRAW: "rewards withdraw",
    UPDATE_COLLATERAL: "update collateral",
    SWAP_BORROW_RATE: "swap borrow rate",
    SUBMIT_VOTE: "submit vote",
    EXECUTE_PROPOSAL: "execute proposal",
    QUEUE_PROPOSAL: "queue proposal",
    POPULOUS_FARM_DEPOSIT: "POPULOUS_FARM_DEPOSIT",
    POPULOUS_FARM_WITHDRAW: "POPULOUS_FARM_WITHDRAW"
};

export const ProposalStatuses = [
    {
        name: "All Types",
        value: "all",
        color: "#607D8B",
    },
    {
        name: "Active",
        value: "active",
        color: "#8E24AA",
    },
    {
        name: "Queued",
        value: "queued",
        color: "#FB8C00",
    },
    {
        name: "Pending",
        value: "pending",
        color: "#FB8C00",
    },
    {
        name: "Executed",
        value: "executed",
        color: "#30B651",
    },
    {
        name: "Succeeded",
        value: "succeeded",
        color: "#30B651",
    },
    {
        name: "Canceled",
        value: "canceled",
        color: "#EF392F",
    },
    {
        name: "Failed",
        value: "failed",
        color: "#EF392F",
    },
    {
        name: "Expired",
        value: "expired",
        color: "#EF392F",
    },
];

export const WALLETS = {
    METAMASK: { label: "MetaMask", name: "METAMASK" },
    WALLET_CONNECT: { label: "WalletConnect", name: "WALLET_CONNECT" },
};

export const networks = {
    1: "Main",
    3: "Ropsten",
};
