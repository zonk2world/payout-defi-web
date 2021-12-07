import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

import { Link } from "react-router-dom";
import proposalService from "../../services/api/proposal";
import { ProposalStatuses } from "../../config/constants";
import { formattedNumber } from "../../utilities";

const useStyles = makeStyles((theme) => ({
    statusFilterMenu: {
        position: "absolute !important",
        willChange: "transform",
        padding: '0 !important',
        margin: '0 !important',
        boxShadow: 'none !important',
        left: '-17px'
    },
    colorIcon: {
        width: '8px',
        height: '8px',
        borderRadius: '1px',
        marginRight: '10px',
        display: 'inline-block'
    }
}));

const VotingProgress = withStyles((theme) => ({
    root: {
        height: 4,
        borderRadius: 2
    },
    colorPrimary: {
        backgroundColor: "#CFD8DC"
    },
    bar: {
        borderRadius: 5,
        backgroundColor: "#30b651"
    }
}))(LinearProgress);

const AgainstVotingProgress = withStyles((theme) => ({
    root: {
        height: 4,
        borderRadius: 2
    },
    colorPrimary: {
        backgroundColor: "#CFD8DC"
    },
    bar: {
        borderRadius: 5,
        backgroundColor: "#30b651"
    }
}))(VotingProgress);

