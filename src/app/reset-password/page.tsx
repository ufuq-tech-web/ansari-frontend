"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { customerApi, ApiError } from "../../lib/customer-api";
import GuestRoute from "../../components/auth/GuestRoute";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!email || !otp) {
            router.push("/login");
        }
    }, [email, otp, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await customerApi.post("/auth/reset-password", { email, otp, newPassword: password });
            router.push("/login?redirect=/my-account");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all";

    return (
        <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
                <div className="mb-6 text-center">
                    <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Choose New Password</h1>
                    <p className="mt-1.5 text-sm text-charcoal-500 font-inter">Almost there! Choose a strong new password.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        required
                        type="password"
                        minLength={8}
                        placeholder="New Password (min 8 char)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                    />
                    
                    <input
                        required
                        type="password"
                        minLength={8}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClass}
                    />

                    {error && <p className="text-sm text-red-600 font-inter">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 bg-brand-orange text-white font-poppins font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-60"
                    >
                        {submitting ? "Updating…" : "Update Password"}
                    </button>
                    
                    <div className="mt-4 text-center">
                        <button type="button" onClick={() => router.push("/login")} className="text-sm text-charcoal-500 hover:text-charcoal-900 font-inter">
                            Cancel & Return to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <GuestRoute>
            <Suspense fallback={null}>
                <ResetPasswordForm />
            </Suspense>
        </GuestRoute>
    );
}
