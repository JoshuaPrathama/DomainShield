// src/router.ts
import { createBrowserRouter } from "react-router-dom";
import HomeRoute from "./pages/Home/HomeRoute";
import ScanResultRoute from "./pages/ScanResult/ScanResultRoute";
import MainLayout from "./components/MainLayout";
import GenerateReport from "./pages/GenerateReport/GenerateReport";
import SecurityInsightRoute from "./pages/SecurityInsight/SecurityInsightRoute";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            HomeRoute,
            ScanResultRoute,
            SecurityInsightRoute,
        ],
    },
    {
        path: "/Generate-Report",
        element: <GenerateReport />,
    },
]);

export default router;
