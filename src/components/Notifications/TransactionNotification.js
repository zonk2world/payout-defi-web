import React from "react";
import { Popper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ReactComponent as FailureIcon } from "styles/icons/failure.svg";
import { ReactComponent as SuccessIcon } from "styles/icons/success.svg";
import { ReactComponent as CloseIcon } from "styles/icons/close.svg";

import config from "config/vars";

const useStyles = makeStyles((theme) => ({
    paper: {
        overflowX: "unset",
        overflowY: "unset",
        zIndex: 9999,
        backgroundColor: "#FFFFFF",
        borderRadius: "2px",
        border: "1px solid #E1E1E1",
        marginTop: "7px",
        padding: "16px 20px",
        "&::before": {
            border: "1px solid #E1E1E1",
            content: '""',
            position: "absolute",
            marginRight: "-0.71em",
            top: -10,
            right: "50%",
            width: 10,
            height: 10,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
            transform: "translate(-50%, 50%) rotate(315deg)",
            clipPath:
                "polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))",
        },
    },
    notificationTitle: {
        marginBottom: "8px",
    },
    notificationBody: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
    },

    notificationContent: {
        display: "flex",
        flexDirection: "column",
        marginLeft: "12px",
        marginRight: "12px",
    },
    notificationStatusIcon: {
        marginTop: 2,
    },
    notificationClose: {
        marginTop: 5,
    },
}));

const TransactionNotification = ({
    open,
    anchorEl,
    success,
    transaction,
    handleClose
}) => {
    const classes = useStyles();

    return (
        <Popper
            className={classes.paper}
            placement="bottom"
            open={open}
            anchorEl={anchorEl}
            disablePortal={false}
        >
            <div className={classes.notificationBody}>
                {success ? (
                    <>
                        <SuccessIcon className={classes.notificationStatusIcon} />
                        <div className={classes.notificationContent}>
                            <Typography>Approve PPT</Typography>
                            <a href={`${config.etherScanUrl}/tx/${transaction.txHash}`} target="_blank">
                                View on Etherscan
                            </a>
                        </div>
                        <CloseIcon className={classes.notificationClose} onClick={handleClose} />
                    </>
                ) : (
                    <>
                        <FailureIcon className={classes.notificationStatusIcon} />
                        <div className={classes.notificationContent}>
                            <Typography>Something went wrong...</Typography>
                            <a href={`${config.etherScanUrl}/tx/${transaction.txHash}`} target="_blank">
                                Try Again
                            </a>
                        </div>
                        <CloseIcon className={classes.notificationClose} onClick={handleClose} />
                    </>
                )}
            </div>
        </Popper>
    );
};

export default TransactionNotification;
