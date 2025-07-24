import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const SecurityInsightPage = lazy(() => import("./SecurityInsight"));
const SecurityInsightRoute: RouteObject = {
    path: "/security-insight",
    element: (
        <Suspense fallback={<span className="loading loading-spinner loading-lg"></span>}>
            <SecurityInsightPage />
        </Suspense>
    ),
};

export default SecurityInsightRoute;
