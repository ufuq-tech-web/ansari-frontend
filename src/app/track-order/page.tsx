"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, PackageSearch, ArrowRight } from "lucide-react";
import { getOrder } from "../../lib/orders";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = orderNumber.trim();
    if (!trimmed) return;

    const order = await getOrder(trimmed);
    if (order) {
      router.push(`/orders/${order.orderNumber}`);
    } else {
      setError("We couldn't find an order with that number on your account. Double-check the number from your confirmation email, or view your full order history below.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Track order hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Track Order</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Track Your Order</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Enter your order number to check its current status and delivery progress.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-card border border-charcoal-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
              <PackageSearch className="w-5 h-5 text-brand-orange" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-poppins font-bold text-charcoal-900 text-lg">Find Your Order</h2>
              <p className="text-xs text-charcoal-400 font-inter">You'll find your order number in your confirmation email, formatted like ord-xxxxxxxx.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" strokeWidth={2} />
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => { setOrderNumber(e.target.value); setError(null); }}
                placeholder="e.g. ord-m3x8f9a2b7"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Track Order <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-brand-orange font-inter leading-relaxed">{error}</p>
          )}

          <div className="mt-6 pt-6 border-t border-charcoal-200 text-center">
            <p className="text-sm text-charcoal-500 font-inter mb-2">Prefer to browse instead?</p>
            <Link href="/orders" className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all">
              View All My Orders <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="max-w-lg mx-auto mt-8 grid sm:grid-cols-2 gap-4 text-sm font-inter text-charcoal-600">
          <div className="bg-white rounded-xl border border-charcoal-200 p-4">
            <p className="font-poppins font-semibold text-charcoal-900 mb-1 text-sm">Order not showing up?</p>
            <p className="text-xs leading-relaxed">You'll need to be signed in to the account you placed the order with to look it up.</p>
          </div>
          <div className="bg-white rounded-xl border border-charcoal-200 p-4">
            <p className="font-poppins font-semibold text-charcoal-900 mb-1 text-sm">Need more help?</p>
            <p className="text-xs leading-relaxed">
              Reach our support team any time at{" "}
              <Link href="/contact-us" className="text-brand-orange hover:underline">Contact Us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
