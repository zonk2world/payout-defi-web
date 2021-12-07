import React, { useState } from "react";

import WalletModal from "./WalletModal";
import walletImg from "../../styles/img/Ico.png";

const ConnectWalletButton = () => {
    const [showModal, setShowModal] = useState(false);

    function addressClicked() {
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    function renderModal() {
        return <WalletModal closeModal={closeModal} modalOpen={showModal}/>;
    }

    return (
        <>
            <div
                id="content-wrapper"
                className="d-flex flex-column main-margntop home-margintop"
            >
                <div className="col-12">
                    <div className="container-fluid px-0">
                        <div className="row deposit-details pb-3">
                            <div
                                className="col-xl-12 p-4 align-items-center d-flex flex-row justify-content-start date-selector">
                                <div className="card border-0 w-100 deposit-wallet justify-content-center">
                                    <div className="card-body d-flex flex-row ">
                                        <div
                                            className="row no-gutters manually justify-content-center w-100 align-content-center">
                                            <div className="col-xl-5 text-center mx-auto ">
                                                <figure className="mb-4">
                                                    {" "}
                                                    <img
                                                        src={walletImg}
                                                        alt=""
                                                    />
                                                </figure>
                                                <h2 className="pb-2">
                                                    Please connect a wallet
                                                </h2>
                                                <h3 className="pb-4 specific ">
                                                    We couldn't detect a wallet.
                                                    Connect a wallet to borrow
                                                </h3>
                                                <a
                                                    onClick={() => addressClicked()}
                                                    className="btn btn-primary w-75 continue mt-4 mb-4  flex-row"
                                                >
                                                    Connect
                                                </a>
                                                <a
                                                    href="#"
                                                    className="back d-flex flex-row justify-content-center"
                                                >
                                                    Back
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && renderModal()}
        </>
    );
};

export default ConnectWalletButton;
