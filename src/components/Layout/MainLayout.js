import React, { useState } from "react";
import Settings from "../Modal/Settings";

const MainLayout = ({ children, Navbar, Sidebar }) => {
    const [openNavBar, setOpenNavBar] = React.useState(false);
    const handleToggleNavBar = () => setOpenNavBar(!openNavBar);

    const [showSettingModel, setShowSettingModel] = useState(false);

    const handleToggleSettingModel = () => setShowSettingModel(!showSettingModel);

    return (
        <div id="wrapper">
            {/* {Sidebar} */}
            <Sidebar isNavbarOpen={openNavBar} onToggle={handleToggleNavBar} onToggleSettingModel={handleToggleSettingModel} />
            {/* {Navbar} */}
            <Navbar onClick={handleToggleNavBar} />
            {children}
            {/* Models --start-- */}
            <Settings open={showSettingModel} onToggleSettingModel={handleToggleSettingModel} />
            {/* Models --end-- */}
        </div>
    );
};

export default MainLayout;
