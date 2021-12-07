import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import web3 from "web3";
import { makeStyles } from "@material-ui/styles";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { Top10ListModal } from "../../components/Modal";
import proposalService from "../../services/api/proposal";
import eventService from "../../services/api/event";
import { formattedNumber } from "../../utilities";
import Store from "../../stores/store";
import { submitVote, executeProposal, queueProposal } from "../../stores/action";
import { TRANSACTION_FINISHED } from "../../config/constants";
import assetService from "../../services/api/asset";

const emitter = Store.emitter;
const store = Store.store;
const dispatcher = Store.dispatcher;

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: '10px 5px',
        minWidth: 120,
        width: '100%',
    },
    markdown: {
        "& h2": {
            color: "black",
            fontSize: "1.3em"
        }
    }
}));

const ProposalDetails = () => {
    const [isExecuted, setExecuted] = useState(false);
    const [action, setAction] = useState('');
    const [voteMode, setVoteMode] = useState(false);
    const [top10ListModal, setTop10ListModal] = useState(false);
    const [assets, setAssets] = useState(store.getStore("assets"));
    const [proposal, setProposal] = useState({});
    const [yaeVotes, setYaeVotes] = useState([]);
    const [nayVotes, setNayVotes] = useState([]);
    const [totalVotingPower, setTotalVotingPower] = useState('0');
    const [totalAddresses, setTotalAddresses] = useState(0);
    const [voteTokenAddress, setVoteTokenAddress] = useState('');
    const [voteAmount, setVoteAmount] = useState(0);
    const { proposalId } = useParams();
    const classes = useStyles();

    const handleSubmitVote = (support = true) => {
        setAction('vote');
        setVoteMode(support);
        dispatcher.dispatch(submitVote({
            tokenAddress: voteTokenAddress,
            tokenAmount: voteAmount,
            proposalId,
            support
        }));
    };

    const handleExecuteProposal = () => {
        setAction('execute');
        dispatcher.dispatch(executeProposal({ proposalId }));
    };

    const handleQueueProposal = () => {
        setAction('queue');
        dispatcher.dispatch(queueProposal({ proposalId }));
    };

    const closeComplete = () => {
        setTop10ListModal(false);
    };

    const transactionFinished = (result) => {
        setExecuted(true);
    };

    const getProposalDetail = () => {
        proposalService
            .getProposal({ proposalId })
            .then(response => {
                const data = response;
                const totalVotes = Number(data.forVotes) + Number(data.againstVotes);
                if (totalVotes > 0) {
                    data.forVotesPercentage = (Number(data.forVotes) / totalVotes) * 100;
                    data.againstVotesPercentage = (Number(data.againstVotes) / totalVotes) * 100;
                } else {
                    data.forVotesPercentage = 0;
                    data.againstVotesPercentage = 0;
                }
                data.forVotesFormatted = formattedNumber(data.forVotes / (10 ** 8));
                data.againstVotesFormatted = formattedNumber(data.againstVotes / (10 ** 8));
                data.forVotesPercentageFormatted = formattedNumber(data.forVotesPercentage) + "%";
                data.againstVotesPercentageFormatted = formattedNumber(data.againstVotesPercentage) + "%";
                data.totalVotes = totalVotes;
                data.totalVotesFormatted = formattedNumber(data.totalVotes / (10 ** 8));

                // status
                if (data.status === "executed") {
                    data.executionTime = new Date(Number(data.executionTime) * 1000).toLocaleString();
                }
                setProposal(data);
            });
    };

    const getVoteEvents = () => {
        const _yaeVotes = [];
        const _nayVotes = [];
        eventService
            .getVoteEvents({
                proposalId,
                pagination: 0
            })
            .then(response => {
                response.docs.forEach((item) => {
                    const _item = {
                        id: item._id,
                        address: item.fromAddress,
                        addressFormatted: '',
                        votingPower: web3.utils.hexToNumber(item.decodedData.votingPower._hex),
                        votingPowerFormatted: ''
                    };
                    _item.addressFormatted = `${_item.address.slice(0, 12)}...${_item.address.slice(38)}`;
                    _item.votingPowerFormatted = formattedNumber(_item.votingPower / (10 ** 8));

                    if (item.decodedData.support) {
                        _yaeVotes.push(_item);
                    } else {
                        _nayVotes.push(_item);
                    }
                });
                setYaeVotes(_yaeVotes.sort((i1, i2) => i2.votingPower - i1.votingPower).slice(0,10));
                setNayVotes(_nayVotes.sort((i1, i2) => i2.votingPower - i1.votingPower).slice(0,10));
                setTotalAddresses(response.totalDocs);
            });
    };

    const getReserves = () => {
        assetService.getReserveData().then(data => {
            setAssets(data);
        });
    };

    const storeUpdated = () => {
        const power = store.getStore('totalVotingPower');
        const _assets = store.getStore("assets");
        if (_assets.length > 0) {
            setAssets([..._assets]);
        }
        if (power) {
            setTotalVotingPower(formattedNumber(power));
        }
    };

    useEffect(() => {
        getProposalDetail();
        getVoteEvents();
        storeUpdated();

        if (assets.length === 0) {
            getReserves();
        }

        emitter.on("StoreUpdated", storeUpdated);
        emitter.on(TRANSACTION_FINISHED, transactionFinished);

        return () => {
            emitter.removeListener("StoreUpdated", storeUpdated);
            emitter.removeListener(TRANSACTION_FINISHED, transactionFinished);
        };
    }, []);

    const renderModal = () => {
        return (
            <Top10ListModal
                yaeVotes={yaeVotes}
                nayVotes={nayVotes}
                proposal={proposal}
                closeModal={closeComplete}
                modalOpen={top10ListModal}
            />
        );
    };

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
                        {Object.keys(proposal).length > 0 && (
                            <div className="row deposit-details module-details  pb-3 ">

                                <div className="col-xl-8 pl-md-4 pr-md-4 p-0 mb-4 d-flex flex-row justify-content-start date-selector">
                                    <div className="card proposals-area border-0 w-100">
                                        <div className="card-header bg-transparent d-flex flex-row">
                                            <h2>
                                                {proposal["ipfsData"]["title"]}
                                            </h2>
                                        </div>
                                        <div className="card-body p-0 pl-3 pr-3 ">
                                            <div className="row no-gutters Votes pt-4">
                                                <div className="col-12 col-lg-6 inline-block">
                                                    <ul className="w-100 d-flex flex-row">
                                                        <li>
                                                            <span style={{ color: "#607D8B" }}>
                                                                Yae&nbsp;
                                                            </span>
                                                            <span style={{ color: "#30B651" }}>
                                                                {proposal["forVotesPercentageFormatted"]}
                                                            </span>
                                                        </li>
                                                        <li className="text-right">
                                                            <span style={{ color: "#607D8B" }}>
                                                                Quorum&nbsp;
                                                            </span>
                                                            <span style={{ color: "#607D8B" }}>
                                                                2,00%
                                                            </span>
                                                        </li>
                                                    </ul>
                                                    <hr className="bottom-module green w-100"/>
                                                </div>
                                                <div className="col-12 col-lg-6 mt-3 mt-lg-0 inline-block">
                                                    <ul className="w-100 d-flex flex-row">
                                                        <li className="text-left">
                                                            <span style={{ color: "#607D8B" }}>
                                                                Nay&nbsp;
                                                            </span>
                                                            <span style={{ color: "RED" }}>
                                                                {proposal["againstVotesPercentageFormatted"]}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                    <hr className="bottom-module gray w-100"/>
                                                </div>
                                            </div>
                                            <div className="row no-gutters rationale mt-2 mb-2">
                                                <div className="col-12">
                                                    <h3 className="mr-auto">
                                                        {proposal["ipfsData"]["basename"]}
                                                    </h3>
                                                    <div className={classes.markdown}>
                                                        <Markdown>
                                                            {proposal["ipfsData"]["description"]}
                                                        </Markdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 pl-md-4 pl-xl-0 pr-md-4 p-0 mb-4 d-flex flex-row justify-content-start date-selector">
                                    <div className="card border-0 w-100">
                                        <div
                                            className="card-header d-flex flex-column bg-transparent align-content-center">
                                            <ul className="d-flex justify-content-between icon-details voting-balance pb-3">
                                                <li
                                                    style={{
                                                        fontFamily: "IBM Plex Sans",
                                                        fontSize: 14,
                                                        color: "#000000"
                                                    }}
                                                >
                                                    Available voting balance
                                                </li>
                                                <li
                                                    style={{
                                                        fontFamily: "IBM Plex Sans",
                                                        fontSize: 14,
                                                        color: "#000000",
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {totalVotingPower}
                                                </li>
                                            </ul>
                                            {proposal["status"] === "active" && (
                                                <>
                                                    <div className="d-flex justify-content-between">
                                                        <FormControl className={classes.formControl}>
                                                            <InputLabel id="select-token">Select Token</InputLabel>
                                                            <Select
                                                                labelId="select-token"
                                                                id="select-token"
                                                                value={voteTokenAddress}
                                                                onChange={(e) => setVoteTokenAddress(e.target.value)}
                                                            >
                                                                <MenuItem value />
                                                                {assets.map(asset => (
                                                                    <MenuItem
                                                                        key={asset.reserveAddress}
                                                                        value={asset.reserveAddress}
                                                                    >
                                                                        {asset.symbol}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        <FormControl className={classes.formControl}>
                                                            <TextField
                                                                id="token-amount"
                                                                label="Token Amount"
                                                                value={voteAmount}
                                                                type="number"
                                                                onChange={(e) => setVoteAmount(Number(e.target.value))}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <ul className="d-flex justify-content-around icon-details voting-balance">
                                                        <li style={{ width: 150 }}>
                                                            <a
                                                                href="#"
                                                                onClick={() => handleSubmitVote(true)}
                                                                className="btn btn-light Addresses"
                                                                style={{ backgroundColor: "#30B651" }}
                                                            >
                                                                YAE
                                                            </a>
                                                        </li>
                                                        <li style={{ width: 150 }}>
                                                            <a
                                                                href="#"
                                                                onClick={() => handleSubmitVote(false)}
                                                                className="btn btn-light Addresses"
                                                                style={{ backgroundColor: "#EF392F" }}
                                                            >
                                                                NAY
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </>
                                            )}
                                            {proposal["status"] === "succeeded" && (
                                                <a
                                                    href="#"
                                                    onClick={handleQueueProposal}
                                                    className="btn Addresses"
                                                    style={{ backgroundColor: "#FB8C00", width: 150 }}
                                                >
                                                    Queue Proposal
                                                </a>
                                            )}
                                            {proposal["status"] === "queued" && (
                                                <a
                                                    href="#"
                                                    onClick={handleExecuteProposal}
                                                    className="btn Addresses"
                                                    style={{ backgroundColor: "#30B651", width: 150 }}
                                                >
                                                    Execute Proposal
                                                </a>
                                            )}
                                        </div>
                                        {isExecuted && action === 'vote' && (
                                            voteMode ? (
                                                <div
                                                    className="card-header d-flex flex-column bg-transparent align-content-center">
                                                    <ul className="d-flex justify-content-between icon-details pb-3 voted-detail">
                                                        <li
                                                            style={{
                                                                fontFamily: "IBM Plex Sans",
                                                                fontSize: 14,
                                                                color: "#000000"
                                                            }}
                                                        >
                                                            You voted
                                                            <a
                                                                href="#"
                                                                className="btn btn-light Addresses"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#30B651"
                                                                }}
                                                            >
                                                                YAE
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <ul className="d-flex justify-content-between icon-details">
                                                        <li
                                                            style={{
                                                                fontFamily: "IBM Plex Sans",
                                                                fontSize: 14,
                                                                color: "#000000"
                                                            }}
                                                        >
                                                            Available
                                                        </li>
                                                        <li
                                                            style={{
                                                                fontFamily: "IBM Plex Sans",
                                                                fontSize: 14,
                                                                color: "#000000"
                                                            }}
                                                        >
                                                            000.000.000 LEND
                                                        </li>
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div
                                                    className="card-header d-flex flex-column bg-transparent align-content-center">
                                                    <ul className="d-flex justify-content-between icon-details pb-3 voted-detail">
                                                        <li
                                                            style={{
                                                                fontFamily: "IBM Plex Sans",
                                                                fontSize: 14,
                                                                color: "#000000"
                                                            }}
                                                        >
                                                            You voted
                                                            <a
                                                                href="#"
                                                                className="btn btn-light Addresses"
                                                                style={{
                                                                    backgroundColor:
                                                                        "#EF392F"
                                                                }}
                                                            >
                                                                NAY
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <ul className="d-flex justify-content-between icon-details">
                                                        <li
                                                            style={{
                                                                fontFamily: "IBM Plex Sans",
                                                                fontSize: 14,
                                                                color: "#000000"
                                                            }}
                                                        >
                                                            Available
                                                        </li>
                                                        <li
                                                            style={{
                                                                fontFamily: "IBM Plex Sans",
                                                                fontSize: 14,
                                                                color: "#000000"
                                                            }}
                                                        >
                                                            000.000.000 LEND
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        )}

                                        <div className="card-body">
                                            <div className="row no-gutters d-flex pb-5 ">
                                                <div className="col-lg-12">
                                                    <ul className="borrows pb-5">
                                                        <li className=" d-flex justify-content-between">
                                                            <span>State</span>
                                                            <span className="text-right text-capitalize">
                                                                {proposal["status"]}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>ID</span>
                                                            <span className="text-right">
                                                                #0{proposal["proposalId"]}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>Created</span>
                                                            <span className="text-right">
                                                                {proposal["executionTime"]}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>Block</span>
                                                            <span className="text-right">
                                                                {proposal["startBlock"]}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>Author</span>
                                                            <span className="text-right ml-2">
                                                                {proposal["ipfsData"]["author"]}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>Discussions</span>
                                                            <span className="text-right ml-2">
                                                                {proposal["ipfsData"]["discussions"]}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>AIP number</span>
                                                            <span className="text-right">
                                                                #{proposal["ipfsData"]["aip"]}
                                                            </span>
                                                        </li>
                                                        <hr className="w-100 line"/>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>Participating addresses</span>
                                                            <span className="text-right">
                                                                {totalAddresses}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>Total votes</span>
                                                            <span className="text-right">
                                                                {proposal["totalVotesFormatted"]}
                                                            </span>
                                                        </li>
                                                        <li className=" d-flex justify-content-between">
                                                            <span>Threshold</span>
                                                            <span className="text-right">
                                                                65,000,000 votes
                                                            </span>
                                                        </li>
                                                        <hr className="w-100 bottom-line"/>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="row no-gutters Addresses-area pl-3 pr-3">
                                                <div className="col-lg-12">
                                                    <ul className="d-block d-md-flex justify-content-start buttons">
                                                        <li className="voting-executed-button-left">
                                                            <a
                                                                href="#"
                                                                className="btn btn-light Addresses disable-button"
                                                                data-toggle="modal"
                                                                data-target="#myAddresses"
                                                            >
                                                                Show Payload
                                                            </a>
                                                        </li>

                                                        <li className="voting-executed-button-right">
                                                            <a
                                                                onClick={() => setTop10ListModal(true)}
                                                                className="btn btn-light Addresses"
                                                                data-toggle="modal"
                                                                data-target="#myAddresses"
                                                            >
                                                                Show 10 Top Addresses
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {top10ListModal && renderModal()}
        </>
    );
};

export default ProposalDetails;
