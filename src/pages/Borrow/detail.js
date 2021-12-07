import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Chart from "chart.js";

import * as FeeProviderService from "../../services/feeProvider.service";
import Store from "../../stores/store";
import { borrow } from "../../stores/action";
import { beautyNumber, make2decimal, parseDate, tokenSymbol } from "../../utilities";
import { CompleteModal } from "../../components/Modal";

import { ERROR } from "../../config/constants";
import assetService from "../../services/api/asset";

import stableImg from "../../styles/img/stable.png";
import stableHoverImg from "../../styles/img/stable-hover.png";
import variableImg from "../../styles/img/variable.png";
import variableHoverImg from "../../styles/img/variable-hover.png";
import transactionImg from "../../styles/img/transaction.png";

const emitter = Store.emitter;
const store = Store.store;
const dispatcher = Store.dispatcher;

const BorrowDetailForm = (props) => {
    const {
        asset,
        account,
        value,
        setValue,
        percentClicked,
        buttonDisabled
    } = props;

    function clickNext(e) {
        e.preventDefault();
        props.onNext(2);
    }

    const clickBack = (e) => {
        e.preventDefault();
        props.onBack(1);
    };

    return (
        <>
            {asset ? (
                <div className="row mt-5 mb-3 pt-5 mt-0-mobile no-gutters manually">
                    <div className="col-xl-9 pt-3 pb-3 text-center mx-auto">
                        <h2 className="pb-2 mobile-h2">
                            How much would you like to borrow?
                        </h2>
                        <h3 className="pb-4 specific mobile-h3">
                            Welcome to Populous DeFi Token Borrowing section
                        </h3>
                        <form className="mx-auto w-75 input-mobile">
                            <div className="input-group pt-1 justify-content-between align-items-center  d-flex">
                                <div className="d-flex align-items-center">
                                    <figure className="m-0 pr-3">
                                        <img
                                            className="iconImg"
                                            src={tokenSymbol(asset.symbol)}
                                            alt=""
                                        />
                                    </figure>
                                    <input
                                        type="number"
                                        name=""
                                        placeholder="10"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <h4>{asset.symbol}</h4>
                                </div>
                            </div>
                            <div className=" Safmer mx-auto align-content-start text-left d-flex flex-row pt-3">
                                <h3>
                                    Safe
                                    <span className="text-right">Risky</span>
                                </h3>
                            </div>
                            <ul className="mx-auto per-btn align-content-center d-flex flex-row pt-3 mb-5">
                                <li className="pr-2 w-25">
                                    <a
                                        href="#"
                                        className="btn btn-light"
                                        onClick={(e) => percentClicked(e, 25)}
                                    >
                                        25%
                                    </a>
                                </li>
                                <li className="pr-2 w-25">
                                    <a
                                        href="#"
                                        className="btn btn-light"
                                        onClick={(e) => percentClicked(e, 50)}
                                    >
                                        50%
                                    </a>
                                </li>
                                <li className="pr-2 w-25">
                                    <a
                                        href="#"
                                        className="btn btn-light"
                                        onClick={(e) => percentClicked(e, 75)}
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
                                You can borrow a maximum of &nbsp;
                                {make2decimal(account.availableBorrows / asset.assetsPriceETH)}
                                &nbsp;
                                {asset.symbol}
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
                                    onClick={(e) => clickNext(e)}
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
            ) : (
                "waiting"
            )}
        </>
    );
};

