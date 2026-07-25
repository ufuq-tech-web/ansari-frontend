"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth-context";

export default function ProtectedRoute({ 
    children, 
    adminOnly = false 
}: { 
    children: React.ReactNode;
    adminOnly?: boolean;
}) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
            } else if (adminOnly && user?.role !== "ADMIN") {
                router.replace("/");
            }
        }
    }, [loading, isAuthenticated, user, router, adminOnly, pathname]);

    if (loading || !isAuthenticated || (adminOnly && user?.role !== "ADMIN")) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-charcoal-200 border-t-brand-orange animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
