"use client";

import { useEffect, useState } from "react";
import { UserCheck, Shield, Trash2, Mail, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import Select from "../../../components/admin/Select";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

const ROLE_OPTIONS = [
  { value: "CUSTOMER", label: "Customer" },
  { value: "ADMIN", label: "Administrator" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get<UserRow[]>("/users/admin/all");
      setUsers(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await adminApi.patch(`/users/admin/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setSuccessId(userId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Delete user account "${email}"? This will permanently wipe access.`)) return;
    setUpdatingId(userId);
    try {
      await adminApi.delete(`/users/admin/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user account.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Users & Roles
          </h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
            Delegate administrative access and oversee platform access privileges
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-charcoal-50/70 border-b border-charcoal-200/30 text-charcoal-400 font-poppins font-semibold text-xs tracking-wider uppercase">
              <tr>
                <th className="text-left px-6 py-4">User</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Member Since</th>
                <th className="text-left px-6 py-4 w-60">Role / Clearance</th>
                <th className="text-center px-6 py-4 w-24">Status</th>
                <th className="text-right px-6 py-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">Loading user roster…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">No users found</td></tr>
              ) : (
                users.map((u) => {
                  const initials = u.name
                    ? u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "?";
                  return (
                    <tr key={u.id} className="hover:bg-charcoal-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center text-xs font-poppins font-bold text-charcoal-600 border border-charcoal-200/40 shadow-sm flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-poppins font-bold text-charcoal-900 text-xs">{u.name}</div>
                            {u.role === "ADMIN" && (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-poppins font-bold uppercase tracking-wider bg-orange-500/10 text-brand-orange px-1.5 py-0.5 rounded-md mt-1">
                                <Shield className="w-2.5 h-2.5" /> Staff
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-xs text-charcoal-600 font-inter">
                          <Mail className="w-3.5 h-3.5 text-charcoal-400" /> {u.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-inter text-charcoal-500">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          value={u.role}
                          onChange={(v) => handleRoleChange(u.id, v)}
                          options={ROLE_OPTIONS}
                          className="w-48"
                          disabled={updatingId === u.id}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center min-h-10">
                          {updatingId === u.id && (
                            <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />
                          )}
                          {successId === u.id && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(u.id, u.email)}
                          disabled={updatingId === u.id}
                          className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          aria-label="Delete user account"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
