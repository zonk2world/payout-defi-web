import React, { useEffect, useState } from "react";

import ConnectWalletButton from "../../components/Wallet/ConnectWalletButton";
import Store from "../../stores/store";

import assetImg from "../../styles/img/Assets.png";

const emitter = Store.emitter;
const store = Store.store;
const dispatcher = Store.dispatcher;

const Reward = () => {
    const [account, setAccount] = useState(store.getStore("account"));
    const [assets, setAssets] = useState(store.getStore("assets"));
    const [stakeAmount, setStakeAmount] = useState("");

    useEffect(() => {
        emitter.on("StoreUpdated", storeUpdated);
        return () => {
            emitter.removeListener("StoreUpdated", storeUpdated);
        };
    }, []);

    const storeUpdated = () => {

        const _assets = store.getStore("assets");
        const _account = store.getStore("account");
        setAssets([..._assets]);
        setAccount(_account);
    };

    const makeStake = () => {
        console.log(stakeAmount);
        dispatcher.dispatch({
            type: "STAKE",
            content: {
                reserve: assets[0].reserveAddress,
                ptoken: assets[0].PTokenAddress,
                amount: stakeAmount
            }
        });
    };
    return (
        <>
            {account.address ? (
                <div
                    id="content-wrapper"
                    className="d-flex flex-column main-margntop home-margintop"
                >
                    <div className="col-12">
                        <div className="container-fluid px-0">
                            <div className="row deposit-details pb-3  pt-4 ">
                                <div className="col-xl-8 pl-4 d-flex flex-row justify-content-start date-selector">
                                    <div className="card border-0 w-100 stake justify-content-center">
                                        <div className="card-body d-flex flex-row ">
                                            <div
                                                className="row no-gutters manually justify-content-center w-100 align-content-center">
                                                <div className="col-xl-9 text-center mx-auto ">
                                                    <h2 className="pb-2">
                                                        How much would you like to
                                                        stake?
                                                    </h2>
                                                    <h3 className="pb-4 specific ">
                                                        Staking PopDeFi in the
                                                        Safety Module helps to
                                                        secure the protocol in
                                                        exchange for protocol
                                                        incentives
                                                    </h3>
                                                    <form className="mx-auto w-75">
                                                        <h5 className="text-left d-flex justify-content-between balance">
                                                            PopDeFi Balance
                                                            <span className="text-right">
                                                            0
                                                        </span>
                                                        </h5>
                                                        <div
                                                            className="input-group pt-1 justify-content-between align-items-center amount d-flex">
                                                            <div className="d-flex align-items-center">
                                                                <figure className="m-0 pr-3">
                                                                    <img src={assetImg} alt="" />
                                                                </figure>
                                                                <input
                                                                    name=""
                                                                    placeholder="Amount"
                                                                    value={stakeAmount}
                                                                    onChange={(e) => setStakeAmount(e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4>MAX</h4>
                                                            </div>
                                                        </div>

                                                        <input
                                                            className="btn btn-primary w-100 continue mt-4 mb-4"
                                                            name="submit"
                                                            value="Stake"
                                                            type="button"
                                                            onClick={() => makeStake()}
                                                        />
                                                        <a
                                                            href="#"
                                                            className="back"
                                                        >
                                                            Back
                                                        </a>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 pr-4 flex-row justify-content-start date-selector">
                                    <div className="card border-0 w-100">
                                        <div className="card-header bg-transparent align-content-center">
                                            <figure className="m-0 pr-3">
                                                <img src={assetImg} alt=""/>
                                            </figure>
                                            <h2>PopDeFi</h2>
                                        </div>
                                        <div className="card-body">
                                            <div className="row no-gutters d-flex pb-5 ">
                                                <div className="col-lg-12">
                                                    <ul className="borrows pb-5">
                                                        <li className=" d-flex justify-content-between">
                                                            Stacked
                                                            <span className="text-right">
                                                            0
                                                        </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Per week
                                                            <span className="text-right">
                                                            0
                                                        </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Per month
                                                            <span className="text-right">
                                                            0
                                                        </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Cooldown
                                                            <span className="text-right">
                                                            10 days
                                                        </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            Claimable PopDeFi
                                                            <span className="text-right">
                                                            0
                                                        </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <ul className="buttons d-flex ">
                                                <li className="d-flex justify-content-between w-50 pr-1">
                                                    <a
                                                        href="#"
                                                        className="btn btn-primary claim"
                                                    >
                                                        Claim
                                                    </a>
                                                </li>
                                                <li className="d-flex justify-content-between w-50 pl-1">
                                                    <a
                                                        href="#"
                                                        className="btn btn-primary cooldown"
                                                    >
                                                        Activate Cooldown
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="card border-0 w-100 mt-4"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (<ConnectWalletButton/>)}
        </>
    );
};

export default Reward;
