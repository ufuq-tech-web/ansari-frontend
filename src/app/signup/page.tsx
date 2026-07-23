"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import { ApiError } from "../../lib/customer-api";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/my-account";
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await register(email, password, name, phone || undefined);
            router.push(redirectTo);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-charcoal-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all";

    return (
        <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
                <div className="mb-6 text-center">
                    <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Create Your Account</h1>
                    <p className="mt-1.5 text-sm text-charcoal-500 font-inter">Join Ansari Boot House for faster checkout and order tracking</p>
                </div>

                <div className="mb-5">
                    <GoogleAuthButton />
                </div>

                <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-charcoal-200" />
                    <span className="text-xs text-charcoal-400 font-inter uppercase tracking-wide">or</span>
                    <div className="h-px flex-1 bg-charcoal-200" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        required
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                    />
                    <input
                        required
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                    />
                    <input
                        placeholder="Phone number (optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                    />
                    <input
                        required
                        type="password"
                        minLength={8}
                        placeholder="Password (min. 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                    />

                    {error && <p className="text-sm text-red-600 font-inter">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 bg-brand-orange text-white font-poppins font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-60"
                    >
                        {submitting ? "Creating account…" : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-charcoal-500 font-inter">
                    Already have an account?{" "}
                    <Link
                        href={`/login${redirectTo !== "/my-account" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="text-brand-orange font-semibold hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
                <p className="mt-4 text-center text-xs text-charcoal-400">
                    <Link href="/" className="hover:text-brand-orange transition-colors">Back to Home</Link>
                </p>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={null}>
            <SignupForm />
        </Suspense>
    );
}
