import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export interface LoginFormValues {
    email: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (values: LoginFormValues) => void | Promise<void>;
    onSwitchToRegister: () => void;
    isLoading?: boolean;
    errorMessage?: string | null;
}

export function LoginForm({
    onSubmit,
    onSwitchToRegister,
    isLoading = false,
    errorMessage = null,
}: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <div className="w-full">
            <div className="mb-6 space-y-1.5 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Sign in
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter your credentials to access your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-700 dark:text-slate-300">
                        Email
                    </Label>
                    <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                        required
                        className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-slate-700 dark:text-slate-300">
                            Password
                        </Label>
                        <button
                            type="button"
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                )}

                <Button
                    type="submit"
                    size="xl"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Sign up
                </button>
            </p>
        </div>
    );
}