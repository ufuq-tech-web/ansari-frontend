"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { storefrontApi } from '../lib/storefront-api';
import { ApiError } from '../lib/customer-api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ couponCode: string; alreadySubscribed: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // guards against double-submit on slow connections

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const res = await storefrontApi.subscribeToNewsletter(trimmed);
      setResult(res);
      setEmail('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-12 sm:py-16 lg:py-20 bg-white" aria-label="Newsletter signup">
      <div className="container-main">
        <div className="relative rounded-3xl overflow-hidden bg-[#0B1330] shadow-card-hover grid lg:grid-cols-2">
          {/* Decorative accents on the text panel side only */}
          <div className="absolute top-0 left-0 w-60 h-60 bg-brand-orange/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

          {/* Offer + form */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-brand-orange font-manrope font-semibold text-sm uppercase tracking-wide">
              A little something for your first step
            </span>
            <h2 className="mt-3 font-poppins font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Your next pair starts here.
            </h2>
            <p className="mt-4 text-white/75 font-inter text-base sm:text-lg max-w-md">
              Get 10% off your first order. Discover shoes for every step of the family.
            </p>

            {result ? (
              <div className="mt-8 inline-flex flex-col items-start gap-2 bg-brand-green/15 border border-brand-green/30 px-6 py-4 rounded-2xl max-w-md" role="status">
                <span className="flex items-center gap-2 text-brand-green font-poppins font-semibold">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                  {result.alreadySubscribed ? "You're already on the list!" : 'Thanks for subscribing!'}
                </span>
                <span className="text-white/85 text-sm font-inter">
                  Your code: <span className="font-poppins font-bold tracking-wider text-white">{result.couponCode}</span>
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={submitting}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'newsletter-error' : undefined}
                    className="w-full px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white placeholder:text-white/40 font-inter outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:border-transparent transition-all disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-brand-orange to-leather-400 text-white font-poppins font-semibold px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-brand-orange/30 active:scale-95 transition-all duration-300 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1330] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {submitting ? 'Submitting…' : 'Get My 10% Off'}
                </button>
              </form>
            )}

            {error && (
              <p id="newsletter-error" role="alert" className="mt-2 text-red-300 text-sm font-inter">
                {error}
              </p>
            )}

            <p className="mt-5 text-xs text-white/60 font-inter">
              Exclusive offers and new arrivals. Unsubscribe anytime.
            </p>
          </div>

          {/* Family photo */}
          <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-0">
            <Image
              src="/images/cta.png"
              alt="A family shopping for shoes together"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-right"
            />
            {/* Dark navy gradient — near-opaque where the photo meets the
                text panel, fading toward the family so they stay visible. */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1330] via-[#0B1330]/40 to-transparent lg:from-[#0B1330]/95 lg:via-[#0B1330]/35 lg:to-transparent" />

            {/* Product card */}
            <Link
              href="/kids"
              className="group absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3 max-w-[220px] hover:shadow-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-charcoal-100">
                <Image src="/images/kii.png" alt="" fill sizes="56px" className="object-cover" />
              </div>
              <span className="text-charcoal-900 font-poppins font-semibold text-sm leading-snug group-hover:text-brand-orange transition-colors">
                Find their perfect fit.
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
