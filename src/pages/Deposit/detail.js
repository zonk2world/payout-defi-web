import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Chart from "chart.js";
import { makeStyles } from "@material-ui/core";

import Store from "../../stores/store";
import { deposit } from "../../stores/action";
import { parseDate, tokenSymbol } from "../../utilities";
import assetService from "../../services/api/asset";
import { beautyNumber } from "utilities";

const emitter = Store.emitter;
const store = Store.store;
const dispatcher = Store.dispatcher;

const useStyles = makeStyles((theme) => ({
    chartCardHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "transparent",
        border: "none",
        padding: "1rem 1.2rem"
    }
}))

const DepositDetail = () => {
    const classes = useStyles()
    const { address } = useParams();
    const [account, setAccount] = useState();
    const [assets, setAssets] = useState();
    const [depositPercent, setDepositPercent] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [depositAPY, setDepositAPY] = useState([]);
    const [dateArray, setDateArray] = useState([]);
    const storeUpdated = () => {
        const data = store.getStore("assets");
        const _account = store.getStore("account");
        setAccount(_account);
        if (data.length > 0)
            setAssets(data.filter((image) => image.reserveAddress === address)[0]);
    };

    const percentClicked = (e, percent) => {
        e.preventDefault();
        setDepositPercent(percent);
        setDepositAmount((assets.walletBalance * percent) / 100);
    };

    const makeDeposit = () => {
        dispatcher.dispatch(
            deposit({
                reserve: address,
                amount: depositAmount,
                decimals: assets.decimals
            })
        );
    };

    const getGraphData = (reserve) => {
        assetService.getGraphData({ reserve: reserve }).then(data => {
            const _depositAPY = [], _dateArray = [];
            Promise.all(data.map(item => {
                _depositAPY.push(Number(item.liquidityRate));
                _dateArray.push(parseDate(new Date(item.date)));
            }));
            setDateArray([..._dateArray]);
            setDepositAPY([..._depositAPY]);
        });
    };

    const getReserves = () => {
        setAccount({
            address: address,
            totalLiquidityBalanceETH: 0,
            totalCollateralBalanceETH: 0,
            totalBorrowBalanceETH: 0,
            totalFeesETH: 0,
            availableBorrows: 0,
            currentLiquidationThreshold: 0,
            currentLtv: 0,
            healthFactor: 0
        });
        assetService.getReserveData().then(data => {
            setAssets(data.filter((image) => image.reserveAddress === address)[0]);
        });
    };

    useEffect(() => {
        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chart(chartContainer.current, {
                type: "line",
                options: {
                    responsive: true,
                    title: {
                        display: false
                    },
                    legend: {
                        display: false //This will do the task
                    },
                    scales: {
                        yAxes: [
                            {
                                type: "linear",
                                ticks: {
                                    maxTicksLimit: 5,
                                    callback: function(value, index, values) {
                                        return value + "%";
                                    }
                                },
                                gridLines: {
                                    borderDash: [8, 4]
                                }
                            }
                        ],
                        xAxes: [
                            {
                                gridLines: {
                                    display: false
                                }
                            }
                        ]
                    }
                },
                data: {
                    labels: dateArray,
                    datasets: [
                        {
                            label: "Deposit APY",
                            data: depositAPY,
                            radius: 2,
                            borderWidth: 1,
                            borderColor: "#FB8C00",
                            backgroundColor: "#FB8C00",
                            steppedLine: true,
                            fill: false
                        }
                    ]
                }
            });
            setChartInstance(newChartInstance);
        }
    }, [assets, dateArray, depositAPY]);

    useEffect(() => {
        const data = store.getStore("assets");
        if (data.length > 0) {
            setAssets(data.filter((image) => image.reserveAddress === address)[0]);
        } else {
            getReserves();
        }

        const _account = store.getStore("account");
        setAccount(_account);
        getGraphData(address);

        emitter.on("StoreUpdated", storeUpdated);
        return () => {
            emitter.removeListener("StoreUpdated", storeUpdated);
        };
    }, []);

    useEffect(() => {
        setButtonDisabled(depositAmount <= 0);
    }, [depositAmount]);

    return (
        <>
            {assets ? (
                <div
                    id="content-wrapper"
                    className="d-flex flex-column main-margntop home-margintop"
                >
                    <div className="col-12">
                        <div className="container-fluid px-0">
                            <div className="row">
                                <div
                                    className="col-xl-12 p-4 align-items-center d-flex flex-row justify-content-start date-selector">
                                    <nav
                                        aria-label="breadcrumb"
                                        className="breadcrumb-area"
                                    >
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="deposit.html">
                                                    Deposit
                                                </a>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                <span>Deposit details</span>
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div className="row deposit-details pb-3">
                                <div
                                    className="col-xl-8 pl-md-4 pr-md-4 p-0 pr-xl-0 mb-4 mb-xl-0 d-flex flex-row justify-content-start date-selector">
                                    <div className="card border-0 w-100">
                                        <div className="card-body">
                                            <div
                                                className="row total-collateral no-gutters d-flex flex-row justify-content-start">
                                                <div
                                                    className="col-xl-3 col-sm-6 mb-sm-3 box-size-mobile mb-xl-0 pr-3 d-flex flex-row justify-content-center text-center ">
                                                    <div className="wpb-wrapper card">
                                                        <h3>Total Deposit</h3>
                                                        <h4>{beautyNumber(assets.depositBalance * assets.assetsPrice)}{" USD"}</h4>
                                                        <h5>
                                                            {assets.depositBalance}{" "}{assets.symbol}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-xl-3 col-sm-6 mb-sm-3 box-size-mobile mb-xl-0 pr-xl-3 pr-0 d-flex flex-row justify-content-center text-center">
                                                    <div className="wpb-wrapper card">
                                                        <p
                                                            style={{ lineHeight: "10px" }}
                                                            className="m-0"
                                                        >
                                                            &nbsp;
                                                        </p>
                                                        <h3>Wallet Balance</h3>
                                                        <h4>
                                                            {assets.walletBalance}{" "}{assets.symbol}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-xl-3 col-sm-6 mb-sm-3 box-size-mobile mb-xl-0 pr-3 d-flex flex-row justify-content-center text-center ">
                                                    <div className="wpb-wrapper card">
                                                        <p
                                                            style={{ lineHeight: "10px"}}
                                                            className="m-0"
                                                        >
                                                            &nbsp;
                                                        </p>
                                                        <h3>Health factor</h3>
                                                        <h4>
                                                            {beautyNumber(account.healthFactor)}{" "}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-xl-3 col-sm-6 mb-sm-3 box-size-mobile mb-xl-0 pr-0 d-flex flex-row justify-content-center text-center ">
                                                    <div className="wpb-wrapper card">
                                                        <p
                                                            style={{ lineHeight: "10px" }}
                                                            className="m-0"
                                                        >
                                                            &nbsp;
                                                        </p>
                                                        <h3>Loan To Value</h3>
                                                        <h4>
                                                            {account.currentLtv}{" % "}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-5 mb-3 pt-5 mt-0-mobile no-gutters manually">
                                                <div className="col-xl-9 pt-3 pb-3 text-center mx-auto">
                                                    <h2 className="pb-2 mobile-h2">
                                                        How much would you like to deposit?
                                                    </h2>
                                                    <h3 className="pb-4 specific mobile-h3">
                                                        Welcome to Populous DeFi Token Deposit section
                                                    </h3>
                                                    <form className="mx-auto w-75 input-mobile">
                                                        <div
                                                            className="input-group pt-1 justify-content-between align-items-center d-flex">
                                                            <div className="d-flex align-items-center">
                                                                <figure className="m-0 pr-3">
                                                                    <img
                                                                        className="iconImg"
                                                                        src={tokenSymbol(assets.symbol)}
                                                                        alt=""
                                                                    />
                                                                </figure>
                                                                <input
                                                                    type="number"
                                                                    name=""
                                                                    placeholder="10"
                                                                    value={depositAmount}
                                                                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4>{assets.symbol}</h4>
                                                            </div>
                                                        </div>
                                                        <ul className="mx-auto per-btn align-content-center d-flex flex-row pt-3 mb-5">
                                                            <li className="pr-2 w-25">
                                                                <a
                                                                    href="#"
                                                                    className="btn btn-light"
                                                                    onClick={(e) => percentClicked(e,25)}
                                                                >
                                                                    25%
                                                                </a>
                                                            </li>
                                                            <li className="pr-2 w-25">
                                                                <a
                                                                    href="#"
                                                                    className="btn btn-light"
                                                                    onClick={(e) => percentClicked(e,50)}
                                                                >
                                                                    50%
                                                                </a>
                                                            </li>
                                                            <li className="pr-2 w-25">
                                                                <a
                                                                    href="#"
                                                                    className="btn btn-light"
                                                                    onClick={(e) =>percentClicked(e, 75)}
                                                                >
                                                                    75%
                                                                </a>
                                                            </li>
                                                            <li className="w-25">
                                                                <a
                                                                    href="#"
                                                                    className="btn btn-light"
                                                                    onClick={(e) => percentClicked(e, 100)}
                                                                >
                                                                    100%
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        <p className="pb-4">
                                                            You can deposit a
                                                            maximum of &nbsp;
                                                            {assets.walletBalance}{" "}{assets.name}
                                                        </p>
                                                        <div className="button-area-withdraw">
                                                            <input
                                                                className="btn btn-primary w-100 continue mb-0 mb-md-4"
                                                                name="continue"
                                                                value="Continue"
                                                                placeholder="Continue"
                                                                type="button"
                                                                text="Continue"
                                                                disabled={buttonDisabled}
                                                                onClick={() => makeDeposit()}
                                                            />
                                                            <Link
                                                                to={`/dashboard`}
                                                                className="btn btn-light w-100 back"
                                                            >
                                                                Dashboard
                                                            </Link>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-xl-4 pr-md-4 pl-md-4 p-0 flex-row justify-content-start date-selector">
                                    <div className="card border-0 w-100 pb-5">
                                        <div
                                            className="card-header mobile-card mobile-card-2 bg-transparent align-content-center">
                                            <figure className="m-0 pr-3">
                                                <img
                                                    className="iconImg"
                                                    src={tokenSymbol(assets.symbol)}
                                                    alt=""
                                                />
                                            </figure>
                                            <h2>
                                                {assets.symbol} Reserve Overview
                                            </h2>
                                        </div>
                                        <div className="card-body">
                                            <div className="row no-gutters">
                                                <div className="col-lg-12">
                                                    <ul className="borrows">
                                                        <li className=" d-flex justify-content-between">
                                                            Utilization rate
                                                            <span className="text-right">
                                                                {assets.utilizationRate}{" %"}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Available liquidity
                                                            <span className="text-right">
                                                            {!assets.totalLiquidity ? "--" : beautyNumber(
                                                                assets.totalLiquidity -
                                                                assets.totalBorrowed
                                                            )}{" USD"}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Liquidation
                                                            threshold
                                                            <span className="text-right">
                                                                {beautyNumber(account.currentLiquidationThreshold)}{" %"}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Total Liquidity
                                                            <span className="text-right">
                                                                {beautyNumber(assets.totalLiquidity)}{" "}{assets.symbol}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Asset Price
                                                            <span className="text-right">
                                                                {beautyNumber(assets.assetsPrice)}{" USD"}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card border-0 w-100 mt-4">
                                        <div className={classes.chartCardHeader}>
                                            <div className="d-flex align-items-center m-0">
                                                <img
                                                    className="iconImg mr-3"
                                                    src={tokenSymbol(assets.symbol)}
                                                    alt=""
                                                />
                                                <h2>{assets.symbol} Reserve Chart</h2>
                                            </div>
                                                
                                            <ul className="category">
                                                <li className="d-flex align-items-center">
                                                    <span className="away" />
                                                    <span>APY</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <figure className="m-0">
                                                <canvas ref={chartContainer} />
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default DepositDetail;
