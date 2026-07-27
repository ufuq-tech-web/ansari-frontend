"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../lib/auth-store";
import { toast } from "react-hot-toast";

export default function GoogleAuthButton() {
  const googleLoginAction = useAuthStore(state => state.googleLogin);
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        await googleLoginAction(tokenResponse.access_token);
        // Page redirect will be handled by GuestRoute wrapper when auth state updates
      } catch (err: any) {
        toast.error(err.message || "Failed to login with Google");
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login rejected or failed.");
      setLoading(false);
    }
  });

  const handleClick = () => {
    if (loading) return;
    login();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-charcoal-200 bg-white font-poppins font-semibold text-sm text-charcoal-700 hover:bg-charcoal-50 hover:border-charcoal-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-charcoal-200 border-t-brand-orange rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.91c1.7-1.57 2.69-3.88 2.69-6.64z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.27c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.34C2.44 15.98 5.48 18 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.96H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.04l2.99-2.34z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.99 2.34C4.66 5.16 6.65 3.58 9 3.58z" />
          </svg>
        )}
        Continue with Google
      </button>
    </div>
  );
}
