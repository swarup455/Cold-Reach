import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ProfileDetails } from "@/components/onboarding/ProfileDetailsForm";
import type { ProfileDetailsValues } from "@/components/onboarding/profileSchema";
import { updateProfile } from "@/api/profileApi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/app/store";
import { useGoogle } from "@/hooks/useGoogle";
import { setUser } from "@/features/auth/authSlice";

const OnboardingPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { user } = useAppSelector((state: RootState) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        gmailConnected,
        loading: googleLoading,
        connect,
        refetch,
    } = useGoogle();

    useEffect(() => {
        if (searchParams.get("gmail") === "connected") {
            refetch();

            toast.success("Google account connected");

            searchParams.delete("gmail");
            setSearchParams(searchParams, {
                replace: true,
            });
        }
    }, [searchParams, refetch, setSearchParams]);

    const handleConnectGoogle = () => {
        connect();
    };

    const handleSubmit = async (values: ProfileDetailsValues) => {
        setErrorMessage(null);
        setIsLoading(true);

        try {
            const updatedUser = await updateProfile(values);
            dispatch(setUser({...updatedUser, isVerrified: user?.isVerified})); // or whatever your auth slice's action is called
            toast.success("Profile saved");
            navigate("/dashboard");
        } catch (err: any) {
            const message =
                err?.response?.data?.message ??
                (err instanceof Error ? err.message : "Something went wrong. Please try again.");

            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
            <div className="w-full max-w-3xl">
                <div className="mb-6 space-y-1.5 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        Complete your profile
                    </h1>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Tell us more about yourself so we can personalize your experience
                    </p>
                </div>

                <div className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <ProfileDetails
                        fullName={user?.name ?? ""}
                        email={user?.email ?? ""}
                        isGoogleConnected={gmailConnected}
                        onConnectGoogle={handleConnectGoogle}
                        onSubmit={handleSubmit}
                        isLoading={isLoading || googleLoading}
                        errorMessage={errorMessage}
                        defaultValues={user ?? undefined}
                    />
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;