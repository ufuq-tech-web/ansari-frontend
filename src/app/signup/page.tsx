"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../lib/auth-store";
import { ApiError } from "../../lib/customer-api";
import GuestRoute from "../../components/auth/GuestRoute";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const register = useAuthStore(state => state.register);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ general?: string; name?: string; email?: string; password?: string; confirmPassword?: string }>({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);
        
        let hasErrors = false;
        const newErrors: Record<string, string> = {};

        if (!password) {
            newErrors.password = "Password is required.";
            hasErrors = true;
        } else {
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passRegex.test(password)) {
                newErrors.password = "Password does not meet the strict security requirements.";
                hasErrors = true;
            }
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            setSubmitting(false);
            return;
        }

        try {
            const res = await register(email, password, name, undefined);
            if (res.requiresVerification) {
                router.push(`/otp-verification?email=${encodeURIComponent(email)}&purpose=REGISTER_VERIFY&redirect=${encodeURIComponent(redirectTo)}`);
            } else {
                router.push(redirectTo);
            }
        } catch (err) {
            const errMsg = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
            
            if (err instanceof ApiError && err.status === 400) {
                // Backend class-validator sends arrays joined by a comma (handled in customerApiFetch)
                const parts = errMsg.split(",");
                const newErrs: Record<string, string> = {};
                parts.forEach(p => {
                    const l = p.toLowerCase();
                    if (l.includes("email")) newErrs.email = p.trim();
                    else if (l.includes("password")) newErrs.password = p.trim();
                    else if (l.includes("name") || l.includes("string")) newErrs.name = p.trim();
                });
                setErrors(Object.keys(newErrs).length > 0 ? newErrs : { general: errMsg });
                toast.error("Please ensure all fields are filled out correctly.");
            } else if (errMsg === "An account with this email already exists") {
                setErrors({ email: errMsg });
                toast.error("This email is already in use.");
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
                    <h1 className="font-poppins font-extrabold text-charcoal-900 text-2xl">Create Your Account</h1>
                    <p className="mt-1.5 text-sm text-charcoal-500 font-inter">Join Ansari Boot House for faster checkout and order tracking</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <input
                            required
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({...p, name: undefined})) }}
                            className={getInputClass(!!errors.name)}
                        />
                        {errors.name && <p className="mt-1.5 text-xs text-red-500 font-inter">{errors.name}</p>}
                    </div>

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
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: undefined})) }}
                            className={getInputClass(!!errors.password)}
                        />
                        {errors.password && <p className="mt-1.5 text-xs text-red-500 font-inter">{errors.password}</p>}
                        
                        <ul className="mt-2 text-[10px] text-charcoal-400 font-inter space-y-1 ml-1">
                            <li className={password.length >= 8 ? "text-emerald-500 font-medium" : ""}>
                                • Minimum 8 characters
                            </li>
                            <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-emerald-500 font-medium" : ""}>
                                • Both uppercase & lowercase letters
                            </li>
                            <li className={/\d/.test(password) ? "text-emerald-500 font-medium" : ""}>
                                • At least one number (0-9)
                            </li>
                            <li className={/[@$!%*?&]/.test(password) ? "text-emerald-500 font-medium" : ""}>
                                • At least one special symbol (@$!%*?&)
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <input
                            required
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({...p, confirmPassword: undefined})) }}
                            className={getInputClass(!!errors.confirmPassword)}
                        />
                        {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 font-inter">{errors.confirmPassword}</p>}
                    </div>

                    {errors.general && <p className="text-sm text-red-600 font-inter text-center bg-red-50 py-2 rounded-lg">{errors.general}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 bg-brand-orange text-white font-poppins font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-60"
                    >
                        {submitting ? "Processing…" : "Create Account"}
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
        <GuestRoute>
            <Suspense fallback={null}>
                <SignupForm />
            </Suspense>
        </GuestRoute>
    );
}
