import { useNavigate } from "react-router-dom";
import { Mail, User, LayoutTemplate, LogOut, ArrowRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutUser } from "@/features/auth/authSlice";
import type { RootState } from "@/app/store";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme/themeToggle";

export function Header() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.auth.user);

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "U";

    const handleSignOut = async () => {
        await dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                {/* Logo + wordmark */}
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <Mail className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        ColdReach
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className="flex items-center justify-center rounded-full ring-offset-2 ring-offset-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-offset-slate-950"
                                aria-label="Open profile menu"
                            >
                                <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                                    <AvatarImage src={user?.profilePhoto as string | undefined} alt={user?.name} />
                                    <AvatarFallback className="bg-blue-600 text-sm font-medium text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                sideOffset={10}
                                className="w-54 rounded-2xl border border-slate-200/70 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95"
                            >
                                {/* User */}
                                <div className="px-3 py-3">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                        {user?.name}
                                    </p>

                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                        {user?.email}
                                    </p>
                                </div>

                                <DropdownMenuItem
                                    onClick={() => navigate("/dashboard/profile")}
                                    className="flex h-11 cursor-pointer items-center rounded-xl px-3 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <User className="mr-3 h-4 w-4" />
                                    Profile
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => navigate("/dashboard/templates")}
                                    className="flex h-11 cursor-pointer items-center rounded-xl px-3 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <LayoutTemplate className="mr-3 h-4 w-4" />
                                    Templates
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="flex h-11 cursor-pointer items-center rounded-xl px-3 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            size="xl"
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:ring-offset-slate-950"
                        >
                            Get Started
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}