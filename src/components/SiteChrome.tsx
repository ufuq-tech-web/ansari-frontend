"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import StickyCta from "./StickyCta";

// Admin routes render their own shell (sidebar + topbar) — skip the
// storefront's header/footer/announcement bar there instead of nesting them.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/login" || 
                     pathname === "/signup" || 
                     pathname === "/forgot-password" || 
                     pathname === "/reset-password" || 
                     pathname === "/otp-verification";

  if (isAdmin || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-ivory font-inter text-charcoal-900 pb-32 lg:pb-20">
      <AnnouncementBar />
      <Header />
      {children}
      <Footer />
      <MobileBottomNav />
      <StickyCta />
    </div>
  );
}
