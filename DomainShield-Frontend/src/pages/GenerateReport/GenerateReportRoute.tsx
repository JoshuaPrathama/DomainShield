import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const GenerateReportPage = lazy(() => import("./GenerateReport"));
const GenerateReportRoute: RouteObject = {
    path: "/Generate-Report",
    element: (
        <Suspense fallback={<span className="loading loading-spinner loading-lg"></span>}>
            <GenerateReportPage />
        </Suspense>
    ),
};

export default GenerateReportRoute;
