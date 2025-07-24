import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const HomePage = lazy(() => import("./Home"));
const HomeRoute: RouteObject = {
    path: "/",
    element: (
        <Suspense fallback={<span className="loading loading-spinner loading-lg"></span>}>
            <HomePage />
        </Suspense>
    ),
};

export default HomeRoute;
