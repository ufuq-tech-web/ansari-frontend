"use client";

import { Suspense, useState, useEffect } from "react";
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

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const [cooldown, setCooldown] = useState(0);

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
        try {
            await customerApi.post<{ message: string }>("/auth/resend-otp", { email, purpose });
            setSuccessMsg("A new code was sent to your email.");
            setCooldown(60);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to resend code.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !purpose) return;
        
        setError("");
        setSuccessMsg("");
        setSubmitting(true);
        try {
            if (purpose === "REGISTER_VERIFY") {
                await verifyRegistration(email, otp);
                router.push("/");
            } else if (purpose === "FORGOT_PASSWORD") {
                // If it's forgot password, we don't 'verify' logically returning tokens,
                // We just pass it forward to the reset-password page for final combination.
                router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Wrong verification code.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all text-center font-bold text-2xl tracking-[0.5em] uppercase";

    return (
        <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
                <div className="mb-6 text-center">
                    <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Enter Security Code</h1>
                    <p className="mt-1.5 text-sm text-charcoal-500 font-inter">
                        We sent a 6-digit code to <strong className="text-charcoal-900">{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        required
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={inputClass}
                    />

                    {error && <p className="text-sm text-red-600 font-inter text-center">{error}</p>}
                    {successMsg && <p className="text-sm text-green-600 font-inter text-center">{successMsg}</p>}

                    <button
                        type="submit"
                        disabled={submitting || otp.length < 6}
                        className="mt-2 bg-brand-orange text-white font-poppins font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-60"
                    >
                        {submitting ? "Verifying…" : "Submit"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={handleResend}
                        disabled={cooldown > 0}
                        className={`text-sm font-inter transition-colors ${cooldown > 0 ? "text-charcoal-300" : "text-brand-orange hover:underline font-semibold"}`}
                    >
                        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't receive the code? Resend"}
                    </button>
                    <p className="mt-4 text-xs text-charcoal-400">
                        <button onClick={() => router.push("/login")} className="hover:text-brand-orange transition-colors">Return to login</button>
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