const Governance = () => {
    const [proposals, setProposals] = useState([]);
    const [status, setStatusCount] = useState(null);
    const classes = useStyles();
    const [activeStatus, setActiveStatus] = useState(ProposalStatuses[0]);
    const [showStatusFilter, setShowStatusFilter] = useState(false);

    const getStatusesCount = () =>
        proposalService.getProposalStatusesCount().then((res) => {
            if (res) {
                let obj = {};
                res?.map((v) => {
                    Object.keys(v)?.map((val) => {
                        if (val === "_id") {
                            let name = v[val];
                            obj[name] = v?.count;
                        }
                    });
                });
                setStatusCount(obj);
            }
        });

    const getProposals = () => {
        const filter = {};
        if (activeStatus.value !== 'all') {
            filter.and = [
                { key: "status", value: activeStatus.value, opt: "eq" },
            ];
        }
        proposalService
            .getProposals({ pagination: 0, filter })
            .then(data => {
                if (data.docs) {
                    setProposals(data.docs.map(item => {
                        const totalVotes = Number(item.forVotes) + Number(item.againstVotes);
                        if (totalVotes > 0) {
                            item.forVotesPercentage = (Number(item.forVotes) / totalVotes) * 100;
                            item.againstVotesPercentage = (Number(item.againstVotes) / totalVotes) * 100;
                        } else {
                            item.forVotesPercentage = 0;
                            item.againstVotesPercentage = 0;
                        }
                        item.forVotesFormatted = formattedNumber(item.forVotes / (10 ** 8));
                        item.againstVotesFormatted = formattedNumber(item.againstVotes / (10 ** 8));
                        item.forVotesPercentageFormatted = formattedNumber(item.forVotesPercentage) + "%";
                        item.againstVotesPercentageFormatted = formattedNumber(item.againstVotesPercentage) + "%";
                        item.color = ProposalStatuses.find(sItem => sItem.value === item.status)?.color;

                        // status
                        if (item.status === "executed") {
                            item.executionTime = new Date(Number(item.executionTime) * 1000).toLocaleDateString();
                        }
                        return item;
                    }));
                }
            });
    };

    const handleSelectStatus = (item) => {
        setActiveStatus(item);
        setShowStatusFilter(false);
    };

    useEffect(() => {
        getProposals();
    }, [activeStatus.value]);

    useEffect(() => {
        getStatusesCount();
    }, []);

    return (
        <>
            <div
                id="content-wrapper"
                className="d-flex flex-column main-margntop home-margintop"
            >
                <div className="col-12">
                    <div className="container-fluid px-0">
                        <div className="row deposit-details Proposals  pb-3  pt-4 ">
                            <div className="col-xl-8 pl-md-4 pr-md-4 p-0 mb-4 d-flex flex-row justify-content-start">
                                <div className="card proposals-area border-0 w-100">
                                    <div className="card-header bg-transparent d-flex flex-row dropdown-mobile-set">
                                        <h2>Proposals</h2>
                                        <ul className="navbar-nav ml-auto d-flex flex-row flex-grow-0 Proposals">
                                            <li className="nav-item dropdown mr-3 hide-mobile">
                                                <a
                                                    className="nav-link dropdown-toggle"
                                                    href="#"
                                                    data-toggle="dropdown"
                                                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                                                >
                                                    <span
                                                        className={classes.colorIcon}
                                                        style={{ background: activeStatus.color }}
                                                    />
                                                    {activeStatus.name}
                                                </a>
                                                <div
                                                    className={`dropdown-menu ${classes.statusFilterMenu}`}
                                                    style={{ display: showStatusFilter ? 'block' : 'none' }}
                                                >
                                                    <ul>
                                                        {ProposalStatuses.map((item) => (
                                                            <li
                                                                className="dropdown-item cursor-hand"
                                                                key={item.value}
                                                                onClick={() => handleSelectStatus(item)}
                                                            >
                                                                <span className="icon" style={{ background: item.color }}/>
                                                                {item.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </li>
                                            <li className="nav-item mr-3">
                                                <a className="nav-link blue-link" href="#">
                                                    Visit Forum
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link blue-link" href="#">
                                                    Governance FAQ
                                                </a>
                                            </li>
                                            <li className="nav-item dropdown mobile-dropdown web-hide">
                                                <a
                                                    className="nav-link dropdown-toggle"
                                                    href="#"
                                                    data-toggle="dropdown"
                                                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                                                >
                                                    <span
                                                        className={classes.colorIcon}
                                                        style={{ background: activeStatus.color }}
                                                    />
                                                    {activeStatus.name}
                                                </a>
                                                <div
                                                    className={`dropdown-menu ${classes.statusFilterMenu}`}
                                                    style={{ display: showStatusFilter ? 'block' : 'none' }}
                                                >
                                                    <ul>
                                                        {ProposalStatuses.map((item) => (
                                                            <li
                                                                className="dropdown-item cursor-hand"
                                                                key={item.value}
                                                                onClick={() => handleSelectStatus(item)}
                                                            >
                                                                <span className="icon" style={{ background: item.color }}/>
                                                                {item.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="card-body p-3">
                                        {proposals.map((proposal, index) => (
                                            <div className={index === 0 ? "" : "border-top"} key={proposal["_id"]}>
                                                <div className="row py-1  no-gutters migration">
                                                    <div className="col-md-4 col-sm-12 inline-block">
                                                        <h3 className="mr-auto">
                                                            {proposal["ipfsData"]["basename"]}
                                                            {": "}
                                                            {proposal["ipfsData"]["title"]}
                                                        </h3>
                                                    </div>
                                                    <div className="col-4 inline-block web-hide my-2">
                                                        <Link
                                                            to={`/governance/${proposal["proposalId"]}`}
                                                            className="btn float-left text-capitalize"
                                                            style={{ background: proposal["color"] }}
                                                        >
                                                            {proposal["status"]}
                                                        </Link>
                                                        {proposal["status"] === "executed" && (
                                                            <p className="float-left">
                                                                Executed on <span>{proposal["executionTime"]}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-md-8 col-sm-12 inline-block">
                                                        <h3 className="mr-auto float-left" style={{ width: "100px" }}>
                                                            {"YAE ("}
                                                            {proposal["forVotesPercentageFormatted"]}
                                                            {")"}
                                                        </h3>
                                                        <VotingProgress
                                                            className="max-height-4 w-50 mt-2 mx-2 float-left"
                                                            variant="determinate"
                                                            value={proposal["forVotesPercentage"]}
                                                        />
                                                        <h3 className="mr-auto float-left">
                                                            {proposal["forVotesFormatted"]}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="row py-1 no-gutters migration">
                                                    <div className="col-4 inline-block hide-mobile">
                                                        <Link
                                                            to={`/governance/${proposal["proposalId"]}`}
                                                            className="btn float-left text-capitalize"
                                                            style={{ background: proposal["color"] }}
                                                        >
                                                            {proposal["status"]}
                                                        </Link>
                                                        {proposal["status"] === "executed" && (
                                                            <p className="float-left">
                                                                Executed on <span>{proposal["executionTime"]}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-md-8 col-sm-12 inline-block">
                                                        <h3 className="mr-auto float-left" style={{ width: "100px" }}>
                                                            {"NAE ("}
                                                            {proposal["againstVotesPercentageFormatted"]}
                                                            {")"}
                                                        </h3>
                                                        <AgainstVotingProgress
                                                            className="max-height-4 w-50 mt-2 mx-2 float-left"
                                                            variant="determinate"
                                                            value={proposal["againstVotesPercentage"]}
                                                        />
                                                        <h3 className="mr-auto float-left">
                                                            {proposal["againstVotesFormatted"]}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 pl-md-4 pl-xl-0 pr-md-4 p-0 mb-4 flex-row justify-content-start date-selector">
                                <div className="card border-0 w-100">
                                    <div className="card-header bg-transparent align-content-center">
                                        <h2>Balance</h2>
                                    </div>
                                    <div className="card-body">
                                        <div className="row no-gutters d-flex">
                                            <div className="col-lg-12">
                                                <ul className="borrows">
                                                    <li className="d-flex justify-content-between">
                                                        <div>
                                                            <div>Your voting power</div>
                                                            <div style={{ fontSize: 12, color: "#607D8B" }}>(PopDeFi + stkPopDeFi)</div>
                                                        </div>

                                                        <span className="text-right">
                                                            0
                                                        </span>
                                                    </li>
                                                    <li className="d-flex justify-content-between">
                                                        <div>
                                                            <div>Your proposition power</div>
                                                            <div style={{ fontSize: 12, color: "#607D8B" }}>(PopDeFi + stkPopDeFi)</div>
                                                        </div>
                                                        <span className="text-right">
                                                            0
                                                        </span>
                                                    </li>
                                                    <li className="pb-0 d-flex justify-content-between">
                                                        <div>Delegate your power</div>
                                                        <div className="text-right">
                                                            0
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="border-top w-100 my-4"></div>

                                            <div className="col-lg-12">
                                                <ul className="borrows">
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Active
                                                        <span className="text-right">
                                                            {status?.active ? status?.active : 0}
                                                        </span>
                                                    </li>
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Pending
                                                        <span className="text-right">
                                                            {status?.pending ? status?.pending : 0}
                                                        </span>
                                                    </li>
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Failed
                                                        <span className="text-right">
                                                            {status?.failed ? status?.failed : 0}
                                                        </span>
                                                    </li>
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Canceled
                                                        <span className="text-right">
                                                            {status?.canceled ? status?.canceled : 0}
                                                        </span>
                                                    </li>
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Queued
                                                        <span className="text-right">
                                                            {status?.queued ? status?.queued : 0}
                                                        </span>
                                                    </li>
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Executed
                                                        <span className="text-right">
                                                            {status?.executed ? status?.executed : 0}
                                                        </span>
                                                    </li>
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Succeeded
                                                        <span className="text-right">
                                                            {status?.succeeded ? status?.succeeded : 0}
                                                        </span>
                                                    </li>
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Passed
                                                        <span className="text-right">
                                                            {status?.passed ? status?.passed : 0}
                                                        </span>
                                                    </li>
                                                    <li className="line-height-14 d-flex justify-content-between">
                                                        Expired
                                                        <span className="text-right">
                                                            {status?.expired ? status?.expired: 0}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card border-0 w-100 mt-4"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Governance;