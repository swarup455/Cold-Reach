import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
    ProfileDetails,
    type ProfileDetailsValues,
} from "@/components/onboarding/ProfileDetailsForm";
import { useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/app/store";

// TODO: replace this mock request with your real API call / redux thunk,
// e.g. `dispatch(updateProfile(values))` from a `features/profile/profileSlice`.
async function submitProfileDetails(values: ProfileDetailsValues): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Simulated success — swap this out for a real request:
    // const res = await api.patch("/users/me", values);
    console.log("Submitting profile details:", values);
}

const OnboardingPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // TODO: point this at your actual auth slice shape.
    const { user } = useAppSelector((state: RootState) => state.auth);

    const [isGoogleConnected, setIsGoogleConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // If your backend redirects back here with ?google=connected after the
    // OAuth flow completes, pick that up and reflect it in local state.
    useEffect(() => {
        if (searchParams.get("google") === "connected") {
            setIsGoogleConnected(true);
            toast.success("Google account connected");
            searchParams.delete("google");
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleConnectGoogle = () => {
        // TODO: point this at your real Google OAuth start endpoint.
        window.location.href = `/api/auth/google?redirect=/onboarding`;
    };

    const handleSubmit = async (values: ProfileDetailsValues) => {
        setErrorMessage(null);
        setIsLoading(true);
        try {
            await submitProfileDetails(values);
            toast.success("Profile saved");
            navigate("/dashboard");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Something went wrong. Please try again.";
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
                        isGoogleConnected={isGoogleConnected}
                        onConnectGoogle={handleConnectGoogle}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        errorMessage={errorMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;