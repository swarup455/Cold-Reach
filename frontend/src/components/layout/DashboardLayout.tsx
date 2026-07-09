import { Navigate, Outlet } from "react-router-dom";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/app/store";
import Sidebar from "../common/Sidebar";
import { useState } from "react";

const DashboardLayout = () => {
    const { isAuthenticated, user, loading } = useAppSelector((state: RootState) => state.auth);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    if (loading.fetchCurrentUser && !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-700" />
            </div>
        );
    }

    if (!loading.fetchCurrentUser && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
            <Sidebar
                open={mobileSidebarOpen}
                setOpen={setMobileSidebarOpen}
            />

            <div className="w-full flex min-h-screen flex-col">
                <Header onMenuClick={() => setMobileSidebarOpen(true)} />

                <main className="flex-1 w-full max-w-5xl mx-auto">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;