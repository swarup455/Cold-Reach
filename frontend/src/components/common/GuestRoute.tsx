import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/app/store";

export function GuestRoute() {
    const { isAuthenticated } = useAppSelector(
        (state: RootState) => state.auth
    );

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default GuestRoute;