"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { customerApi, ApiError } from "../../lib/customer-api";
import GuestRoute from "../../components/auth/GuestRoute";

function ForgotPasswordForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await customerApi.post("/auth/forgot-password", { email });
            // Always redirect to protect against user enum, even if account doesn't exist
            router.push(`/otp-verification?email=${encodeURIComponent(email)}&purpose=FORGOT_PASSWORD`);
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
                    <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Reset Password</h1>
                    <p className="mt-1.5 text-sm text-charcoal-500 font-inter">Enter your email to receive a secure recovery code.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        required
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                    />

                    {error && <p className="text-sm text-red-600 font-inter">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 bg-brand-orange text-white font-poppins font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-60"
                    >
                        {submitting ? "Processing…" : "Send Recovery Code"}
                    </button>
                    
                    <button type="button" onClick={() => router.push("/login")} className="text-sm text-charcoal-500 hover:text-charcoal-900 font-inter py-2 transition-colors">
                        Back to Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <GuestRoute>
            <Suspense fallback={null}>
                <ForgotPasswordForm />
            </Suspense>
        </GuestRoute>
    );
}
