import React from "react";
import { Link } from "react-router-dom";

import downloadImg from "../../styles/img/icon-download.png";
import twitterImg from "../../styles/img/icon-twitter.png";

const ExecutedDetails = () => {
    return (
        <>
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
                                            <Link to="/governance">
                                                Proposals
                                            </Link>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            <span>Proposals details</span>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="row deposit-details module-details  pb-3 ">
                            <div className="col-xl-8 pl-4 d-flex flex-row justify-content-start date-selector">
                                <div className="card proposals-area border-0 w-100">
                                    <div className="card-header bg-transparent d-flex flex-row">
                                        <h2>
                                            PXT/PopDeFi migration and activation
                                            of the Safety Module
                                        </h2>
                                    </div>
                                    <div className="card-body p-0 pl-3 pr-3 ">
                                        <div className="row  no-gutters Votes pt-4">
                                            <ul className="w-100 d-flex flex-row">
                                                <li>
                                                    <span style={{ color: "#30B651" }}>
                                                        100.00%
                                                    </span>
                                                    <span style={{ color: "#607D8B" }}>
                                                        Yae
                                                    </span>
                                                </li>
                                                <li
                                                    className="text-center"
                                                    style={{ fontWeight: 500 }}
                                                >
                                                    Votes:
                                                    <span style={{ color: "#30B651" }}>
                                                        100,646,443.29
                                                    </span>
                                                    <span style={{ color: "#EF392F" }}>
                                                        1,560.74
                                                    </span>
                                                </li>
                                                <li className="text-right">
                                                    <span style={{ color: "#30B651" }}>
                                                        0.00%
                                                    </span>
                                                    <span style={{ color: "#607D8B" }}>
                                                        Nay
                                                    </span>
                                                </li>
                                            </ul>
                                            <hr className="bottom-module w-100" />
                                        </div>
                                        <div className="row no-gutters rationale mt-2 mb-2">
                                            <h3 className="mr-auto">
                                                AIP rationale
                                            </h3>
                                            <p className="text-left">
                                                As stated in the Aavenomics
                                                paper, the PopDeFi asset is
                                                designed to become the center of
                                                gravity for PopDeFi governance
                                                and the protocol.
                                            </p>
                                            <p className="text-left">
                                                The DeFi decentralized ethos has
                                                been mostly achieved with
                                                protocols on the financial side,
                                                creating an ecosystem of
                                                financial applications with
                                                users in control of their own
                                                assets. However, we believe that
                                                is only the halfway point of the
                                                decentralization objective.
                                                Users should also be be in
                                                control of the protocol. The
                                                PopDeFi asset is designed for
                                                this purpose. This AIP is the
                                                first binding step towards the
                                                community ownership of the
                                                PopDeFie Protocol.
                                            </p>
                                            <p className="text-left">
                                                This AIP, if accepted by the
                                                community, will slowly deprecate
                                                the PTX asset in favour of the
                                                PopDeFi asset. As stated in the
                                                Aavenomics, this token upgrade
                                                will also create the Ecosystem
                                                Reserve (ER), the Safety Module
                                                (SM), and start the Safety
                                                Incentive (SI) rewards
                                                distribution. The Safety Module
                                                is designed as an additional
                                                line of defense for PopDeFi
                                                liquidity providers and as a way
                                                for PopDeFi holders to "stake"
                                                their assets in exchange for a
                                                range of rewards.
                                            </p>
                                            <p className="text-left">
                                                This AIP's purpose is also to
                                                dedicate a part of the ER to a
                                                kickstart incentives for the
                                                Safety Module's first quarterly
                                                staker distribution.
                                            </p>
                                            <h3>AIP content is short</h3>
                                            <ul className=" flex-row w-100">
                                                <li className="w-100">
                                                    Migration of PTX {"->"}{" "}
                                                    PoDeFi asset with the
                                                    migration contract
                                                </li>
                                                <li className="w-100">
                                                    Activation of the quarterly
                                                    plan of Safety Incentives
                                                    (SI) allocation
                                                </li>
                                                <li className="w-100">
                                                    Start of the Safety Module
                                                    with initial SI rewards of
                                                    400 PTX/day
                                                </li>
                                            </ul>
                                            <h3>Safety Incentives Schedule</h3>
                                            <p className="text-left">
                                                As stated in the Aavenomics
                                                paper, the PopDeFi asset is
                                                designed to become the center of
                                                gravity for PopDeFi governance
                                                and the protocol.
                                            </p>
                                            <p className="text-left">
                                                The DeFi decentralized ethos has
                                                been mostly achieved with
                                                protocols on the financial side,
                                                creating an ecosystem of
                                                financial applications with
                                                users in control of their own
                                                assets. However, we believe that
                                                is only the halfway point of the
                                                decentralization objective.
                                                Users should also be be in
                                                control of the protocol. The
                                                PopDeFi asset is designed for
                                                this purpose. This AIP is the
                                                first binding step towards the
                                                community ownership of the
                                                PopDeFie Protocol.
                                            </p>
                                            <p className="text-left">
                                                This AIP, if accepted by the
                                                community, will slowly deprecate
                                                the PTX asset in favour of the
                                                PopDeFi asset.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 pr-4 d-flex flex-row justify-content-start date-selector">
                                <div className="card border-0 w-100">
                                    <div className="card-header bg-transparent align-content-center">
                                        <h2>Details</h2>
                                        <ul className="d-flex justify-content-end icon-details">
                                            <li>
                                                <a href="#">
                                                    <img
                                                        src={downloadImg}
                                                        alt=""
                                                    />
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img
                                                        src={twitterImg}
                                                        alt=""
                                                    />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-body">
                                        <div className="row no-gutters d-flex pb-5 ">
                                            <div className="col-lg-12">
                                                <ul className="borrows pb-5">
                                                    <li className=" d-flex justify-content-between">
                                                        State
                                                        <span className="text-right">
                                                            Executed
                                                        </span>
                                                    </li>
                                                    <li className=" d-flex justify-content-between">
                                                        ID
                                                        <span className="text-right">
                                                            #00
                                                        </span>
                                                    </li>
                                                    <li className=" d-flex justify-content-between">
                                                        Created{" "}
                                                        <span className="text-right">
                                                            25 Sep 2020, 09:18
                                                            pm
                                                        </span>
                                                    </li>
                                                    <li className=" d-flex justify-content-between">
                                                        Block
                                                        <span className="text-right">
                                                            10933363
                                                        </span>
                                                    </li>
                                                    <li className=" d-flex justify-content-between">
                                                        Author
                                                        <span className="text-right">
                                                            Marc Zeller
                                                        </span>
                                                    </li>
                                                    <li className=" d-flex justify-content-between">
                                                        Discussions
                                                        <span className="text-right">
                                                            governance.aave.com.../60
                                                        </span>
                                                    </li>
                                                    <li className=" d-flex justify-content-between">
                                                        AIP number
                                                        <span className="text-right">
                                                            #01
                                                        </span>
                                                    </li>
                                                    <hr className="w-100 line" />
                                                    <li className=" d-flex justify-content-between">
                                                        Participating addresses
                                                        <span className="text-right">
                                                            761
                                                        </span>
                                                    </li>
                                                    <li className=" d-flex justify-content-between">
                                                        Total votes
                                                        <span className="text-right">
                                                            1,299,999,941.703
                                                        </span>
                                                    </li>
                                                    <li className=" d-flex justify-content-between">
                                                        Threshold
                                                        <span className="text-right">
                                                            65,000,000 votes
                                                        </span>
                                                    </li>
                                                    <hr className="w-100 bottom-line" />
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="row no-gutters Addresses-area pl-3 pr-3">
                                            <div className="col-lg-12">
                                                <ul className="d-flex justify-content-start buttons">
                                                    <li className="w-100">
                                                        <a
                                                            href="#"
                                                            className="btn btn-light Addresses"
                                                            data-toggle="modal"
                                                            data-target="#myAddresses"
                                                        >
                                                            Show 10 Top
                                                            Addresses
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExecutedDetails;
