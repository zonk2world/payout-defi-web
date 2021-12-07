import { useEffect, useState } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import {
    URI_AVAILABLE,
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from "@web3-react/walletconnect-connector";

import { injected } from "../config/connectors";
import { CONNECTION_CONNECTED, CONNECTION_ERROR } from "../config/constants";
import Store from "../stores/store";
const emitter = Store.emitter;
const store = Store.store;

const connectorsByName = store.getStore("connectorsByName");

export const getErrorMessage = (error) => {
    if (error instanceof NoEthereumProviderError) {
        return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network.";
    } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect
    ) {
        return "Please authorize this website to access your Ethereum account.";
    } else {
        console.error(error);
        return "An unknown error occurred. Check the console for more details.";
    }
}

export function useActiveWeb3React() {
    const contextInternal = useWeb3React()
    const contextNetwork = useWeb3React('NETWORK')
    return contextInternal.active ? contextInternal : contextNetwork
}

export function useEagerConnect() {
    const { activate, active, error }= useWeb3React();
    const [tried, setTried] = useState(false);

    const connectorName = localStorage.getItem("web3Connector");
    const storedConnector = connectorsByName[connectorName];

    useEffect(() => {
        if (connectorName === 'MetaMask') {
            injected.isAuthorized().then((isAuthorized) => {
                if (isAuthorized) {
                    activate(injected, undefined, true).catch(() => {
                        setTried(true);
                    });
                } else {
                    setTried(true);
                }
            });
        } else {
            setTried(true);
        }
    }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
    useEffect(() => {
        if (tried && !active && !error && storedConnector) {
            activate(storedConnector);
        }
    }, [tried, active])
}

export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3React();

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleChainChanged = (chainId) => {
                activate(injected);
            };

            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    activate(injected);
                }
            };

            const handleNetworkChanged = (networkId) => {
                activate(injected);
            };

            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("networkChanged", handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("chainChanged", handleChainChanged);
                    ethereum.removeListener(
                        "accountsChanged",
                        handleAccountsChanged
                    );
                    ethereum.removeListener(
                        "networkChanged",
                        handleNetworkChanged
                    );
                }
            };
        }

        return () => {
        };
    }, [active, error, suppress, activate]);
}

export function useWeb3Listener() {
    const context = useWeb3React();
    const { connector, account, active, library, chainId, error } = context;

    useEffect(() => {
        if (account && active && library) {
            console.log(`[account: ${account}, chainId: ${chainId}]`);
            if (connector.supportedChainIds.indexOf(Number(chainId)) >= 0) {
                store.setStore({
                    account: { address: account },
                    web3context: context
                });
                emitter.emit(CONNECTION_CONNECTED);
            } else {
                emitter.emit(CONNECTION_ERROR, {
                    connector,
                    message: 'You\'re connected to an unsupported network.'
                });
            }
        }
    }, [connector, account, chainId, active, library, context]);

    useEffect(() => {
        if (error) {
            console.log('Connection error................')
            const message = getErrorMessage(error)
            emitter.emit(CONNECTION_ERROR, {
                connector,
                message
            });
        }
    }, [connector, error])

    useEffect(() => {
        if (connector) {
            console.log("[web3 events subscribe].............");
            const handleChainChanged = (chainId) => {
                console.log("chainId:", chainId);
            };
            const handleAccountsChanged = (accounts) => {
                console.log("accounts:", accounts);
            };
            const handleNetworkChanged = (networkId) => {
                console.log("networkId:", networkId);
            };
            const handleWeb3ReactUpdate = (data) => {
                console.log("Web3ReactUpdate:", data, connector.supportedChainIds)
                // check invalid chainId
                if (
                    data.chainId &&
                    connector.supportedChainIds.indexOf(Number(data.chainId)) === -1
                ) {
                    emitter.emit(CONNECTION_ERROR, {
                        connector,
                        message: 'You\'re connected to an unsupported network.'
                    });
                }
            };
            const handleURIChanged = (uri) => {
                console.log("uri available:", uri);
            }
            connector.on("chainChanged", handleChainChanged);
            connector.on("accountsChanged", handleAccountsChanged);
            connector.on("networkChanged", handleNetworkChanged);
            connector.on(URI_AVAILABLE, handleURIChanged);
            return () => {
                console.log("[web3 events unsubscribe].............")
                connector.off("chainChanged", handleChainChanged);
                connector.off("accountsChanged", handleAccountsChanged);
                connector.off("networkChanged", handleNetworkChanged);
                connector.off(URI_AVAILABLE, handleURIChanged);
                //  connector.off("Web3ReactUpdate", handleWeb3ReactUpdate);
            };
        }
    }, [connector]);
}