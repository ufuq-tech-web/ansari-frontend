"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../lib/auth-store";
import { customerApi, ApiError } from "../../lib/customer-api";
import GuestRoute from "../../components/auth/GuestRoute";

function OtpVerificationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const purpose = searchParams.get("purpose"); // "REGISTER_VERIFY" | "FORGOT_PASSWORD"
    const verifyRegistration = useAuthStore(state => state.verifyRegistration);

    const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const [cooldown, setCooldown] = useState(0);
    const otp = otpDigits.join("");

    useEffect(() => {
        if (!email || !purpose) {
            router.push("/login");
        }
    }, [email, purpose, router]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleResend = async () => {
        if (cooldown > 0) return;
        setError("");
        setSuccessMsg("");
        setOtpDigits(Array(6).fill(""));
        inputRefs.current[0]?.focus();
        try {
            await customerApi.post<{ message: string }>("/auth/resend-otp", { email, purpose });
            setSuccessMsg("A new code was sent to your email.");
            setCooldown(60);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to resend code.");
        }
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isNaN(Number(value))) return;

        // Ensure we only take the last character typed if they somehow enter more
        const digit = value.slice(-1);
        const newOtp = [...otpDigits];
        newOtp[index] = digit;
        setOtpDigits(newOtp);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pastedData) return;
        
        const digits = pastedData.split("");
        const newOtp = [...otpDigits];
        for (let i = 0; i < 6; i++) {
            newOtp[i] = digits[i] || "";
        }
        setOtpDigits(newOtp);
        
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !purpose || otp.length < 6) return;
        
        setError("");
        setSuccessMsg("");
        setSubmitting(true);
        try {
            if (purpose === "REGISTER_VERIFY") {
                await verifyRegistration(email, otp);
                router.push("/");
            } else if (purpose === "FORGOT_PASSWORD") {
                router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Wrong verification code.");
            setOtpDigits(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
                <div className="mb-8 text-center">
                    <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Enter Security Code</h1>
                    <p className="mt-2 text-sm text-charcoal-500 font-inter">
                        We sent a 6-digit code to <strong className="text-black">{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex justify-between items-center gap-2 sm:gap-3">
                        {otpDigits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-14 sm:w-14 sm:h-16 text-center font-poppins text-2xl font-bold text-black border border-charcoal-200 rounded-xl focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all shadow-sm"
                            />
                        ))}
                    </div>

                    {error && <p className="text-sm text-red-600 font-inter text-center">{error}</p>}
                    {successMsg && <p className="text-sm text-emerald-600 font-inter text-center">{successMsg}</p>}

                    <button
                        type="submit"
                        disabled={submitting || otp.length < 6}
                        className="mt-2 bg-brand-orange text-white font-poppins font-bold text-sm uppercase tracking-wider py-4 rounded-xl hover:bg-brand-orange-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                    >
                        {submitting ? "Verifying…" : "Submit"}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-charcoal-100">
                    <button 
                        onClick={handleResend}
                        disabled={cooldown > 0}
                        className={`text-sm font-inter transition-colors ${cooldown > 0 ? "text-charcoal-300" : "text-brand-orange hover:brand-orange-dark font-medium"}`}
                    >
                        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive the code? Resend"}
                    </button>
                    <p className="mt-4 text-xs text-charcoal-400">
                        <button onClick={() => router.push("/login")} className="hover:text-black transition-colors font-medium">Return to login</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OtpVerificationPage() {
    return (
        <GuestRoute>
            <Suspense fallback={null}>
                <OtpVerificationForm />
            </Suspense>
        </GuestRoute>
    );
}
