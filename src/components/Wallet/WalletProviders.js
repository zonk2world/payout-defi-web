import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import { useWeb3React } from "@web3-react/core";
import { CircularProgress } from "@material-ui/core";

import hacken_img from "../../styles/img/haken.png";
import browser_wallet_img from "../../styles/img/wallets/browser_wallet.png";
import portis_wallet_img from "../../styles/img/wallets/portis_wallet.png";
import ledger_wallet_img from "../../styles/img/wallets/ledger_wallet.png";
import mew_wallet_img from "../../styles/img/wallets/mew_wallet.png";
import coinbase_wallet_img from "../../styles/img/wallets/coinbase_wallet.png";
import auth_wallet_img from "../../styles/img/wallets/auth_wallet.png";
import connect_wallet_img from "../../styles/img/wallets/connect_wallet.png";
import torus_wallet_img from "../../styles/img/wallets/torus_wallet.png";
import fort_wallet_img from "../../styles/img/wallets/fort_wallet.png";

import Store from "../../stores/store";
import { CONNECTION_DISCONNECTED } from "../../config/constants";

const providers = [
    {
        value: "MetaMask",
        name: "Browser wallet",
        image: browser_wallet_img,
        available: true,
    },
    {
        value: "Portis",
        name: "Portis",
        image: portis_wallet_img,
        available: false,
    },
    {
        value: "Ledger",
        name: "Ledger",
        image: ledger_wallet_img,
        available: false,
    },
    {
        value: "MewWallet",
        name: "MEW wallet",
        image: mew_wallet_img,
        available: false,
    },
    {
        value: "Coinbase",
        name: "Coinbase",
        image: coinbase_wallet_img,
        available: false,
    },
    {
        value: "Authereum",
        name: "Authereum",
        image: auth_wallet_img,
        available: false,
    },
    {
        value: "WalletConnect",
        name: "WalletConnect",
        image: connect_wallet_img,
        available: true,
    },
    {
        value: "Torus",
        name: "Torus",
        image: torus_wallet_img,
        available: false,
    },
    {
        value: "Fortmatic",
        name: "Fortmatic",
        image: fort_wallet_img,
        available: false,
    },
];

const emitter = Store.emitter;
const store = Store.store;

