"use client";

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="newsletter" className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Newsletter signup">
      <div className="container-main">
        <div className="relative rounded-3xl bg-charcoal-800 overflow-hidden p-8 sm:p-12 lg:p-16 text-center">
          {/* Decorative shape */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-leather-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-orange/15 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-brand-orange" strokeWidth={2} />
            </div>
            <h2 className="font-poppins font-bold text-white text-2xl sm:text-3xl lg:text-4xl">
              Get 10% Off Your First Order
            </h2>
            <p className="mt-3 text-white font-inter">
              Subscribe for exclusive offers, new arrivals, and footwear care tips — delivered to your inbox.
            </p>

            {submitted ? (
              <div className="mt-6 inline-flex items-center gap-2 bg-brand-green/15 text-brand-green px-5 py-3 rounded-xl font-poppins font-semibold">
                <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                Thanks for subscribing! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white text-charcoal-900 placeholder:text-charcoal-400 font-inter outline-none focus:ring-2 focus:ring-brand-orange transition-all"
                  aria-label="Email address"
                />
                <button type="submit" className="btn-primary justify-center whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-white font-inter">No spam, unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
