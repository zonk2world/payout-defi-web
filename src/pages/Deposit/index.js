import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConnectWalletButton from "../../components/Wallet/ConnectWalletButton";
import { beautyNumber, tokenSymbol } from "../../utilities";
import Store from "../../stores/store";
import assetService from "../../services/api/asset";
import searchImg from "../../styles/img/search.png";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { TableFooter } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#E9F2FF"
    },
    body: {
        fontSize: 14,
    }
}))(TableCell);

const emitter = Store.emitter;
const store = Store.store;
const dispatcher = Store.dispatcher;

function createData(assets, wallet_balance, deposited, apy,reserve_address) {
    return {
        assets, wallet_balance, deposited, apy, reserve_address,
        row_inner_values:
            {
                apy: apy
            }
    };
}

function Row(props) {
    const market = props.row;
    const currencyType = props.currencyType;
    const account = props.account;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow className={ market.assets.isReserveEnabled ? "blue-border" : ""}>
                <TableCell scope="row">
                    <img
                        className="iconImg mr-2"
                        src={tokenSymbol(
                            market.assets.symbol
                        )}
                        alt="Assets"
                    />
                    {
                        market.assets.name
                    }
                </TableCell>
                <TableCell>
                    {
                        market.wallet_balance.walletBalance.toFixed(0) === 0 ? "--" : ((currencyType === 1 ? "$ " : "") + beautyNumber(market.wallet_balance.walletBalance * (market.wallet_balance.assetsPrice ** currencyType)))
                    }
                </TableCell>
                <TableCell>
                    {
                        market.deposited === 0 ? "--" : ((currencyType === 1 ? "$ " : "") + beautyNumber(market.deposited * (market.wallet_balance.assetsPrice ** currencyType)))
                    }
                </TableCell>
                <TableCell className="web-hide" >
                    <IconButton aria-label="expand row" size="small" className="p-0"
                                onClick={() => setOpen(!open)} style={{ outline: 'none'}}>
                        {open ? <KeyboardArrowUpIcon fontSize="large"  /> :
                            <KeyboardArrowDownIcon fontSize="large"   />}
                    </IconButton>
                </TableCell>
                <TableCell className="mobile-hide">
                    {market.apy === 0 ? "--" : market.apy + "%"}
                </TableCell>

                <TableCell className="mobile-hide">
                    <Link
                        to={`/depositDetail/${market.reserve_address}`}
                        className="btn btn-light"
                    >
                        Details
                    </Link>
                </TableCell>
            </TableRow>
            <TableRow className="web-hide">
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table className="border-none" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>APY</TableCell><TableCell> {market.apy === 0 ? "--" : market.apy + "%"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <Box className="d-flex justify-content-between">
                                                <Link
                                                    to={`/depositDetail/${market.reserve_address}`}
                                                    className="btn btn-light"
                                                >
                                                    Details
                                                </Link>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


const Deposit = () => {
    const [account, setAccount] = useState(store.getStore("account"));
    const [assets, setAssets] = useState(store.getStore("assets"));
    const [currencyType, setCurrencyType] = useState(1);

    let rows = [];
    {
        assets.filter(asset => asset.isActive).map(
            (value, index) => {
                rows.push(createData({
                    symbol: value.symbol,
                    name: value.name,
                    isReserveEnabled: value.isReserveEnabled
                }, {
                    walletBalance: Number(value.walletBalance),
                    assetsPrice: value.assetsPrice
                }, value.depositBalance, value.liquidityRate, value.reserveAddress));
            });
    }

    const storeUpdated = () => {
        const _assets = store.getStore("assets");
        const _account = store.getStore("account");
        if (_assets.length > 0) {
            setAssets([..._assets]);
        }

        setAccount(_account);
    };

    const filterAssets = (event) => {
        const _assets = store.getStore("assets");
        const filteredAssets = _assets.filter((asset) => {
            return asset.name.toUpperCase().includes((event.target.value).toUpperCase());
        });

        setAssets(filteredAssets);
    };

    const changeCurrencyType = (val) => {
        setCurrencyType(val);
    };

    const getReserves = () => {
        assetService.getReserveData().then(data => {
            setAssets(data);
        });
    };

    useEffect(() => {
        emitter.on("StoreUpdated", storeUpdated);
        if (assets.length === 0) {
            getReserves();
        }

        return () => {
            emitter.removeListener("StoreUpdated", storeUpdated);
        };
    }, []);

    return (
        <>
            {account.address ? (
                <div
                    id="content-wrapper"
                    className="d-flex flex-column main-margntop home-margintop"
                >
                    <div className="col-12">
                        <div className="container-fluid px-0">
                            <div className="row deposit-section">
                                <div
                                    className="col-xl-12 pl-md-4 pr-md-4 pt-4 p-0 mb-4 align-items-center d-flex flex-row justify-content-start date-selector">
                                    <div className="card border-0 w-100">
                                        <div className="card-header bg-transparent">
                                            <h4 className="card-title">
                                                Deposit
                                            </h4>
                                            <div className="aramaKutusu mobile-search">
                                                <input
                                                    type="text"
                                                    placeholder="Type to search..."
                                                    onChange={(e) => {
                                                        filterAssets(e);
                                                    }}
                                                />
                                                <a href="#" target="_blank">
                                                    <img
                                                        src={searchImg}
                                                        alt=""
                                                    />
                                                </a>
                                            </div>
                                            <ul className="justify-content-end">
                                                <li className={currencyType === 1 ? "active" : "deactive"}
                                                    onClick={() => changeCurrencyType(1)}>
                                                    <a>Stable</a>
                                                </li>
                                                <li className={currencyType === 0 ? "active" : "deactive"}
                                                    onClick={() => changeCurrencyType(0)}>
                                                    <a>Native</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="card-body p-0 mobile-scroll">
                                            <div component={Paper}>
                                                <Table className="border-none" aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow >
                                                            <StyledTableCell>Assets</StyledTableCell>
                                                            <StyledTableCell>Wallet Balance</StyledTableCell>
                                                            <StyledTableCell>Deposited</StyledTableCell>
                                                            <StyledTableCell className="web-hide" />
                                                            <StyledTableCell className="mobile-hide">APY</StyledTableCell>
                                                            <StyledTableCell className="mobile-hide" />
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {rows.map((row,index) => (
                                                            <Row row={row} currencyType={currencyType} account = {account} key={index+1}/>
                                                        ))}

                                                    </TableBody>
                                                    <TableFooter className="web-hide">
                                                        <TableRow>
                                                            <TableCell colSpan={6}>
                                                                <Box className="d-flex justify-content-between">
                                                                    <Link
                                                                        to=""
                                                                        className="btn btn-light w-100"
                                                                    >
                                                                        View More
                                                                    </Link>

                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <ConnectWalletButton/>
            )}
        </>
    );
};

export default Deposit;
