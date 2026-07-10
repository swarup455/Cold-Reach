// components/common/RequireProfile.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/app/store";

const RequireProfile = () => {
    const { user } = useAppSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const onOnboardingPage = location.pathname === "/onboarding";

    if (!user.isProfileComplete && !onOnboardingPage) {
        return <Navigate to="/onboarding" replace />;
    }

    if (user.isProfileComplete && onOnboardingPage) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RequireProfile;