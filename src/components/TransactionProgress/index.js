import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import { Box, LinearProgress, Typography } from "@material-ui/core";

import Spinner from 'components/common/Spinner';
import { ReactComponent as FailureIcon } from "styles/icons/failure.svg";
import { ReactComponent as SuccessIcon } from "styles/icons/success.svg";
import { ReactComponent as CloseIcon } from "styles/icons/close.svg";

import { timestampToDateTime } from "utilities";

import config from "config/vars";
import './style.css'

const useStyles = makeStyles(() => ({
    notificationContainer: {
        display: "flex",
        position: "relative",
        borderRadius: 4,
        padding: 0,
    },
    notificationSuccessContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#30B651",
        color: "#FFFFFF",
        borderRadius: 4,
        padding: 0,
    },
    notificationFailureContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EF392F",
        color: "#FFFFFF",
        borderRadius: 4,
        padding: 0,
    },
    transactionPendingNumber: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        color: "#000",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "14px",
        width: "100%",
        textTransform: "capitalize",
        fontWeight: 500,
    },
    table: {
        minWidth: 650,
    },
    txWrapper: {
        display: "flex",
        flexDirection: "row",
        position: 'relative',
    },
    status: {
        width: "25px",
        marginRight: '10px',
    },
}));

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        borderRadius: 3,
    },
    colorPrimary: {
        backgroundColor:
            theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    bar: {
        borderRadius: 3,
        background: "#1a90ff",
    },
}))(LinearProgress);

const StyledMenu = withStyles((theme) => ({
    paper: {
        overflowX: "unset",
        overflowY: "unset",
        zIndex: 9999,
        backgroundColor: "#FFFFFF",
        borderRadius: "2px",
        height: "400px",
        border: "1px solid #E1E1E1",
        marginTop: "7px",
        padding: "10px 15px",
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
}))((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            background: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);


const TransactionProgress = ({ progress, transactions, openNotification, clearTransactions }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const hasError = transactions.some((obj)=> obj.status === "failed")
    const hasPending = transactions.some((obj)=> obj.status === "pending")

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const pendingTransactions = transactions?.filter((obj)=>{
        return obj.status === "pending"
    })

    return (
        transactions?.length > 0 &&
        <Box
            className={
                hasPending
                    ? classes.notificationContainer
                    : hasError
                    ? classes.notificationFailureContainer
                    : classes.notificationSuccessContainer
            }
        >
            {
                !hasPending && !hasError &&
                <Button
                    className="success-button"
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={{ padding: 0, margin: "0 8px" }}

                >
                    <Typography><CheckIcon/></Typography>
                </Button>
            }

            {
                !hasPending && hasError  &&
                <Button
                    className="error-button"
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={{ padding: 0, margin: "0 8px" }}
                >
                    <Typography><CloseIcon/></Typography>
                </Button>
            }

            {
                hasPending &&
                <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={{ padding: 0, margin: "0 8px" }}
                >
                    <BorderLinearProgress
                        variant="determinate"
                        value={progress}
                    />
                    {pendingTransactions?.length > 0 && (
                        <Typography
                            className={classes.transactionPendingNumber}
                            style={{
                                backgroundImage: `linear-gradient(to right, white ${progress}%, black ${progress}% 100%)`,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                color: "transparent",
                            }}
                        >
                            {`${pendingTransactions.length} Pending${pendingTransactions.length > 1 ? "s" : ''}`}
                        </Typography>
                    )}
                </Button>
            }
            {!openNotification && (
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {
                        <StyledMenuItem>
                            <TableContainer component={Paper}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>Transaction History</h5>
                                    <a href="#" onClick={clearTransactions}>Clear</a>
                                </div>

                                <Table
                                    className={classes.table}
                                    aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Status / Hash</TableCell>
                                            <TableCell align="left">Type</TableCell>
                                            <TableCell align="left">Date & Time</TableCell>
                                            <TableCell align="left">Gas</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactions.map((row) => (
                                            <TableRow key={row.txHash}>
                                                <TableCell align="left">
                                                    <div className={classes.txWrapper}>
                                                        {row.status === "failed" && (
                                                            <FailureIcon className={classes.status} />
                                                        )}
                                                        {row.status === "success" && (
                                                            <SuccessIcon className={classes.status} />
                                                        )}
                                                        {row.status === "pending" && (
                                                            <span className={classes.status}>
                                                        <Spinner />
                                                    </span>
                                                        )}
                                                        {row.txHash?.length === 66 && (
                                                            <a href={`${config.etherScanUrl}/tx/${row.txHash}`} target="_blank">
                                                                {`${row.txHash.slice(0, 12)}...${row.txHash.slice(56)}`}
                                                            </a>
                                                        )}

                                                    </div>
                                                </TableCell>
                                                <TableCell align="left">{row.type}</TableCell>
                                                <TableCell align="left">{timestampToDateTime(row.timestamp)}</TableCell>
                                                <TableCell align="left">{row.gas}</TableCell>
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </StyledMenuItem>
                    }
                </StyledMenu>
            )}
        </Box>
    );
};

export default TransactionProgress;
