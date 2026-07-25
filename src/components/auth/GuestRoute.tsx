"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../lib/auth-context";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            const redirect = searchParams.get("redirect") || "/my-account";
            router.replace(redirect);
        }
    }, [loading, isAuthenticated, router, searchParams]);

    if (loading || isAuthenticated) {
        return (
            <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-charcoal-200 border-t-brand-orange animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
