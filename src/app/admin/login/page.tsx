"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useAdminAuth } from "../../../lib/admin-auth-context";

export default function AdminLoginPage() {
  const { login, user, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin");
    }
  }, [user, loading, router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white border border-charcoal-100 p-10 shadow-card">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-12 h-12 bg-brand-orange flex items-center justify-center mb-6">
          <span className="font-poppins font-black text-white text-xl tracking-wider">A</span>
        </div>
        <h1 className="font-poppins font-light text-charcoal-900 text-2xl tracking-tight">Admin Portal</h1>
        <p className="text-[10px] text-charcoal-900 font-poppins font-medium tracking-widest uppercase mt-2">Ansary Footwear</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="text-[10px] font-poppins font-semibold text-charcoal-900 block mb-2 tracking-widest uppercase">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-charcoal-200 py-2 font-inter text-charcoal-900 placeholder-charcoal-300 focus:outline-none focus:border-brand-orange transition-colors bg-transparent"
            placeholder="admin@ansaribootthouse.com"
          />
        </div>
        <div>
          <label className="text-[10px] font-poppins font-semibold text-charcoal-900 block mb-2 tracking-widest uppercase">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-charcoal-200 py-2 font-inter text-charcoal-900 placeholder-charcoal-300 focus:outline-none focus:border-brand-orange transition-colors bg-transparent"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 text-xs text-red-600 font-inter">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-charcoal-900 text-white font-poppins font-bold text-xs uppercase tracking-widest py-4 hover:bg-brand-orange transition-colors disabled:opacity-50 mt-4"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

