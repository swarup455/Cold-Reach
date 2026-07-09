import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/app/store";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme/themeToggle";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({
    onMenuClick,
}: HeaderProps) {
    const navigate = useNavigate();
    const user = useAppSelector((state: RootState) => state.auth.user);

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "U";

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                {/* Logo + wordmark */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuClick}
                        className="md:hidden"
                    >
                        <Menu size={22} />
                    </Button>
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
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                                <AvatarImage
                                    src={user.profilePhoto as string | undefined}
                                    alt={user.name}
                                />
                                <AvatarFallback className="bg-blue-600 text-sm font-medium text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
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