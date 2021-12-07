import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import WalletProviders from "../../components/Wallet/WalletProviders";

import Store from "../../stores/store";
import {
    CONNECTION_CONNECTED,
    CONNECTION_DISCONNECTED,
    ERROR,
} from "../../config/constants";

const emitter = Store.emitter;

const styles = (theme) => ({
    root: {
        flex: 1,
        height: "auto",
        display: "flex",
        position: "relative",
    },
    contentContainer: {
        margin: "auto",
        textAlign: "center",
        padding: "12px",
        display: "flex",
        flexWrap: "wrap",
    },
    closeIcon: {
        position: "absolute",
        right: "0px",
        top: "0px",
        cursor: "pointer",
    },
});

class WalletModalContent extends Component {
    constructor(props) {
        super();

        this.state = {
            error: null,
            metamaskLoading: false,
            ledgerLoading: false,
        };
    }

    componentWillMount() {
        emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
        emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
        emitter.on(ERROR, this.error);
    }

    componentWillUnmount() {
        emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
        emitter.removeListener(
            CONNECTION_DISCONNECTED,
            this.connectionDisconnected
        );
        emitter.removeListener(ERROR, this.error);
    }

    error = (err) => {
        this.setState({
            loading: false,
            error: err,
            metamaskLoading: false,
            ledgerLoading: false,
        });
    };

    connectionConnected = () => {
        if (this.props.closeModal !== null) {
            this.props.closeModal();
        }
    };

    connectionDisconnected = () => {
        if (this.props.closeModal !== null) {
            this.props.closeModal();
        }
    };

    metamaskUnlocked = () => {
        this.setState({ metamaskLoading: false });
        if (this.props.closeModal !== null) {
            this.props.closeModal();
        }
    };

    ledgerUnlocked = () => {
        this.setState({ ledgerLoading: false });
        if (this.props.closeModal !== null) {
            this.props.closeModal();
        }
    };

    cancelLedger = () => {
        this.setState({ ledgerLoading: false });
    };

    cancelMetamask = () => {
        this.setState({ metamaskLoading: false });
    };

    render() {
        const { classes, closeModal } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.closeIcon} onClick={closeModal}>
                    <CloseIcon />
                </div>
                <div className={classes.contentContainer}>
                    <WalletProviders />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(WalletModalContent);
