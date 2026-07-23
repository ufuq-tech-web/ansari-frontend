"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  BookOpen,
  ShoppingBag,
  Boxes,
  Users,
  Percent,
  Star,
  FileText,
  BarChart3,
  Settings,
  UserCheck,
  Upload
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: true },
  { href: "/admin/products/bulk", label: "Bulk Upload", icon: Upload },
  { href: "/admin/categories", label: "Categories", icon: Layers, exact: true },
  { href: "/admin/subcategories", label: "Subcategories", icon: Layers, exact: true },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Percent },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/guides", label: "Buying Guides", icon: BookOpen },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users & Roles", icon: UserCheck },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-charcoal-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-[100dvh] w-[264px] flex-shrink-0 flex flex-col bg-gradient-to-b from-charcoal-900 via-charcoal-850 to-charcoal-900 text-white border-r border-white/5 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:flex`}>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-leather-300 flex items-center justify-center shadow-lg shadow-brand-orange/30 select-none">
          <span className="font-poppins font-black text-white text-lg tracking-wider">A</span>
        </div>
        <div className="leading-tight">
          <div className="font-poppins font-bold text-base tracking-wide bg-gradient-to-r from-white to-charcoal-200 bg-clip-text text-transparent">Ansari</div>
          <div className="font-poppins font-semibold text-brand-orange text-[9px] tracking-widest uppercase -mt-0.5">Control Panel</div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-poppins font-medium text-sm transition-all duration-300 ${
                active 
                  ? "bg-gradient-to-r from-brand-orange to-orange-600 text-white shadow-md shadow-brand-orange/20 scale-[1.02]" 
                  : "text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-1"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? "text-white" : "text-white/50 group-hover:text-white"}`} strokeWidth={2} />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-white/5 bg-charcoal-900/50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/80 font-inter transition-all duration-200 hover:-translate-x-1"
        >
          <span>←</span> Back to storefront
        </Link>
      </div>
    </aside>
    </>
  );
}

