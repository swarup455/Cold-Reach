import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { ProfileCard } from "@/components/profile/profileCard";

const ProfilePage = () => {
    const {
        user,
        loading: { fetchCurrentUser: isLoading },
        error: { fetchCurrentUser: errorMessage },
    } = useAppSelector((state) => state.auth);

    return (
        <div className="flex min-h-screen justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
            <div className="w-full max-w-4xl">
                <div className="mb-6 space-y-1.5 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Your Profile
                    </h1>

                    <p className="text-sm text-slate-500">
                        Here's everything we have on file for you.
                    </p>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-10">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading profile...
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-red-600">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && !errorMessage && user && (
                    <ProfileCard profile={user as any} />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;