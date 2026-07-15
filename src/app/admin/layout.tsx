"use client";

import { AdminAuthProvider } from "../../lib/admin-auth-context";
import AdminShell from "../../components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
