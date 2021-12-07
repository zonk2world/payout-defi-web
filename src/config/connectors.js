import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { NetworkConnector } from "./NetworkConnector";

import config from "./vars";
// supportedChainIds: [1, 3, 4, 5, 42]
export const injected = new InjectedConnector({
    supportedChainIds: [Number(config.rpcChainId)]
});

// 1: 'https://mainnet.infura.io/v3/79701c57272c4fa8b5684a2db7a8941e',
// 3: 'https://ropsten.infura.io/v3/79701c57272c4fa8b5684a2db7a8941e',
// 4: 'https://rinkeby.infura.io/v3/79701c57272c4fa8b5684a2db7a8941e'

export const walletconnect = new WalletConnectConnector({
    rpc: { [Number(config.rpcChainId)]: config.rpcUrl },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: 1200,
});

export const network = new NetworkConnector({
    urls: { [Number(config.rpcChainId)]: config.rpcUrl },
    defaultChainId: config.rpcChainId,
})