const styles = (theme) => ({
    cardContainer: {
        marginTop: "60px",
        minHeight: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    unlockCard: {
        padding: "24px",
    },
    buttonText: {
        marginLeft: "12px",
        fontWeight: "700",
    },
    instruction: {
        maxWidth: "400px",
        marginBottom: "32px",
        marginTop: "32px",
    },
    actionButton: {
        padding: "12px",
        backgroundColor: "white",
        borderRadius: "3rem",
        border: "1px solid #E1E1E1",
        fontWeight: 500,
        [theme.breakpoints.up("md")]: {
            padding: "15px",
        },
    },
    connect: {
        width: "100%",
    },
});

function onConnectionClicked(
    currentConnector,
    name,
    setActivatingConnector,
    activate
) {
    const connectorsByName = store.getStore("connectorsByName");
    setActivatingConnector(currentConnector);
    activate(connectorsByName[name]);
    localStorage.setItem("web3Connector", name);
}

function onDeactivateClicked(
    deactivate,
    connector,
    localConnector,
    setActivatingConnector
) {
    if (deactivate) {
        deactivate();
    }
    if (localConnector && localConnector.handleClose) {
        localConnector.handleClose();
    }
    if (localConnector && localConnector.close) {
        localConnector.close();
    }
    if (connector && connector.handleClose) {
        connector.handleClose();
    }
    if (connector && connector.close) {
        connector.close();
    }
    if (localConnector && localConnector.killSession) {
        localConnector.killSession();
    }
    if (connector && connector.killSession) {
        connector.killSession();
    }
    store.setStore({ account: {}, web3context: null });
    setActivatingConnector(undefined);
    emitter.emit(CONNECTION_DISCONNECTED);
    localStorage.setItem("web3Connector", null);
}

function WalletProviders() {
    const [activatingConnector, setActivatingConnector] = useState();
    const context = useWeb3React();
    const localContext = store.getStore("web3context");
    const connectorsByName = store.getStore("connectorsByName");

    let localConnector = null;

    if (localContext) {
        localConnector = localContext.connector;
    }
    const { connector, activate, deactivate, error } = context;

    const handleActiveConnection = (name) => {
        const currentConnector = connectorsByName[name];
        if (
            currentConnector === connector ||
            currentConnector === localConnector
        ) {
            console.log(">>>>>>>>>>>>> Deactivate Connector <<<<<<<<<<<<<<<");
            onDeactivateClicked(
                deactivate,
                connector,
                localConnector,
                setActivatingConnector
            );
        } else {
            console.log(">>>>>>>>>>>>> Activate Connector <<<<<<<<<<<<<<<");
            onConnectionClicked(
                currentConnector,
                name,
                setActivatingConnector,
                activate
            );
        }
    };

    const isActivating = (name) => {
        if (connectorsByName[name]) {
            return connectorsByName[name] === activatingConnector;
        }

        return false;
    };

    const isConnected = (name) => {
        if (connectorsByName[name]) {
            return (
                connectorsByName[name] === connector ||
                connectorsByName[name] === localConnector
            );
        }
        return false;
    };

    const isDisabled = (name) => {
        if (connectorsByName[name]) {
            return (
                activatingConnector === connectorsByName[name] ||
                activatingConnector === localConnector
            );
        }
        return true;
    };

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    const width = window.innerWidth;

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: width > 650 ? "space-between" : "center",
                alignItems: "center",
            }}
        >
            <div className="card border-0 w-100 mt-2">
                <div key="header" className="card_header">
                    <div className="row">
                        <div className="col-xl-6 text-left justify-content-left">
                            <div className="col-xl-12 text-left justify-content-left">
                                <span className="title-welcome">
                                    Welcome to PopDefi
                                </span>
                            </div>
                            <div className="col-xl-12 text-left justify-content-left">
                                Connect your wallet and jump into Defi
                            </div>
                        </div>
                        <div className="d-flex flex-row col-xl-6 text-right justify-content-end">
                            <div className="d-flex flex-column text-right justify-content-center mr-3">
                                <span>Being audited by</span>
                                <b>Hacken</b>
                            </div>
                            <img src={hacken_img} />
                        </div>
                    </div>
                </div>
                <div key="body" className="card-body p-10">
                    <div className="row wallet-row">
                        {providers.map((provider) => (
                            <div
                                key={provider.value}
                                className="col-xl-4 wallet-col"
                                onClick={() =>
                                    !isDisabled(provider.value)
                                        ? handleActiveConnection(provider.value)
                                        : {}
                                }
                                style={{
                                    opacity: provider.available ? 1 : 0.5,
                                }}
                            >
                                <div className="wallet-card d-flex flex-row justify-content-start">
                                    <div className="d-flex flex-row justify-content-start align-items-center">
                                        <span>{provider.name}</span>
                                        {isActivating(provider.value) && (
                                            <CircularProgress
                                                size={15}
                                                style={{ marginLeft: "10px" }}
                                            />
                                        )}
                                        {!isActivating(provider.value) &&
                                        isConnected(provider.value) && (
                                            <div
                                                style={{
                                                    background: "#4caf50",
                                                    borderRadius: "10px",
                                                    width: "10px",
                                                    height: "10px",
                                                    marginLeft: "10px",
                                                }}
                                            />
                                        )}
                                    </div>
                                    <img alt="Provider" src={provider.image} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row wallet-row">
                        <div className="wallet-col col-xl-12">
                            <div className="link-card d-flex flex-row justify-content-center">
                                <Link
                                    className="wallet-dash-link"
                                    to={"/dashboard"}
                                >
                                    or continue without wallet -&gt;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div key="footer" className="card-footer p-10">
                    <div className="row d-flex justify-content-center w-100 align-content-center">
                        <div className="col-xl-12 text-center justify-content-center mx-auto">
                            By unlocking Your wallet You agree to our{" "}
                            <a className="wallet-dash-link" href="#">
                                Terms of Service
                            </a>
                            ,{" "}
                            <a className="wallet-dash-link" href="#">
                                Privacy
                            </a>{" "}
                            and{" "}
                            <a className="wallet-dash-link" href="#">
                                Cookie Policy
                            </a>
                        </div>
                        <div className="col-xl-9 text-center justify-content-center mx-auto mt-2 mb-4">
                            <b>Disclaimer</b>: Wallets are provided by External
                            Providers and by selecting you agree to Terms of
                            those Providers. Your access to the wallet might be
                            reliant on the External Provider being operational.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withStyles(styles)(WalletProviders);
