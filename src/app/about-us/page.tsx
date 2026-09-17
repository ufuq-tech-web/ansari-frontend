import Link from 'next/link';
import { ShieldCheck, Heart, Users, Truck } from 'lucide-react';

export const metadata = {
  title: 'About Us — Ansary Footwear',
  description: 'Ansary Footwear has been serving families across India with quality, affordable footwear for over 25 years. Learn our story.',
  alternates: { canonical: '/about-us' },
};

const values = [
  { icon: ShieldCheck, title: 'Quality First', text: 'Every pair is checked for stitching, sole grip, and material quality before it reaches a shelf — a habit from our earliest days that never changed.' },
  { icon: Heart, title: 'Affordable for Every Family', text: 'Footwear is a necessity, not a luxury. We keep margins honest so a family of four can shoe everyone without a second thought.' },
  { icon: Users, title: 'Serving Every Age', text: "From a toddler's first walking shoes to formal wear for a father's retirement, we stock for every stage of life under one roof." },
  { icon: Truck, title: 'Reliable, Every Time', text: "COD, easy 7-day returns, and free shipping over ₹999 — the same promises we've built our reputation on since day one." },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="About us hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">About Us</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-bold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight">Quality Footwear for Every Step of Life</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            25+ years of trusted retail experience, serving families across India.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-14 max-w-3xl">
        <div className="prose-content space-y-5 text-charcoal-700 font-inter leading-relaxed">
          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Our Story</h2>
          <p>
            Ansary Footwear started as a single family-run footwear shop on Fashion Street, Mumbai, at a time when
            buying a good pair of shoes meant trusting the shopkeeper to tell you the truth about fit, material, and
            durability — not just make a sale. That principle is still the one thing we've refused to compromise on
            as the business has grown.
          </p>
          <p>
            Over the past 25 years, we've grown from that one storefront into a footwear destination for men, women,
            kids, and everything in between — formal shoes for the office, school shoes that survive a full term of
            playground use, festive sandals for wedding season, and the shoe-care essentials that make a good pair
            last even longer.
          </p>
          <p>
            What hasn't changed is who we're building this for: families who want footwear that's honestly priced,
            genuinely durable, and backed by a store that stands behind what it sells. That's the same promise our
            founders made across the counter two and a half decades ago, and it's the one we're carrying online today.
          </p>
        </div>

        <h2 className="font-poppins font-bold text-charcoal-900 text-2xl mt-12 mb-6">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl border border-charcoal-200 p-5 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                <v.icon className="w-5 h-5 text-brand-orange" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm mb-1">{v.title}</h3>
                <p className="text-sm text-charcoal-500 font-inter leading-relaxed">{v.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-charcoal-900 rounded-2xl p-8 text-center">
          <h2 className="font-poppins font-bold text-white text-xl mb-2">Have a question for us?</h2>
          <p className="text-white/70 font-inter text-sm mb-5">We're always happy to help you find the right pair.</p>
          <Link href="/contact-us" className="btn-primary inline-flex">Get in Touch</Link>
        </div>
      </div>
    </div>
  );
}
