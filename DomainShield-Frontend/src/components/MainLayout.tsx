import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
    return (
        <div className="w-screen h-screen flex flex-col ">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
                <Navbar />
            </div>

            <div className="flex flex-grow ">
                <div className="flex-grow overflow-auto bg-white">
                    <Outlet /> {/* Tempat untuk menampilkan rute anak */}
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
