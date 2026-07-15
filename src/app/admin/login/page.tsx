"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useAdminAuth } from "../../../lib/admin-auth-context";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
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
    <div className="w-full max-w-sm backdrop-blur-xl bg-charcoal-900/40 border border-white/10 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-orange to-orange-400 flex items-center justify-center mb-4 shadow-lg shadow-brand-orange/25 select-none">
          <span className="font-poppins font-black text-white text-xl tracking-wider">A</span>
        </div>
        <h1 className="font-poppins font-extrabold text-white text-xl tracking-tight">Admin Portal</h1>
        <p className="text-xs text-charcoal-400 font-poppins font-medium tracking-wide uppercase mt-1">Ansari Boot House</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-poppins font-semibold text-charcoal-300 block mb-1.5 tracking-wide uppercase">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/25 border border-white/10 text-sm font-inter text-white placeholder-charcoal-500 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
            placeholder="admin@ansaribootthouse.com"
          />
        </div>
        <div>
          <label className="text-xs font-poppins font-semibold text-charcoal-300 block mb-1.5 tracking-wide uppercase">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/25 border border-white/10 text-sm font-inter text-white placeholder-charcoal-500 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="px-3.5 py-2.5 rounded-xl bg-red-950/30 border border-red-500/20 text-xs text-red-400 font-inter">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-orange to-orange-600 text-white font-poppins font-bold text-sm py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-brand-orange/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" strokeWidth={2.5} />
          <span>{submitting ? "Signing in…" : "Sign In"}</span>
        </button>
      </form>
    </div>
  );
}