const BorrowAmountForm = (props) => {
    const {
        rate,
        changeRate,
        rateType,
        changeRateType,
        percentClicked,
        asset
    } = props;

    const clickNext = (e) => {
        e.preventDefault();
        props.onNext(3);
    };

    const clickBack = (e) => {
        e.preventDefault();
        props.onBack(2);
    };

    const onChangePriceRate = (e, rate, type) => {
        changeRateType(type);
        changeRate(rate);
        // percentClicked(e, rate);
    };

    return (
        <>
            <div className="row mt-5 mb-3 pt-5  no-gutters manually">
                <div className="col-xl-10 pt-3 pb-3 text-center mx-auto">
                    <h2 className="pb-2">Please select your interest rate</h2>
                    <h3 className="pb-4 specific ">
                        Welcome to Populous DeFi Token Borrowing section.
                    </h3>
                    <form className="mx-auto w-75">
                        <div className="row no-gutters d-flex flex-row justify-content-start ">
                            <div className="col-lg-11 mx-auto">
                                <ul className="interest m-0 p-0 d-flex mt-3 mb-4">
                                    <li className="pr-2 w-50">
                                        <a
                                            href="#"
                                            className={
                                                rateType === "stable"
                                                    ? "card stable-area selected"
                                                    : "card stable-area"
                                            }
                                            onClick={(e) =>
                                                onChangePriceRate(e, asset.stableBorrowRate, "stable")
                                            }
                                        >
                                            <figure className="m-0 pt-5 pb-4">
                                                <img
                                                    src={stableImg}
                                                    className="normal"
                                                    alt=""
                                                />
                                                <img
                                                    src={stableHoverImg}
                                                    className="hover"
                                                    alt=""
                                                />
                                            </figure>
                                            <h4>Stable</h4>
                                            <h5 className="pb-2 m-0">
                                                {asset.stableBorrowRate} %
                                            </h5>
                                        </a>
                                    </li>
                                    <li className="pl-2 w-50">
                                        <a
                                            href="#"
                                            className={
                                                rateType === "variable"
                                                    ? "card variable-area selected"
                                                    : "card variable-area"
                                            }
                                            onClick={(e) =>
                                                onChangePriceRate(e, asset.variableBorrowRate, "variable")
                                            }
                                        >
                                            <figure className="m-0 pt-5 pb-4">
                                                <img
                                                    src={variableImg}
                                                    className="normal"
                                                    alt=""
                                                />
                                                <img
                                                    src={variableHoverImg}
                                                    className="hover"
                                                    alt=""
                                                />
                                            </figure>
                                            <h4>Variable</h4>
                                            <h5 className="pb-2 m-0">
                                                {asset.variableBorrowRate} %
                                            </h5>
                                        </a>
                                    </li>
                                </ul>
                                <button
                                    className="btn btn-light w-100 continue-light mb-4 mt-3"
                                    onClick={(e) => clickNext(e)}
                                >
                                    Continue
                                </button>
                                <a
                                    href="#"
                                    onClick={(e) => clickBack(e)}
                                    className="back"
                                >
                                    Back
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const BorrowFinalForm = (props) => {
    const { asset, amount, rate, rateType, originationFee, onSubmit } = props;

    const clickBack = (e) => {
        e.preventDefault();
        props.onBack(2);
    };

    return (
        <>
            <div className="row mt-5 mb-3 pt-5  no-gutters manually">
                <div className="col-xl-10 pt-3 pb-3 text-center mx-auto">
                    <h2 className="pb-2">Borrow</h2>
                    <h3 className="pb-4 specific ">Your transaction details</h3>
                    <form className="mx-auto w-75">
                        <div className="row no-gutters d-flex flex-row justify-content-start ">
                            <div className="col-lg-11 mx-auto">
                                <ul className="transaction m-0 p-0 mt-3 mb-4 text-left">
                                    <li className="w-100 d-flex justify-content-between">
                                        Amount
                                        <span className="text-right">
                                            <img src={transactionImg} alt="" />
                                            {amount + " " + asset.name}
                                        </span>
                                    </li>
                                    <li className="w-100 d-flex justify-content-between">
                                        Interest (APY)
                                        <span className="text-right">
                                            {rate}%
                                        </span>
                                    </li>
                                    <li className="w-100 d-flex justify-content-between">
                                        Interest rate type
                                        <span className="text-right">
                                            {rateType}
                                        </span>
                                    </li>
                                    <li className="w-100 d-flex justify-content-between">
                                        New health factor
                                        <span className="text-right">--</span>
                                    </li>
                                    <li className="w-100 d-flex justify-content-between">
                                        Origination fee (%)
                                        <span className="text-right">
                                            {originationFee} {asset.symbol}
                                        </span>
                                    </li>
                                    <li className="w-100 d-flex justify-content-between">
                                        Status
                                        <span className="text-right">
                                            <span className="active" />
                                            --
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    className="btn btn-light w-100 continue mb-4 mt-3"
                                    onClick={(e) => onSubmit(e)}
                                >
                                    Continue
                                </button>
                                <a
                                    href="#"
                                    onClick={(e) => clickBack(e)}
                                    className="back"
                                >
                                    Back
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const BorrowDetail = () => {
    const [formIdx, setFormIdx] = useState(1);

    const { address } = useParams();
    const [account, setAccount] = useState({});
    const [asset, setAsset] = useState();
    const [rateType, setRateType] = useState();
    const [rate, setRate] = useState(0);
    const [borrowAmount, setBorrowAmount] = useState(0);
    const [originationFee, setOriginationFee] = useState(0);
    const [completeModal, setCompleteModal] = useState(0);
    const [scanUrl, setScanUrl] = useState();
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const [stableAPY, setStableAPY] = useState([]);
    const [variableAPY, setVariableAPY] = useState([]);
    const [dateArray, setDateArray] = useState([]);

    const getGraphData = (reserve) => {
        assetService.getGraphData({ reserve: reserve }).then((data) => {
            const _stableAPY = [],
                _variableAPY = [],
                _dateArray = [];
            Promise.all(
                data.map((item) => {
                    _stableAPY.push(Number(item.stableBorrowRate));
                    _variableAPY.push(Number(item.variableBorrowRate));
                    _dateArray.push(parseDate(new Date(item.date)));
                })
            );
            setDateArray([..._dateArray]);
            setStableAPY([..._stableAPY]);
            setVariableAPY([..._variableAPY]);
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
        assetService.getReserveData().then((data) => {
            setAsset(
                data.filter((image) => image.reserveAddress === address)[0]
            );
        });
    };

    const storeUpdated = () => {
        const assets = store.getStore("assets");
        const _account = store.getStore("account");
        setAccount(_account);
        if (assets.length > 0)
            setAsset(
                assets.filter((coin) => coin.reserveAddress === address)[0]
            );
    };

    const onChangePercent = (e, percent) => {
        e.preventDefault();
        setBorrowAmount(
            make2decimal(
                ((account.availableBorrows / asset.assetsPriceETH) * percent) /
                100
            )
        );
        setRate(percent);
    };

    const makeBorrow = (e) => {
        e.preventDefault();
        dispatcher.dispatch(
            borrow({
                reserve: address,
                amount: borrowAmount,
                decimals: asset.decimals,
                rateType
            })
        );
    };

    const onNext = (idx) => {
        if (idx === 2) {
            FeeProviderService.calculateLoanOriginationFee(
                store,
                borrowAmount,
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return emitter.emit(ERROR, err);
                    }
                    setOriginationFee(result);
                }
            );
        }
        setFormIdx(idx);
    };

    const onBack = (idx) => {
        setFormIdx(idx);
    };

    const transactionFinished = ({ borrow }) => {
        setScanUrl(borrow.transactionHash);
        setCompleteModal(1);
    };

    const closeComplete = () => {
        setCompleteModal(0);
    };

    useEffect(() => {
        const _account = store.getStore("account");
        setAccount(_account);
        const assets = store.getStore("assets");
        if (assets.length > 0) {
            setAsset(
                assets.filter((coin) => coin.reserveAddress === address)[0]
            );
        } else {
            getReserves();
        }

        getGraphData(address);

        emitter.on("StoreUpdated", storeUpdated);

        return () => {
            emitter.removeListener("StoreUpdated", storeUpdated);
        };
    }, []);

    useEffect(() => {
        setButtonDisabled(borrowAmount <= 0);
    }, [borrowAmount]);

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
                            label: "Stable",
                            data: stableAPY,
                            radius: 2,
                            borderWidth: 1,
                            borderColor: "#8E24AA",
                            backgroundColor: "#8E24AA",
                            steppedLine: true,
                            fill: false
                        },
                        {
                            label: "Variable APY",
                            data: variableAPY,
                            radius: 2,
                            borderWidth: 1,
                            borderColor: "#039BE5",
                            backgroundColor: "#039BE5",
                            steppedLine: true,
                            fill: false
                        }
                    ]
                }
            });
            setChartInstance(newChartInstance);
        }
    }, [asset, dateArray, stableAPY, variableAPY]);

    const renderComplete = () => {
        return (
            <CompleteModal
                closeModal={closeComplete}
                modalOpen={completeModal}
                scanUrl={scanUrl}
                page="Deposit"
            />
        );
    };

    return (
        <>
            {asset && account ? (
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
                                                <Link to={"/borrow"}>
                                                    Borrow
                                                </Link>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                <span>Borrow details</span>
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div className="row deposit-details pb-3">
                                <div
                                    className="col-xl-8 pl-md-4 pr-md-4 p-0 mb-4 mb-xl-0 d-flex flex-row justify-content-start date-selector">
                                    <div className="card border-0 w-100">
                                        <div className="card-body">
                                            <div
                                                className="row total-collateral no-gutters d-flex flex-row justify-content-start">
                                                <div
                                                    className="col-xl-3 col-sm-6 mb-sm-3 box-size-mobile mb-xl-0 pr-3 d-flex flex-row justify-content-start text-center ">
                                                    <div className="wpb-wrapper card">
                                                        <h3>Total Deposit</h3>
                                                        <h4>
                                                            {beautyNumber(asset.depositBalance * asset.assetsPrice)}{" USD"}
                                                        </h4>
                                                        <h5>
                                                            {beautyNumber(asset.depositBalance)}{" "}{asset.symbol}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-xl-3 col-sm-6 mb-sm-3 box-size-mobile mb-xl-0 pr-3 d-flex flex-row justify-content-center text-center">
                                                    <div className="wpb-wrapper card">
                                                        <h3>
                                                            Available borrow
                                                        </h3>
                                                        <h4>
                                                            {beautyNumber((account.availableBorrows / asset.assetsPriceETH) * asset.assetsPrice)}{" USD"}
                                                        </h4>
                                                        <h5>
                                                            {beautyNumber(account.availableBorrows / asset.assetsPriceETH)}{" "}{asset.symbol}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-xl-3 col-sm-6 mb-sm-3 box-size-mobile mb-xl-0 pr-3 d-flex flex-row justify-content-center text-center">
                                                    <div className="wpb-wrapper card">
                                                        <p
                                                            style={{lineHeight: "10px"}}
                                                            className="m-0"
                                                        >
                                                            &nbsp;
                                                        </p>
                                                        <h3>You borrowed</h3>
                                                        <h4>
                                                            {beautyNumber(asset.youBorrowed * asset.assetsPrice)}{" USD"}
                                                        </h4>
                                                        <h5>
                                                            {beautyNumber(asset.youBorrowed)}{" "}{asset.symbol}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-xl-3 col-sm-6 mb-sm-3 box-size-mobile pr-3 mb-xl-0 d-flex flex-row justify-content-center text-center ">
                                                    <div className="wpb-wrapper card">
                                                        <p
                                                            style={{lineHeight: "10px"}}
                                                            className="m-0"
                                                        >
                                                            &nbsp;
                                                        </p>
                                                        <h3>
                                                            Total Collateral
                                                        </h3>
                                                        <h4>
                                                            {beautyNumber(account.totalCollateralBalanceETH * asset.eth2usdValue)}{" USD"}
                                                        </h4>
                                                        <h5>
                                                            {beautyNumber(account.totalCollateralBalanceETH)}{" ETH"}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            {formIdx === 1 ? (
                                                <BorrowDetailForm
                                                    onNext={onNext}
                                                    onBack={onBack}
                                                    percentClicked={
                                                        onChangePercent
                                                    }
                                                    value={borrowAmount}
                                                    setValue={setBorrowAmount}
                                                    buttonDisabled={buttonDisabled}
                                                    asset={asset}
                                                    account={account}
                                                />
                                            ) : null}
                                            {formIdx === 2 ? (
                                                <BorrowAmountForm
                                                    onNext={onNext}
                                                    onBack={onBack}
                                                    rate={rate}
                                                    changeRate={setRate}
                                                    rateType={rateType}
                                                    changeRateType={setRateType}
                                                    percentClicked={onChangePercent}
                                                    asset={asset}
                                                />
                                            ) : null}
                                            {formIdx === 3 ? (
                                                <BorrowFinalForm
                                                    onNext={onNext}
                                                    onBack={onBack}
                                                    asset={asset}
                                                    amount={borrowAmount}
                                                    originationFee={originationFee}
                                                    rate={rate}
                                                    rateType={rateType}
                                                    onSubmit={makeBorrow}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-xl-4 pr-md-4 pl-md-4 pl-xl-1 p-0 flex-row justify-content-start date-selector">
                                    <div className="card border-0 w-100 pb-5">
                                        <div
                                            className="card-header mobile-card mobile-card-2 bg-transparent align-content-center">
                                            <figure className="m-0 pr-3">
                                                <img
                                                    className="iconImg"
                                                    src={tokenSymbol(asset.symbol)}
                                                    alt=""
                                                />
                                            </figure>
                                            <h2>
                                                {asset.symbol} Reserve Overview
                                            </h2>
                                        </div>
                                        <div className="card-body">
                                            <div className="row no-gutters">
                                                <div className="col-lg-12">
                                                    <ul className="borrows pb-5">
                                                        <li className=" d-flex justify-content-between">
                                                            Utilization rate
                                                            <span className="text-right">
                                                                {asset.utilizationRate}{" %"}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Available liquidity
                                                            <span className="text-right">
                                                            {!asset.totalLiquidity ? "--" : beautyNumber(
                                                                asset.totalLiquidity -
                                                                asset.totalBorrowed
                                                            )}{" USD"}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Liquidation
                                                            threshold
                                                            <span className="text-right">
                                                                {account.currentLiquidationThreshold}{" %"}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Total Liquidity
                                                            <span className="text-right">
                                                                {asset.totalLiquidity}{" "}{asset.symbol}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Asset Price
                                                            <span className="text-right">
                                                                {beautyNumber(asset.assetsPrice)}{" USD"}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Stable borrow APR
                                                            <span className="text-right">
                                                                {asset.stableBorrowRate}{" %"}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Variable borrow APR
                                                            <span className="text-right">
                                                                {asset.variableBorrowRate}{" %"}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card border-0 w-100 mt-4">
                                        <div
                                            className="card-header mobile-card mobile-card-2 bg-transparent align-itam-center flex-wrap ">
                                            <figure className="m-0 pr-3">
                                                <img
                                                    className="iconImg"
                                                    src={tokenSymbol(asset.symbol)}
                                                    alt=""
                                                />
                                            </figure>
                                            <div className="away-main">
                                                <h2>
                                                    {asset.symbol} Reserve Chart
                                                </h2>
                                                <ul className="category mobile-apy">
                                                    <li>
                                                        <span className="stable" />
                                                        Stable
                                                    </li>
                                                    <li>
                                                        <span className="variable" />
                                                        Variable
                                                    </li>
                                                </ul>
                                            </div>
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
            {completeModal === 1 && renderComplete()}
        </>
    );
};

export default BorrowDetail;
