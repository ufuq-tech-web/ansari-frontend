"use client";

import { useState, type FocusEvent } from "react";

// Owns every UI-toggle state the Header needs — which mega-menu column is
// open, the mobile drawer, the search bar — so Header.tsx's JSX calls named
// handlers instead of inline arrow functions with logic in them.
export function useHeaderMenus() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openMegaMenu = (label: string) => setOpenMenu(label);
  const closeMegaMenu = () => setOpenMenu(null);
  const handleMegaMenuBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
  };

  const openMobileMenu = () => setMobileOpen(true);
  const closeMobileMenu = () => setMobileOpen(false);

  const toggleSearch = () => setSearchOpen((v) => !v);

  return {
    openMenu, openMegaMenu, closeMegaMenu, handleMegaMenuBlur,
    mobileOpen, openMobileMenu, closeMobileMenu,
    searchOpen, toggleSearch,
  };
}
