import type { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/return-exchange`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  const title = seoTitle || "Returns & Exchanges | Ansari Footwear";
  const description =
    seoDesc ||
    "Learn about Ansari Footwear’s returns and exchanges process, eligibility requirements and steps for requesting a return or product exchange.";
  const canonicalUrl = "https://www.ansarifootwear.com/returns-exchanges/";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
  };
}

const steps = [
  { step: '1', title: 'Request a return', text: 'Go to My Orders, select the item, and choose Return or Exchange — no login required if you have your order number from Track Order.' },
  { step: '2', title: 'Pack it up', text: 'Place the shoes back in their original box with tags attached, inside the original shipping packaging if possible.' },
  { step: '3', title: 'Hand it over', text: 'Our pickup partner collects the package from your address, or you can drop it at any of our stores.' },
  { step: '4', title: 'Get refunded or exchanged', text: 'Refunds are processed within 5-7 business days of pickup. Exchanges ship out as soon as the original item is picked up.' },
];

const eligible = [
  'Unworn shoes with original tags attached',
  'Original box and packaging included',
  'Requested within 7 days of delivery',
  'No signs of wear on the sole or upper',
];

const notEligible = [
  'Worn or visibly used footwear',
  'Items without original packaging or tags',
  'Returns requested after 7 days from delivery',
  'Shoe care/accessory items that have been opened or used',
];

export default async function ReturnExchangePage() {
  let seo = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/seo/return-exchange`, { next: { revalidate: 60 } });
    if (res.ok) seo = await res.json();
  } catch (err) {}

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Returns and exchanges hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Returns & Exchanges</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight">Returns & Exchanges</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            {seo?.description || "Learn about Ansari Footwear’s returns and exchanges process, eligibility requirements and steps for requesting a return or product exchange."}
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-14 max-w-3xl">
        <h2 className="font-poppins font-bold text-charcoal-900 text-2xl mb-6">How It Works</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {steps.map((s) => (
            <div key={s.step} className="bg-white rounded-2xl border border-charcoal-200 p-5 flex gap-4">
              <div className="w-9 h-9 rounded-full bg-brand-orange text-white font-poppins font-bold text-sm flex items-center justify-center flex-shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm mb-1">{s.title}</h3>
                <p className="text-sm text-charcoal-500 font-inter leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div>
            <h3 className="font-poppins font-semibold text-charcoal-900 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-brand-green" strokeWidth={2} /> Eligible for Return
            </h3>
            <ul className="space-y-2">
              {eligible.map((item) => (
                <li key={item} className="text-sm text-charcoal-600 font-inter flex items-start gap-2">
                  <span className="text-brand-green mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-charcoal-900 flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-500" strokeWidth={2} /> Not Eligible
            </h3>
            <ul className="space-y-2">
              {notEligible.map((item) => (
                <li key={item} className="text-sm text-charcoal-600 font-inter flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5 text-charcoal-700 font-inter leading-relaxed">
          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Refunds</h2>
          <p>
            Once we receive and inspect your returned item, refunds are issued to your original payment method
            within 5-7 business days. Cash on Delivery orders are refunded via bank transfer or store credit —
            you'll be asked for your preference when the return is picked up.
          </p>
          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Exchanges</h2>
          <p>
            Need a different size or color instead of a refund? Select "Exchange" when starting your return and
            choose the replacement item. We'll ship the new pair as soon as the original is picked up, so you're
            not left waiting on a refund to place a fresh order.
          </p>
          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Damaged or Incorrect Items</h2>
          <p>
            If an item arrives damaged or isn't what you ordered, contact us within 48 hours of delivery and we'll
            arrange a free replacement or full refund — no need to cover return shipping in that case.
          </p>
        </div>

        <div className="mt-12 bg-charcoal-900 rounded-2xl p-8 text-center">
          <RefreshCw className="w-8 h-8 text-brand-orange mx-auto mb-3" strokeWidth={2} />
          <h2 className="font-poppins font-bold text-white text-xl mb-2">Ready to start a return?</h2>
          <p className="text-white/70 font-inter text-sm mb-5">Find your order and begin the process in a couple of clicks.</p>
          <Link href="/order-tracking" className="btn-primary inline-flex">Track My Order <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}
