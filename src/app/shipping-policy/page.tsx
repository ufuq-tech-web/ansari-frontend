import Link from 'next/link';
import { Truck, Package, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Shipping Policy — Ansary Footwear',
  description: 'Free shipping on orders above ₹999, Cash on Delivery available, and typical delivery timelines for Ansary Footwear orders across India.',
  alternates: { canonical: '/shipping-policy' },
};

const highlights = [
  { icon: Truck, title: 'Free Shipping', text: 'Free on all orders above ₹999. Orders below that ship for a flat ₹99.' },
  { icon: Package, title: 'Cash on Delivery', text: 'COD is available on all orders across India, no minimum order value required.' },
  { icon: Clock, title: 'Processing Time', text: 'Orders are packed and handed to our courier partner within 1-2 business days of confirmation.' },
  { icon: MapPin, title: 'Pan-India Delivery', text: 'We currently ship to all serviceable pin codes across India via our logistics partners.' },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Shipping policy hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Shipping Policy</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Shipping Info</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Free shipping over ₹999, Cash on Delivery, and delivery across India.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-14 max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {highlights.map((h) => (
            <div key={h.title} className="bg-white rounded-2xl border border-charcoal-200 p-5 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <h.icon className="w-5 h-5 text-brand-orange" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm mb-1">{h.title}</h3>
                <p className="text-sm text-charcoal-500 font-inter leading-relaxed">{h.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-5 text-charcoal-700 font-inter leading-relaxed">
          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Delivery Timelines</h2>
          <p>
            Most orders arrive within 4-6 business days of dispatch for metro cities, and 6-9 business days for
            other locations. Delivery estimates shown at checkout and on product pages are based on your pincode
            and current stock availability.
          </p>
          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Order Tracking</h2>
          <p>
            Once your order ships, you'll be able to follow its status from the{' '}
            <Link href="/track-order" className="text-brand-orange hover:underline">Track Order</Link> page using
            your order number, or from{' '}
            <Link href="/orders" className="text-brand-orange hover:underline">My Orders</Link> if you're on the
            same device you ordered from.
          </p>
          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Shipping Charges</h2>
          <p>
            We charge a flat ₹99 shipping fee on orders under ₹999. There are no hidden charges added at checkout —
            the total you see in your cart is what you pay, plus COD charges only if you choose Cash on Delivery
            on select high-value orders.
          </p>
          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Delays & Exceptions</h2>
          <p>
            Deliveries may occasionally take longer during festive seasons, extreme weather, or in remote areas
            with limited courier coverage. We'll always notify you if your order is expected to take longer than
            the standard timeline.
          </p>
        </div>
      </div>
    </div>
  );
}
