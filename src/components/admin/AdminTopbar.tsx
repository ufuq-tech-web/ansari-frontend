"use client";

import { LogOut, User, Menu } from "lucide-react";
import { useAdminAuth } from "../../lib/admin-auth-context";

export default function AdminTopbar({ title, onMenuClick }: { title?: string, onMenuClick?: () => void }) {
  const { user, logout } = useAdminAuth();

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-white/75 border-b border-charcoal-200/40 px-6 lg:px-8 py-4 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-charcoal-50 text-charcoal-600 hover:bg-brand-orange hover:text-white transition-all shadow-sm border border-charcoal-200/50"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
        <h1 className="font-poppins font-black text-charcoal-900 text-lg lg:text-xl tracking-tight bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-700 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-charcoal-50 border border-charcoal-200/30">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-orange to-orange-400 flex items-center justify-center text-[10px] font-poppins font-bold text-white shadow-sm shadow-brand-orange/10">
              {userInitials}
            </div>
            <span className="text-xs text-charcoal-700 font-poppins font-medium pr-1">
              {user.name}
            </span>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-brand-orange font-poppins font-bold px-3 py-2 rounded-xl hover:bg-brand-orange/5 transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
}

