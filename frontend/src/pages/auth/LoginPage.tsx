import { Link, useNavigate } from "react-router-dom";
import { LoginForm, type LoginFormValues } from "@/components/auth/loginForm";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { loginUser, clearError } from "@/features/auth/authSlice";
import type { RootState } from "@/app/store";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state: RootState) => state.auth);

    const handleLogin = async (values: LoginFormValues) => {
        const result = await dispatch(loginUser(values));

        if (loginUser.fulfilled.match(result)) {
            navigate("/dashboard");
        }
    };

    const handleSwitchToRegister = () => {
        dispatch(clearError());
        navigate("/register");
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
                    <LoginForm
                        onSubmit={handleLogin}
                        onSwitchToRegister={handleSwitchToRegister}
                        isLoading={loading.login}
                        errorMessage={error}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;