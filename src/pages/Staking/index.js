import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "config/vars";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    Button,
    InputBase,
    Paper,
    Switch,
    IconButton,
    Collapse,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    useMediaQuery,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import StakingRow from "../../components/Staking/StakingRow";
import ConnectWalletButton from "../../components/Wallet/ConnectWalletButton";
import { stakeImg, tokenSymbol } from "../../utilities";
import searchImg from "../../styles/img/search.png";

import assetService from "../../services/api/asset";

import Store from "../../stores/store";
import {
    rewards,
    rewardsClaim,
    rewardsWithdraw,
    depositPopulousFarm,
    withdrawPopulousFarm
} from "../../stores/action";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: "unset"
        }
    },
    buttonGroup: {
        border: "solid 1px #e0e0e0",
        borderRadius: "4px",
        display: "inline-flex"
    },
    expandedRoot: {
        borderTop: "solid 1px #e0e0e0",
    },
    expandedSubTableCell: {
        paddingTop: "24px",
        paddingBottom: "24px",
    },
    unexpandedSubTableCell: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    subTableHead: {
        backgroundColor: "unset",
    },
    subTableHeadCell: {
        fontWeight: "normal",
        padding: "8px 16px"
    },
    subTableBodyCell: {
        fontWeight: "bold",
        padding: "8px 16px",
        fontSize: "18px"
    },
    subTableBodyLastCell: {
        fontWeight: "bold",
        padding: "8px 16px",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    tableCellInput: {
        width: "75px",
        minWidth: "75px",
        fontSize: "13px",
        lineHeight: "13px",
        fontWeight: "normal",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderRight: "solid 1px #e0e0e0"
    },
    tableCellInputButton: {
        width: "75px",
        minWidth: "75px",
        fontSize: "13px",
        lineHeight: "13px",
        fontWeight: "normal",
        paddingLeft: "16px",
        paddingRight: "16px"
    },
    buyActionButtons: {
        backgroundColor: "#0782FF",
        color: "#FFFFFF",
        marginLeft: "32px",
        textTransform: "none",
        height: "32px",
        fontWeight: "normal",
        fontSize: "13px",
        lineHeight: "13px"
    },
    mobileActionButtons: {
        backgroundColor: "#0782FF",
        color: "#FFFFFF",
        marginTop: "4px",
        marginLeft: "16px",
        textTransform: "none",
        height: "32px",
        width: "200%",
        fontWeight: "normal",
        fontSize: "13px",
        lineHeight: "13px"
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#E9F2FF"
    },
    body: {
        fontSize: 14,
    }
}))(TableCell);

