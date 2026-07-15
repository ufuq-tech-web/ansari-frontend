"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, ShieldCheck, CheckCircle2, MessageSquare, AlertTriangle, Loader2 } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";

interface ReviewRow {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  verified: boolean;
  createdAt: string;
  product: { name: string } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get<ReviewRow[]>("/reviews/admin/all");
      setReviews(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    setActionId(id);
    try {
      await adminApi.patch(`/reviews/admin/${id}`, { verified: !currentStatus });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, verified: !currentStatus } : r))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update verification status.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setActionId(id);
    try {
      await adminApi.delete(`/reviews/admin/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete review.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Product Reviews
          </h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
            Moderate and verify customer reviews left on products
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-charcoal-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-charcoal-50/70 border-b border-charcoal-200/30 text-charcoal-400 font-poppins font-semibold text-xs tracking-wider uppercase">
              <tr>
                <th className="text-left px-6 py-4 w-52">Product</th>
                <th className="text-left px-6 py-4 w-44">Reviewer</th>
                <th className="text-left px-6 py-4 w-32">Rating</th>
                <th className="text-left px-6 py-4">Review Text</th>
                <th className="text-center px-6 py-4 w-32">Verified</th>
                <th className="text-right px-6 py-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">Loading reviews…</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-charcoal-400 font-inter">No reviews found</td></tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-charcoal-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-poppins font-bold text-charcoal-900 text-xs truncate max-w-[200px]" title={r.product?.name || "Unknown Product"}>
                        {r.product?.name || <span className="text-charcoal-350 italic">Deleted Product</span>}
                      </div>
                      <div className="text-[10px] text-charcoal-400 font-inter mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-poppins font-semibold text-charcoal-800 text-xs">{r.name}</div>
                      <div className="text-[10px] text-charcoal-400 font-inter mt-0.5">{r.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating ? "text-amber-500 fill-amber-500" : "text-charcoal-200 fill-charcoal-100"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-charcoal-600 font-inter leading-relaxed max-w-md line-clamp-2" title={r.text}>
                        {r.text}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleVerify(r.id, r.verified)}
                        disabled={actionId === r.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-poppins font-bold uppercase tracking-wider transition-all ${
                          r.verified
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-charcoal-100 text-charcoal-400 border-charcoal-200 hover:bg-charcoal-200"
                        }`}
                      >
                        {actionId === r.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-charcoal-400" />
                        ) : r.verified ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Unverified
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={actionId === r.id}
                        className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        aria-label="Delete review"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
