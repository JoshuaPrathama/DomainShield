import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const ScanResultPage = lazy(() => import("./ScanResult2"));
const ScanResultRoute: RouteObject = {
    path: "/scan-result",
    element: (
        <Suspense fallback={<span className="loading loading-spinner loading-lg"></span>}>
            <ScanResultPage />
        </Suspense>
    ),
};

export default ScanResultRoute;