const AntSwitch = withStyles((theme) => ({
    root: {
        width: 40,
        height: 20,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(18px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    thumb: {
        width: 16,
        height: 16,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 20 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

const emitter = Store.emitter;
const store = Store.store;
const dispatcher = Store.dispatcher;

const zeroAddress = "0x0000000000000000000000000000000000000000";

const apyToString = (_apy) => {
    if (_apy) {
        return Number.isFinite(Number(_apy))? Number(_apy) + '%' : '--';
    } else {
        return '--';
    }
};
const Row = ({ asset, assetIndex, stakedOnly, makeStake, makeClaim, makeWithdraw }) => {
    const [open, setOpen] = useState(false);
    const [stakeAmount, setStakeAmount] = useState('')
    const classes = useStyles();
    const matches = useMediaQuery("(max-width: 767px)");

    return (
        <>
            <TableRow className={asset.isReserveEnabled ? "blue-border" : classes.root}>
                <TableCell scope="row">
                    <img
                        className="iconImg mr-2"
                        src={stakeImg(asset.symbol)}
                        alt="Assets"
                    />
                    p{asset.symbol}
                </TableCell>
                <TableCell>
                    --
                </TableCell>
                <TableCell>
                    {apyToString(asset.APY)}
                </TableCell>
                <TableCell className="mobile-hide">
                    p{asset.symbol}
                </TableCell>
                <TableCell className="mobile-hide">
                    {stakedOnly ? 'PXT' : '--'}
                </TableCell>
                <TableCell className="mobile-hide">
                    0%
                </TableCell>
                <TableCell>
                    <div className="d-flex align-items-center float-right">
                        <span className="mobile-hide">Details</span>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            className="p-0"
                            onClick={() => setOpen(!open)}
                            style={{ outline: 'none' }}
                        >
                            {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </IconButton>
                    </div>
                </TableCell>
            </TableRow>
            <TableRow className={open ? classes.expandedRoot : ""}>
                <TableCell className={open ? classes.expandedSubTableCell : classes.unexpandedSubTableCell} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {matches ? (
                            <Table className="border-none" aria-label="purchases">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Earned</TableCell>
                                        <TableCell className="text-right">{stakedOnly ? "PXT" : "--"}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Deposit</TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/depositDetail/${asset.reserveAddress}`}>p{asset.symbol}</Link>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Value</TableCell>
                                        <TableCell className="text-right">
                                            {asset.totalDeposit || 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>My Staked Value</TableCell>
                                        <TableCell className="text-right">
                                            {asset.youStaked || 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border-none">
                                            {stakedOnly ? "PXT" : "--"} earned
                                        </TableCell>
                                        <TableCell className="border-none text-right">
                                            <div className={classes.buttonGroup}>
                                                <Paper className={classes.tableCellInput}>
                                                    <InputBase
                                                        type="number"
                                                        placeholder="0"
                                                        value={stakeAmount}
                                                        onChange={(e) => setStakeAmount(e.target.value)}
                                                    />
                                                </Paper>
                                                <Button
                                                    color="primary"
                                                    disabled={Number(stakeAmount) <= 0}
                                                    className={classes.tableCellInputButton}
                                                    onClick={() => makeStake(stakeAmount, assetIndex)}
                                                >
                                                    Stake
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <Button
                                            variant="contained"
                                            className={classes.mobileActionButtons}
                                            onClick={() => makeClaim(assetIndex)}
                                        >
                                            Claim / Harvest
                                        </Button>
                                    </TableRow>
                                    <TableRow>
                                        <Button
                                            variant="contained"
                                            className={classes.mobileActionButtons}
                                            onClick={() => makeWithdraw(assetIndex)}
                                        >
                                            Withdraw All
                                        </Button>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : (
                            <Table className="border-none" aria-label="purchases">
                                <TableHead className={classes.subTableHead}>
                                    <TableRow>
                                        <TableCell className={classes.subTableHeadCell}>Deposit</TableCell>
                                        <TableCell className={classes.subTableHeadCell}>Total Value</TableCell>
                                        <TableCell className={classes.subTableHeadCell}>My Staked Value</TableCell>
                                        <TableCell className={classes.subTableHeadCell}>{stakedOnly ? "PXT" : "--"} Earned</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className={classes.subTableBodyCell}>
                                            <Link to={`/depositDetail/${asset.reserveAddress}`}>p{asset.symbol}</Link>
                                        </TableCell>
                                        <TableCell className={classes.subTableBodyCell}>{asset.totalDeposit || 0}</TableCell>
                                        <TableCell className={classes.subTableBodyCell}>{asset.youStaked || 0}</TableCell>
                                        <TableCell className={classes.subTableBodyLastCell}>
                                            {stakedOnly ? (
                                                <Fragment>
                                                    <div style={{ display: "inline-block" }}>{asset.earned || 0}</div>

                                                    <div>
                                                        <div className={classes.buttonGroup}>
                                                            <Paper className={classes.tableCellInput}>
                                                                <InputBase
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={stakeAmount}
                                                                    onChange={(e) => setStakeAmount(e.target.value)}
                                                                />
                                                            </Paper>
                                                            <Button
                                                                color="primary"
                                                                disabled={Number(stakeAmount) <= 0}
                                                                className={classes.tableCellInputButton}
                                                                onClick={() => makeStake(stakeAmount, assetIndex)}
                                                            >
                                                                Stake
                                                            </Button>
                                                        </div>

                                                        <Button
                                                            variant="contained"
                                                            className={classes.buyActionButtons}
                                                            onClick={() => makeClaim(assetIndex)}
                                                        >
                                                            Claim / Harvest
                                                        </Button>

                                                        <Button
                                                            variant="contained"
                                                            className={classes.buyActionButtons}
                                                            onClick={() => makeWithdraw(assetIndex)}
                                                        >
                                                            Withdraw All
                                                        </Button>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div style={{ display: "inline-block", marginRight: "80px" }}>0</div>

                                                    <Button variant="contained" className={classes.buyActionButtons}>
                                                        Approve Contract
                                                    </Button>
                                                </Fragment>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};


const TopRow = ({ earned, rewardPool, totalDeposit, youStakedValue, APY, makeStake, makeClaim, makeWithdraw }) => {
    const [open, setOpen] = useState(false)
    const [stakeAmount, setStakeAmount] = useState('')
    const classes = useStyles();
    const matches = useMediaQuery("(max-width: 767px)");
    const deposit = Number(totalDeposit).toFixed(2)
    console.log("the reward pool is: ", rewardPool)
    return (
        <>
            <TableRow className={classes.root}>
                <TableCell scope="row">
                    <img
                        className="iconImg mr-2"
                        src={tokenSymbol(rewardPool === config.pxtRewardPoolAddress ? 'PXT' : rewardPool === config.pptOldRewardPoolAddress ? 'PPT v1 (OLD)' : 'PPT')}
                        alt="Assets"
                    />
                    {rewardPool == config.pxtRewardPoolAddress && 'PXT'}
                    {rewardPool == config.pptRewardPoolAddress && 'PPT'}
                    {rewardPool === config.pptOldRewardPoolAddress && 'PPT v1 (OLD)'}
                </TableCell>
                <TableCell>
                    --
                </TableCell>
                <TableCell>
                    {apyToString(APY)}
                </TableCell>
                <TableCell className="mobile-hide">
                    {rewardPool === config.pxtRewardPoolAddress && 'PXT'}
                    {rewardPool === config.pptRewardPoolAddress && 'PPT'}
                    {rewardPool === config.pptOldRewardPoolAddress && 'PPT v1 (OLD)'}
                </TableCell>
                <TableCell className="mobile-hide">
                    PXT
                </TableCell>
                <TableCell className="mobile-hide">
                    0%
                </TableCell>
                <TableCell>
                    <div className="d-flex align-items-center float-right">
                        <span className="mobile-hide">Details</span>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            className="p-0"
                            onClick={() => setOpen(!open)}
                            style={{ outline: 'none' }}
                        >
                            {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </IconButton>
                    </div>
                </TableCell>
            </TableRow>
            <TableRow className={open ? classes.expandedRoot : ""}>
                <TableCell className={open ? classes.expandedSubTableCell : classes.unexpandedSubTableCell} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {matches ? (
                            <Table className="border-none" aria-label="purchases">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Earn</TableCell>
                                        <TableCell className="text-right">PXT</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Deposit</TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/depositDetail/${rewardPool}`}>
                                                {rewardPool === config.pxtRewardPoolAddress && 'PXT'}
                                                {rewardPool === config.pptRewardPoolAddress && 'PPT'}
                                                {rewardPool === config.pptOldRewardPoolAddress && 'PPT Old'}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Value</TableCell>
                                        <TableCell className="text-right">
                                            {deposit || 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>My Staked Value</TableCell>
                                        <TableCell className="text-right">
                                            {youStakedValue || 0}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border-none">
                                            Earned
                                        </TableCell>
                                        <TableCell className="border-none text-right">
                                            <div className={classes.buttonGroup}>
                                                <Paper className={classes.tableCellInput}>
                                                    <InputBase
                                                        type="number"
                                                        placeholder="0"
                                                        value={stakeAmount}
                                                        onChange={(e) => setStakeAmount(e.target.value)}
                                                    />
                                                </Paper>
                                                <Button
                                                    color="primary"
                                                    disabled={Number(stakeAmount) <= 0 || rewardPool === config.pptOldRewardPoolAddress}
                                                    className={classes.tableCellInputButton}
                                                    onClick={() => makeStake(stakeAmount, rewardPool)}
                                                >
                                                    Stake
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <Button
                                            variant="contained"
                                            className={classes.mobileActionButtons}
                                            onClick={() => makeClaim(rewardPool)}
                                        >
                                            Claim / Harvest
                                        </Button>
                                    </TableRow>
                                    <TableRow>
                                        <Button
                                            variant="contained"
                                            className={classes.mobileActionButtons}
                                            onClick={() => makeWithdraw(stakeAmount, rewardPool)}
                                            disabled={Number(stakeAmount) <= 0}
                                        >
                                            Withdraw
                                        </Button>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : (
                            <Table className="border-none" aria-label="purchases">
                                <TableHead className={classes.subTableHead}>
                                    <TableRow>
                                        <TableCell className={classes.subTableHeadCell}>Deposit</TableCell>
                                        <TableCell className={classes.subTableHeadCell}>Total Value</TableCell>
                                        <TableCell className={classes.subTableHeadCell}>My Staked Value</TableCell>
                                        <TableCell className={classes.subTableHeadCell}>Earned</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className={classes.subTableBodyCell}>
                                            <a href={rewardPool === config.pxtRewardPoolAddress ? 'https://exchange.populous.world/gb/exchange/?market=PXT_USDT' : 'https://exchange.populous.world/gb/exchange/?market=PPT_ETH'}>
                                                {rewardPool === config.pxtRewardPoolAddress && 'PXT'}
                                                {rewardPool === config.pptRewardPoolAddress && 'PPT'}
                                                {rewardPool === config.pptOldRewardPoolAddress && 'PPT v1 (OLD)'}
                                            </a>
                                        </TableCell>
                                        <TableCell className={classes.subTableBodyCell}>{deposit || 0}</TableCell>
                                        <TableCell className={classes.subTableBodyCell}>{youStakedValue || 0}</TableCell>
                                        <TableCell className={classes.subTableBodyLastCell}>
                                            <Fragment>
                                                <div style={{ display: "inline-block" }}>{earned || 0}</div>

                                                <div>
                                                    <div className={classes.buttonGroup}>
                                                        <Paper className={classes.tableCellInput}>
                                                            <InputBase
                                                                type="number"
                                                                placeholder="0"
                                                                value={stakeAmount}
                                                                onChange={(e) => setStakeAmount(e.target.value)}
                                                            />
                                                        </Paper>
                                                        <Button
                                                            color="primary"
                                                            disabled={Number(stakeAmount) < 0 || rewardPool === config.pptOldRewardPoolAddress}
                                                            className={classes.tableCellInputButton}
                                                            onClick={() => makeStake(stakeAmount, rewardPool)}
                                                        >
                                                            Stake
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="contained"
                                                        className={classes.buyActionButtons}
                                                        onClick={() => makeClaim(rewardPool)}
                                                    >
                                                        Claim / Harvest
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        className={classes.buyActionButtons}
                                                        disabled={Number(stakeAmount) <= 0}
                                                        onClick={() => makeWithdraw(stakeAmount, rewardPool)}
                                                    >
                                                        Withdraw
                                                    </Button>
                                                </div>
                                            </Fragment>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

const Rewards = () => {
    const [account, setAccount] = useState(store.getStore("account"));
    const [assets, setAssets] = useState(store.getStore("assets"));
    const [additionalRewards, setAdditionalRewards] = useState([]);
    const [populousFarms, setPopulousFarms] = useState([]);
    const [stakedOnly, setStakedOnly] = useState(false);

    const storeUpdated = useCallback(() => {
        const _assets = store.getStore("assets");
        const _account = store.getStore("account");
        const additionalRewardPools = store.getStore("additionalRewardPools");
        const populousFarmPools = store.getStore("populousFarmPools");

        if (_assets.length > 0) {
            setAssets([
                ..._assets.filter(
                    (asset) => !stakedOnly || (asset.isActive && asset.rewardPoolAddress !== zeroAddress)
                ),
            ]);
        }

        setAccount(_account);
        setAdditionalRewards(additionalRewardPools);
        setPopulousFarms(populousFarmPools);
    }, [stakedOnly]);

    const filterAssets = (event) => {
        const _assets = store.getStore("assets");
        const filteredAssets = _assets
            .filter(asset => (asset.isActive && asset.rewardPoolAddress !== zeroAddress))
            .filter((asset) => {
                return asset.name.toUpperCase().includes((event.target.value).toUpperCase());
            });

        setAssets(filteredAssets);
    };

    const getReserves = useCallback(() => {
        assetService.getReserveDataAndPools().then((data) => {
            setAssets(data.reserves?.filter(
                    (asset) => !stakedOnly || (asset.isActive && asset.rewardPoolAddress !== zeroAddress)
                ) || [],
            );
            setPopulousFarms(data.populousFarmPools || []);
        });
    }, [stakedOnly]);

    const makeStake = (stakeAmount, selectedAssetNo) => {
        dispatcher.dispatch(
            rewards({
                reserve: assets[selectedAssetNo].reserveAddress,
                ptoken: assets[selectedAssetNo].PTokenAddress,
                rewardPool: assets[selectedAssetNo].rewardPoolAddress,
                amount: stakeAmount,
                decimals: assets[selectedAssetNo].decimals,
            })
        );
    };

    const makeTopStake = (stakeAmount, rewardPool) => {
        let ptoken = null
        if (rewardPool === config.pptRewardPoolAddress) {
            ptoken = config.pptRewardPoolPToken
        } else if (rewardPool === config.pxtRewardPoolAddress) {
            ptoken = config.pxtRewardPoolPToken
        } else if (rewardPool === config.pptOldRewardPoolAddress) {
            ptoken = config.pptOldRewardPoolPToken
        }
        let decimals = additionalRewards.filter(re => re.rewardPool === rewardPool)[0]?.decimals || 0;

        dispatcher.dispatch(
            rewards({
                reserve: null,
                ptoken,
                rewardPool,
                amount: stakeAmount,
                decimals: decimals,
            })
        );
    }

    const makeWithdraw = (selectedAssetNo) => {
        dispatcher.dispatch(
            rewardsWithdraw({
                reserve: assets[selectedAssetNo].reserveAddress,
                rewardPool: assets[selectedAssetNo].rewardPoolAddress,
                amount: assets[selectedAssetNo].rewardDeposited,
                decimals: assets[selectedAssetNo].decimals,
            })
        );
    };

    const makeTopWithdraw = (amount, rewardPool) => {
        let decimals = additionalRewards.filter(re => re.rewardPool === rewardPool)[0]?.decimals || 0;
        dispatcher.dispatch(
            rewardsWithdraw({
                reserve: null,
                rewardPool,
                amount: amount,
                decimals: decimals,
            })
        );
    }

    const makeClaim = (selectedAssetNo) => {
        dispatcher.dispatch(
            rewardsClaim({
                reserve: assets[selectedAssetNo].reserveAddress,
                rewardPool: assets[selectedAssetNo].rewardPoolAddress,
                decimals: assets[selectedAssetNo].decimals,
            })
        );
    };

    const makeTopClaim = (rewardPool) => {
        dispatcher.dispatch(
            rewardsClaim({
                reserve: null,
                rewardPool,
                decimals: 0,
            })
        );
    }

    const makePopulousFarmDeposit = (amount, pool) => {
        dispatcher.dispatch(
            depositPopulousFarm({
                pid: pool.pid,
                lpToken: pool.lpToken,
                amount: amount,
                decimals: pool.decimals
            })
        );
    }
    const makePopulousFarmWithdraw = (amount, pool) => {
        dispatcher.dispatch(
            withdrawPopulousFarm({
                pid: pool.pid,
                lpToken: pool.lpToken,
                amount: amount,
                decimals: pool.decimals
            })
        );
    }

    useEffect(() => {
        const _assets = store.getStore("assets");
        if (_assets.length > 0) {
            setAssets([
                ..._assets.filter((asset) => (asset.isActive && asset.rewardPoolAddress !== zeroAddress))
            ]);
        }

        const additionalRewardPools = store.getStore("additionalRewardPools")
        setAdditionalRewards(additionalRewardPools)
        const populousFarmPools = store.getStore("populousFarmPools");
        setPopulousFarms(populousFarmPools);

        emitter.on("StoreUpdated", storeUpdated);
        if (_assets.length === 0) getReserves();

        return () => {
            emitter.removeListener("StoreUpdated", storeUpdated);
        };
    }, [stakedOnly, storeUpdated, getReserves]);

    return (
        <>
            {account.address ? (
                <div
                    id="content-wrapper"
                    className="d-flex flex-column main-margntop home-margintop"
                >
                    <div className="col-12">
                        <div className="container-fluid px-0">
                            <div className="row deposit-section pb-3">
                                <div className="col-xl-12 pl-md-4 pr-md-4 pt-4 p-0 mb-4 align-items-center d-flex flex-row justify-content-start">
                                    <div className="card border-0 w-100">
                                        <div className="card-header bg-transparent">
                                            <h4 className="card-title">
                                                Tokens
                                            </h4>
                                            <div className="aramaKutusu mobile-search">
                                                <input
                                                    type="text"
                                                    placeholder="Type to search..."
                                                    onChange={(e) => filterAssets(e)}
                                                />
                                                <a href="#" target="_blank">
                                                    <img src={searchImg} alt="" />
                                                </a>
                                            </div>
                                            <ul className="justify-content-end">
                                                <div className="mr-2">Staked Only</div>
                                                <div>
                                                    <AntSwitch
                                                        checked={stakedOnly}
                                                        onChange={(e) => setStakedOnly(e.target.checked)}
                                                        name="stakedOnly"
                                                    />
                                                </div>
                                            </ul>
                                        </div>
                                        <div className="card-body p-0 mobile-scroll">
                                            <div component={Paper}>
                                                <Table aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>Assets</StyledTableCell>
                                                            <StyledTableCell>Wallet Balance</StyledTableCell>
                                                            <StyledTableCell>APY</StyledTableCell>
                                                            <StyledTableCell className="mobile-hide">Stake</StyledTableCell>
                                                            <StyledTableCell className="mobile-hide">Earn</StyledTableCell>
                                                            <StyledTableCell className="mobile-hide">Deposit Fee</StyledTableCell>
                                                            <StyledTableCell />
                                                        </TableRow>
                                                    </TableHead>

                                                    {stakedOnly ? (
                                                        <TableBody>
                                                            {additionalRewards.map((reward, index) => (
                                                                <TopRow
                                                                    {...reward}
                                                                    key={index}
                                                                    makeStake={makeTopStake}
                                                                    makeClaim={makeTopClaim}
                                                                    makeWithdraw={makeTopWithdraw}
                                                                />
                                                            ))}
                                                            {assets.map((asset, index) => (
                                                                <Row
                                                                    asset={asset}
                                                                    key={index}
                                                                    assetIndex={index}
                                                                    account={account}
                                                                    stakedOnly={stakedOnly}
                                                                    makeStake={makeStake}
                                                                    makeClaim={makeClaim}
                                                                    makeWithdraw={makeWithdraw}
                                                                />
                                                            ))}
                                                        </TableBody>
                                                    ) : (
                                                        <TableBody>
                                                            {populousFarms?.length <= 0 && (
                                                                <TableRow>
                                                                    <StyledTableCell className="text-center" colspan={7}>No Data</StyledTableCell>
                                                                </TableRow>
                                                            )}
                                                            {populousFarms?.map(pool => {
                                                                return {
                                                                    ...pool,
                                                                    symbol: pool.token0.symbol + '-' + pool.token1.symbol
                                                                }

                                                            })?.map((pool, index) => (
                                                                <StakingRow
                                                                    key={index}
                                                                    asset={pool}
                                                                    stakedOnly={stakedOnly}
                                                                    makeStake={makePopulousFarmDeposit}
                                                                    makeClaim={() => {}}
                                                                    makeWithdraw={makePopulousFarmWithdraw}
                                                                />
                                                            ))}
                                                        </TableBody>
                                                    )}
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
                <ConnectWalletButton />
            )}
        </>
    );
};

export default Rewards;
