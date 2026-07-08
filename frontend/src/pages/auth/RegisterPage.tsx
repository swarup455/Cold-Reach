import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm, type RegisterFormValues } from "@/components/auth/registerForm";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { registerUser, verifyOTP, clearError } from "@/features/auth/authSlice";
import type { RootState } from "@/app/store";
import { ArrowLeft } from "lucide-react";

const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);

    // userId isn't part of persisted auth state (user isn't verified/logged in yet),
    // so it's tracked locally between the "send otp" and "verify otp" steps.
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    const handleSendOtp = async (values: RegisterFormValues) => {
        const result = await dispatch(
            registerUser({ name: values.fullName, email: values.email, password: values.password })
        );

        if (registerUser.fulfilled.match(result)) {
            setPendingUserId(result.payload._id);
        } else {
            // rejected — throw so RegisterForm's try/catch shows its local error state
            throw new Error((result.payload as string) || "Registration failed");
        }
    };

    const handleVerifyOtp = async (_email: string, otp: string): Promise<boolean> => {
        if (!pendingUserId) return false;

        const result = await dispatch(verifyOTP({ userId: pendingUserId, otp }));
        return verifyOTP.fulfilled.match(result);
    };

    const handleRegistrationComplete = () => {
        // account created + verified — send them to log in (or straight to dashboard,
        // if you'd rather auto-login here since verifyOTP already confirms identity)
        navigate("/login");
    };

    const handleSwitchToLogin = () => {
        dispatch(clearError());
        navigate("/login");
    };

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
                        errorMessage={error}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;