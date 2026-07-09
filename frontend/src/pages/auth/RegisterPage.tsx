import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm, type RegisterFormValues } from "@/components/auth/registerForm";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { registerUser, verifyOTP, clearError } from "@/features/auth/authSlice";
import type { RootState } from "@/app/store";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);

    // user isn't logged in yet, so keep the pending id locally
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    const handleSendOtp = async (values: RegisterFormValues) => {
        try {
            const user = await dispatch(
                registerUser({
                    name: values.fullName,
                    email: values.email,
                    password: values.password,
                })
            ).unwrap();

            setPendingUserId(user._id);
        } catch {
            // handled by useEffect
        }
    };

    const handleVerifyOtp = async (_email: string, otp: string): Promise<boolean> => {
        if (!pendingUserId) return false;

        try {
            await dispatch(
                verifyOTP({
                    userId: pendingUserId,
                    otp,
                })
            ).unwrap();

            return true;
        } catch {
            return false;
        }
    };

    const handleRegistrationComplete = () => {
        navigate("/login");
    };

    const handleSwitchToLogin = () => {
        dispatch(clearError("register"));
        navigate("/login");
    };

    useEffect(() => {
        if (error.register) {
            toast.error(error.register);
            dispatch(clearError("register"));
        }
    }, [error.register, dispatch]);

    useEffect(() => {
        if (error.verifyOTP) {
            toast.error(error.verifyOTP);
            dispatch(clearError("verifyOTP"));
        }
    }, [error.verifyOTP, dispatch]);

    useEffect(() => {
        if (error.resendOTP) {
            toast.error(error.resendOTP);
            dispatch(clearError("resendOTP"));
        }
    }, [error.resendOTP, dispatch]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
            <div className="w-full max-w-sm">
                <Link
                    to="/"
                    className="mb-2 flex w-fit items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                >
                    <ArrowLeft size={20} />
                    back
                </Link>
                <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <RegisterForm
                        onSendOtp={handleSendOtp}
                        onVerifyOtp={handleVerifyOtp}
                        onSubmit={handleRegistrationComplete}
                        onSwitchToLogin={handleSwitchToLogin}
                        isLoading={loading.register}
                        errorMessage={error.register}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;