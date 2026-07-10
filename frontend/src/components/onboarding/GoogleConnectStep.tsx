// components/profile/steps/GoogleConnectStep.tsx
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Globe } from "lucide-react";
import type { ProfileDetailsInput } from "./ProfileDetailsForm";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-red-600 dark:text-red-400">{message}</p>;
}
function GoogleLogo() {
    return (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );
}

interface GoogleConnectStepProps {
    isGoogleConnected: boolean;
    onConnectGoogle: () => void | Promise<void>;
}

export function GoogleConnectStep({
    isGoogleConnected,
    onConnectGoogle,
}: GoogleConnectStepProps) {
    const {
        formState: { errors },
    } = useFormContext<ProfileDetailsInput>();

    return (
        <section className="space-y-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        Connect Google account
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Required to verify your identity and continue.
                    </p>
                </div>
                <div className="mt-3 sm:mt-0">
                    {isGoogleConnected ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Connected
                        </span>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onConnectGoogle}
                            className="gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-50 dark:text-slate-700 dark:hover:bg-slate-200"
                        >
                            <GoogleLogo />
                            Continue with Google
                        </Button>
                    )}
                </div>
            </div>
            <FieldError message={errors.googleConnected?.message} />
        </section>
    );
}