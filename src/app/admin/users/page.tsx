"use client";

import { useEffect, useState, useRef } from "react";
import { UserCheck, Shield, Mail, Loader2, CheckCircle2, Search } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import Pagination from "../../../components/shared/Pagination";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [blockingUser, setBlockingUser] = useState<{ id: string; email: string; isBlocked: boolean } | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const load = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ 
        page: page.toString(), 
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch })
      });
      const res = await adminApi.get<{ users: UserRow[]; total: number }>(`/users/admin/all?${qs}`);
      setUsers(res.users);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, debouncedSearch]);

  const handleToggleBlock = async () => {
    if (!blockingUser) return;
    setUpdatingId(blockingUser.id);
    try {
      const newStatus = !blockingUser.isBlocked;
      await adminApi.patch(`/users/admin/${blockingUser.id}`, { isBlocked: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === blockingUser.id ? { ...u, isBlocked: newStatus } : u))
      );
      setSuccessId(blockingUser.id);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to update user status.");
    } finally {
      setUpdatingId(null);
      setBlockingUser(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Users
          </h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
            Delegate administrative access and oversee platform access privileges
          </p>
        </div>
        
        <div className="flex-1 w-full md:max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-charcoal-400 group-focus-within:text-brand-orange transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-white border border-charcoal-200/60 rounded-xl py-2.5 pl-10 pr-4 text-sm font-inter text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all shadow-sm"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-charcoal-50/70 border-b border-charcoal-200/30 text-black font-poppins font-semibold text-xs tracking-wider uppercase">
              <tr>
                <th className="text-left px-6 py-4">User</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Member Since</th>
                <th className="text-left px-6 py-4 w-40">Status</th>
                <th className="text-right px-6 py-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-charcoal-400 font-inter">Loading user roster…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-charcoal-400 font-inter">No users found</td></tr>
              ) : (
                users.map((u) => {
                  const initials = u.name
                    ? u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "?";
                  return (
                    <tr key={u.id} className="hover:bg-charcoal-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center text-sm font-poppins font-black text-black border border-charcoal-200/40 shadow-sm flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-poppins font-bold text-black text-sm pr-2">{u.name}</div>
                            {u.role === "ADMIN" && (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-poppins font-bold uppercase tracking-wider bg-orange-500/10 text-brand-orange px-1.5 py-0.5 rounded-md mt-1">
                                <Shield className="w-2.5 h-2.5" /> Staff
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-sm text-black font-inter">
                          <Mail className="w-4 h-4 text-charcoal-800" /> {u.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-inter text-black font-medium">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-poppins font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-poppins font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end min-h-10 gap-2 relative">
                          <button
                            onClick={() => setBlockingUser({ id: u.id, email: u.email, isBlocked: u.isBlocked })}
                            disabled={updatingId === u.id || u.role === "ADMIN"}
                            className={`px-3 py-1.5 rounded-lg text-xs font-poppins font-semibold transition-all ${
                              u.isBlocked
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            } ${u.role === "ADMIN" ? "opacity-50 cursor-not-allowed hidden" : ""}`}
                          >
                            {u.isBlocked ? "Unblock" : "Block"}
                          </button>
                          {updatingId === u.id && (
                            <Loader2 className="w-4 h-4 animate-spin text-brand-orange absolute -left-6" />
                          )}
                          {successId === u.id && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute -left-6 animate-bounce" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Pagination 
          currentPage={page} 
          totalItems={totalItems} 
          pageSize={limit}
          onPageChange={setPage} 
        />
      </div>

      {/* Confirmation Modal */}
      {blockingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl mt-16 scale-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-poppins font-bold text-charcoal-900 text-lg mb-2">
              {blockingUser.isBlocked ? "Unblock User?" : "Block User?"}
            </h3>
            <p className="text-sm font-inter text-charcoal-600 mb-6">
              {blockingUser.isBlocked
                ? `Are you sure you want to restore access for ${blockingUser.email}? They will be able to log in again.`
                : `Are you sure you want to block ${blockingUser.email}? They will be instantly logged out and unable to log back in.`}
            </p>
            <div className="flex items-center justify-end gap-3 font-poppins font-semibold text-sm">
              <button
                onClick={() => setBlockingUser(null)}
                className="px-4 py-2 rounded-xl text-charcoal-600 hover:bg-charcoal-50 transition-colors"
                disabled={updatingId !== null}
              >
                Cancel
              </button>
              <button
                onClick={handleToggleBlock}
                disabled={updatingId !== null}
                className={`px-4 py-2 rounded-xl text-white transition-colors flex items-center gap-2 ${
                  blockingUser.isBlocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updatingId ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {blockingUser.isBlocked ? "Yes, Unblock" : "Yes, Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
