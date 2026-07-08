import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export interface RegisterFormValues {
    fullName: string;
    email: string;
    password: string;
}

type Step = "details" | "password" | "otp";

interface RegisterFormProps {
    /** Called once the user has entered name, email, and a password.
     *  This is when the account should actually be created and the OTP sent. */
    onSendOtp: (values: RegisterFormValues) => Promise<void>;
    /** Called to verify the OTP. Should resolve `true` if valid. */
    onVerifyOtp: (email: string, otp: string) => Promise<boolean>;
    /** Called once the OTP has been verified — registration is complete. */
    onSubmit: (values: RegisterFormValues) => void | Promise<void>;
    onSwitchToLogin: () => void;
    isLoading?: boolean;
    errorMessage?: string | null;
}

const STEPS: { key: Step; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "password", label: "Password" },
    { key: "otp", label: "Verify" },
];

export function RegisterForm({
    onSubmit,
    onSwitchToLogin,
    onSendOtp,
    onVerifyOtp,
    isLoading = false,
    errorMessage = null,
}: RegisterFormProps) {
    const [step, setStep] = useState<Step>("details");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const currentStepIndex = STEPS.findIndex((s) => s.key === step);

    const handleDetailsNext = (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        if (!fullName.trim() || !email.trim()) return;
        setStep("password");
    };

    const handleSendOtp = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        if (password.length < 8) {
            setLocalError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }
        setSendingOtp(true);
        try {
            await onSendOtp({ fullName, email, password });
            setStep("otp");
        } catch {
            setLocalError("Couldn't send the code. Check your details and try again.");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        setOtpError(null);
        if (otp.length < 6) return;
        setVerifyingOtp(true);
        try {
            const valid = await onVerifyOtp(email, otp);
            if (valid) {
                onSubmit({ fullName, email, password });
            } else {
                setOtpError("That code isn't right. Please try again.");
            }
        } catch {
            setOtpError("Couldn't verify the code. Please try again.");
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        setOtpError(null);
        setSendingOtp(true);
        try {
            await onSendOtp({ fullName, email, password });
        } catch {
            setOtpError("Couldn't resend the code. Please try again.");
        } finally {
            setSendingOtp(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 space-y-1.5 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Create an account
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Start sending cold emails that get replies
                </p>
            </div>

            {/* Step indicator */}
            <div className="mb-6 flex items-center justify-center gap-2">
                {STEPS.map((s, i) => (
                    <div key={s.key} className="flex items-center gap-2">
                        <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${i < currentStepIndex
                                ? "bg-blue-600 text-white"
                                : i === currentStepIndex
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                                }`}
                        >
                            {i < currentStepIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                            <div
                                className={`h-px w-6 ${i < currentStepIndex
                                    ? "bg-blue-600"
                                    : "bg-slate-200 dark:bg-slate-700"
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {step === "details" && (
                <form onSubmit={handleDetailsNext} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="register-name" className="text-slate-700 dark:text-slate-300">
                            Full name
                        </Label>
                        <Input
                            id="register-name"
                            type="text"
                            autoComplete="name"
                            placeholder="Jane Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-slate-700 dark:text-slate-300">
                            Email
                        </Label>
                        <Input
                            id="register-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    {localError && (
                        <p className="text-sm text-red-600 dark:text-red-400">{localError}</p>
                    )}

                    <Button
                        size="xl"
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        Continue
                    </Button>
                </form>
            )}

            {step === "password" && (
                <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-slate-700 dark:text-slate-300">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Create a password"
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

                    <div className="space-y-2">
                        <Label htmlFor="register-confirm-password" className="text-slate-700 dark:text-slate-300">
                            Confirm password
                        </Label>
                        <div className="relative">
                            <Input
                                id="register-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {localError && (
                        <p className="text-sm text-red-600 dark:text-red-400">{localError}</p>
                    )}

                    <Button
                        size="xl"
                        type="submit"
                        disabled={sendingOtp}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        {sendingOtp ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending code...
                            </>
                        ) : (
                            "Send verification code"
                        )}
                    </Button>

                    <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="w-full text-center text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        Back
                    </button>
                </form>
            )}

            {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                    <div className="space-y-2 text-center">
                        <Label className="text-slate-700 dark:text-slate-300">
                            Enter the 6-digit code sent to
                        </Label>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{email}</p>
                    </div>

                    <div className="flex justify-center py-2">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {otpError && (
                        <p className="text-center text-sm text-red-600 dark:text-red-400">{otpError}</p>
                    )}

                    <Button
                        size="xl"
                        type="submit"
                        disabled={verifyingOtp || otp.length < 6 || isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        {verifyingOtp || isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {verifyingOtp ? "Verifying..." : "Creating account..."}
                            </>
                        ) : (
                            "Verify code"
                        )}
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                        <button
                            type="button"
                            onClick={() => setStep("password")}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={sendingOtp}
                            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                        >
                            {sendingOtp ? "Resending..." : "Resend code"}
                        </button>
                    </div>
                </form>
            )}

            {errorMessage && (
                <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                </p>
            )}

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Log in
                </button>
            </p>
        </div>
    );
}

export default RegisterForm;