"use client";

import Link from 'next/link';
import {
  Truck, RefreshCw, ShieldCheck, CreditCard,
  Facebook, Instagram, Twitter, Youtube,
  MapPin, Phone, Mail,
} from 'lucide-react';

const trustBadges = [
  { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹999' },
  { icon: RefreshCw, label: 'Easy Returns', sub: '7-day return policy' },
  { icon: ShieldCheck, label: 'Secure Payments', sub: '100% protected checkout' },
  { icon: CreditCard, label: 'COD Available', sub: 'Pay when you receive' },
];

// href omitted = page doesn't exist yet, rendered as plain (non-broken) text instead of a dead link.
const footerColumns: { title: string; links: { label: string; href?: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', href: '/men' },
      { label: 'Women', href: '/women' },
      { label: 'Kids', href: '/kids' },
      { label: 'Accessories', href: '/accessories' },
      { label: 'Collections', href: '/collections' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Sale', href: '/sale' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Contact Us', href: '/contact-us' },
      { label: 'Order Tracking', href: '/track-order' },
      { label: 'Shipping Info', href: '/shipping-policy' },
      { label: 'Returns & Exchanges', href: '/return-exchange' },
      { label: 'Size Guide' },
      { label: 'FAQs', href: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Our Story', href: '/about-us' },
      { label: 'Store Locator' },
      { label: 'Careers' },
      { label: 'Journal', href: '/journal' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
  },
];

const socials = [
  { icon: Facebook, label: 'Facebook', href: '#facebook' },
  { icon: Instagram, label: 'Instagram', href: '#instagram' },
  { icon: Twitter, label: 'Twitter', href: '#twitter' },
  { icon: Youtube, label: 'YouTube', href: '#youtube' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white">
      {/* Trust badges strip */}
      <div className="border-b border-charcoal-700">
        <div className="container-main py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-charcoal-700 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-brand-orange" strokeWidth={2} />
                </div>
                <div>
                  <div className="font-poppins font-semibold text-sm">{b.label}</div>
                  <div className="text-xs text-white font-inter">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-main py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">
                <span className="font-poppins font-bold text-charcoal-900 text-lg">A</span>
              </div>
              <div className="leading-tight">
                <div className="font-poppins font-bold text-lg">Ansari</div>
                <div className="font-poppins font-medium text-leather-300 text-xs tracking-wider uppercase -mt-0.5">Boot House</div>
              </div>
            </Link>
            <p className="text-white font-inter text-sm leading-relaxed max-w-sm">
              Quality footwear for every step of life. Serving families across India with affordable, durable, and stylish shoes for over 25 years.
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-3 text-sm text-white font-inter">
                <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0" strokeWidth={2} />
                <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-inter">
                <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" strokeWidth={2} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-inter">
                <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" strokeWidth={2} />
                <span>care@ansaribootthouse.com</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="font-poppins font-semibold text-white text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <Link href={l.href} className="text-sm text-white hover:text-brand-orange font-inter transition-colors">
                        {l.label}
                      </Link>
                    ) : (
                      <span className="text-sm text-white font-inter cursor-default">
                        {l.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal-700">
        <div className="container-main py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white font-inter text-center sm:text-left">
              © {new Date().getFullYear()} Ansary Footwear. All rights reserved. · Made in India
            </p>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-charcoal-700 hover:bg-brand-orange flex items-center justify-center transition-colors"
                >
                  <s.icon className="w-4 h-4 text-white" strokeWidth={2} />
                </a>
              ))}
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-2">
              {['VISA', 'MC', 'UPI', 'COD'].map((p) => (
                <span key={p} className="px-2.5 py-1.5 rounded-md bg-charcoal-700 text-white text-[10px] font-poppins font-semibold tracking-wide">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
