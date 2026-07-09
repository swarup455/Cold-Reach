import { useLocation, useNavigate } from "react-router-dom";
import {
    X,
    Building2,
    LayoutTemplate,
    Send,
    LogOut,
    Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/redux";
import { logoutUser } from "@/features/auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/app/store";

interface SidebarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const TOP_NAV = [
    {
        icon: Building2,
        label: "YC Startups",
        href: "/dashboard/startups",
    },
    {
        icon: LayoutTemplate,
        label: "Templates",
        href: "/dashboard/templates",
    },
    {
        icon: Send,
        label: "Send Mail",
        href: "/dashboard/send-mail",
    },
];

export default function Sidebar({
    open,
    setOpen,
}: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const isActive = (href: string) =>
        location.pathname.startsWith(href);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/login");
    };
    const user = useAppSelector((state: RootState) => state.auth.user);

    const initials =
        user?.name
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U";

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Logo */}

            <div className="border-b border-slate-200 dark:border-slate-800 px-6  py-3">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-3"
                >
                    <div className="flex w-fit p-2 items-center justify-center rounded-lg bg-blue-600">
                        <Mail className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex flex-col items-start">
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            ColdReach
                        </h2>

                        <p className="text-xs text-slate-500">
                            Dashboard
                        </p>
                    </div>
                </button>
            </div>

            {/* Top */}

            <div className="flex-1 p-4 space-y-1">
                {TOP_NAV.map(({ icon: Icon, label, href }) => (
                    <button
                        key={label}
                        onClick={() => {
                            navigate(href);
                            setOpen(false);
                        }}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all

${isActive(href)
                                ? "bg-blue-600 text-white shadow"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                            }
`}
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </button>
                ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                <button
                    onClick={() => navigate("/dashboard/profile")}
                    className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                >
                    <Avatar className="h-11 w-11">
                        <AvatarImage
                            src={user?.profilePhoto as string | undefined}
                            alt={user?.name}
                        />
                        <AvatarFallback className="bg-blue-600 text-white font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {user?.name}
                        </p>

                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {user?.email}
                        </p>
                    </div>
                </button>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                    <LogOut className="h-5 w-5" />
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">

            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 h-full w-68 transform border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 md:hidden
${open ? "translate-x-0" : "-translate-x-full"}
`}
            >
                <div className="absolute top-0 right-0 flex justify-end p-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <SidebarContent />
            </aside>

            <aside className="sticky left-0 top-0 hidden h-screen w-68 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:flex md:flex-col">
                <SidebarContent />
            </aside>
        </div>
    );
}