"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "../../lib/admin-auth-context";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/brands": "Brands",
  "/admin/guides": "Buying Guides",
  "/admin/orders": "Orders",
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) router.replace("/admin/login");
  }, [loading, user, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0b0f19] relative flex items-center justify-center p-4 overflow-hidden">
        {/* Modern glowing ambient blobs for login screen */}
        <div className="absolute top-[15%] left-[15%] w-80 h-80 rounded-full bg-brand-orange/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[15%] w-96 h-96 rounded-full bg-leather-300/10 blur-[120px] animate-pulse [animation-duration:6s]" />
        <div className="relative z-10 w-full max-w-sm flex justify-center">
          {children}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-charcoal-400 font-inter text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
          <span className="font-poppins font-semibold text-xs tracking-wider text-charcoal-400 uppercase">Loading Panel…</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const matchedTitle = Object.entries(PAGE_TITLES).find(([path]) => (path === "/admin" ? pathname === path : pathname?.startsWith(path)));

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[20%] w-[35%] h-[35%] rounded-full bg-brand-orange/[0.025] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[45%] rounded-full bg-leather-300/[0.035] blur-[150px] pointer-events-none" />

      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <AdminTopbar title={matchedTitle?.[1] ?? "Admin"} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

