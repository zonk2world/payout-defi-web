import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import MainLayout from "./MainLayout";
import Navbar from "../Header/Navbar";
import Sidebar from "../Sidebar";

const Authenticated = () => {
    return (
        <MainLayout Navbar={Navbar} Sidebar={Sidebar}>
            <Outlet/>
        </MainLayout>
    );
};

export default Authenticated;
