"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import { toast } from "react-hot-toast";
import { ApiError } from "../../lib/customer-api";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";
import GuestRoute from "../../components/auth/GuestRoute";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/my-account";
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ general?: string; email?: string; password?: string }>({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        try {
            await login(email, password);
            router.push(redirectTo);
        } catch (err) {
            const errMsg = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
            
            if (err instanceof ApiError && err.status === 401) {
                if (errMsg.includes("verify")) {
                    setErrors({ email: errMsg });
                    toast.error("Please verify your email to log in.");
                } else if (errMsg === "Invalid email or password") {
                    // Show for both fields + general so the user clearly sees they just mismatched credentials
                    setErrors({ email: "", password: "", general: errMsg });
                } else {
                    setErrors({ general: errMsg });
                }
            } else if (err instanceof ApiError && err.status === 500) {
                toast.error("Server error. Please try again later.");
            } else {
                setErrors({ general: errMsg });
                toast.error(errMsg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getInputClass = (hasError?: boolean) => `w-full px-4 py-3 rounded-xl border ${hasError ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20' : 'border-charcoal-200 focus:border-brand-orange focus:ring-brand-orange/20'} focus:ring-2 outline-none font-inter text-charcoal-900 placeholder:text-charcoal-400 transition-all`;

    return (
        <div className="min-h-screen bg-brand-ivory flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8">
                <div className="mb-6 text-center">
                    <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Welcome Back</h1>
                    <p className="mt-1.5 text-sm text-charcoal-500 font-inter">Sign in to your Ansari Boot House account</p>
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
                    <div>
                        <input
                            required
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: undefined})) }}
                            className={getInputClass(!!errors.email)}
                        />
                        {errors.email && <p className="mt-1.5 text-xs text-red-500 font-inter">{errors.email}</p>}
                    </div>
                    
                    <div>
                        <input
                            required
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: undefined})) }}
                            className={getInputClass(!!errors.password)}
                        />
                        {errors.password && <p className="mt-1.5 text-xs text-red-500 font-inter">{errors.password}</p>}
                        <div className="text-right mt-2">
                            <button type="button" onClick={() => router.push("/forgot-password")} className="text-xs text-brand-orange hover:underline font-inter">
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    {errors.general && <p className="text-sm text-red-600 font-inter text-center bg-red-50 py-2 rounded-lg">{errors.general}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 bg-brand-orange text-white font-poppins font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-60"
                    >
                        {submitting ? "Signing In…" : "Sign In"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-charcoal-500 font-inter">
                    New to Ansari Boot House?{" "}
                    <Link
                        href={`/signup${redirectTo !== "/my-account" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="text-brand-orange font-semibold hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
                <p className="mt-4 text-center text-xs text-charcoal-400">
                    <Link href="/" className="hover:text-brand-orange transition-colors">Back to Home</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <GuestRoute>
            <Suspense fallback={null}>
                <LoginForm />
            </Suspense>
        </GuestRoute>
    );
}
