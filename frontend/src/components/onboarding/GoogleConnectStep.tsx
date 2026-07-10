import { useFormContext } from "react-hook-form";
import { FcGoogle} from "react-icons/fc"
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProfileDetailsInput } from "./ProfileDetailsForm";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <p className="text-xs text-red-600 dark:text-red-400">
            {message}
        </p>
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
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Connect your Google account
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Connect your Google account to verify your identity and continue.
                    </p>
                </div>

                {isGoogleConnected ? (
                    <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    Google account connected
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                    You're ready to continue.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onConnectGoogle}
                        className="h-12 w-full justify-center gap-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                        <FcGoogle className="h-5 w-5" />
                        Continue with Google
                    </Button>
                )}
            </div>

            <FieldError message={errors.googleConnected?.message} />
        </section>
    );
}