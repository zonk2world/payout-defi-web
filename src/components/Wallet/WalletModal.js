import React from "react";
import { Dialog, DialogContent, Slide } from "@material-ui/core";

import WalletModalContent from "./WalletModalContent";

const Transition = React.forwardRef((props,ref) => (
    <Slide direction="up" {...props} ref={ref} />
))

const WalletModal = (props) => {
    const { closeModal, modalOpen } = props;
    const fullScreen = window.innerWidth < 450;

    return (
        <Dialog
            open={modalOpen}
            onClose={closeModal}
            fullWidth={true}
            maxWidth={"md"}
            TransitionComponent={Transition}
            fullScreen={fullScreen}
        >
            <DialogContent>
                <WalletModalContent closeModal={closeModal} t={Transition}/>
            </DialogContent>
        </Dialog>
    );
};

export default WalletModal;
