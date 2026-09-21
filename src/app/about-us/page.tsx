import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Heart, Users, Truck, Quote, Calendar, MapPin, Award } from 'lucide-react';
import PageFaq from '../../components/PageFaq';
import { getPageFaqs } from '../../lib/seo-faqs';

export const metadata = {
  title: 'About Us — Ansary Footwear',
  description: 'Ansary Footwear has been serving families across India with quality, affordable footwear for over 25 years. Learn our story.',
  alternates: { canonical: '/about-us' },
};

const defaultAboutFaqs = [
  { question: 'How long has Ansary Footwear been in business?', answer: 'Since 1998 — over 25 years serving families across India, starting from a single storefront in Mumbai.' },
  { question: 'Do you have a physical store I can visit?', answer: 'Yes, our flagship store is at 123 Fashion Street, Mumbai, Maharashtra 400001. We\'re open Monday to Saturday, 10 AM to 8:30 PM, and Sundays 11 AM to 6 PM.' },
  { question: 'Do you sell only your own brand, or other brands too?', answer: 'Both — we stock our own line alongside trusted partner brands. Browse them all on our Brands page.' },
  { question: 'How can I get in touch with your team?', answer: 'Head to our Contact Us page for phone, email, and a message form — we typically reply within one business day.' },
];

const values = [
  { icon: ShieldCheck, title: 'Quality First', text: 'Every pair is checked for stitching, sole grip, and material quality before it reaches a shelf — a habit from our earliest days that never changed.', gradient: 'from-amber-400 to-brand-orange' },
  { icon: Heart, title: 'Affordable for Every Family', text: 'Footwear is a necessity, not a luxury. We keep margins honest so a family of four can shoe everyone without a second thought.', gradient: 'from-rose-400 to-brand-orange' },
  { icon: Users, title: 'Serving Every Age', text: "From a toddler's first walking shoes to formal wear for a father's retirement, we stock for every stage of life under one roof.", gradient: 'from-emerald-400 to-brand-green' },
  { icon: Truck, title: 'Reliable, Every Time', text: "COD, easy 7-day returns, and free shipping over ₹999 — the same promises we've built our reputation on since day one.", gradient: 'from-sky-400 to-blue-500' },
];

const stats = [
  { icon: Calendar, value: '1998', label: 'Founded' },
  { icon: Award, value: '25+', label: 'Years of Trust' },
  { icon: Users, value: '1,00,000+', label: 'Happy Customers' },
  { icon: MapPin, value: '500+', label: 'Cities Served' },
];

export default async function AboutUsPage() {
  const faqs = await getPageFaqs('about-us', defaultAboutFaqs);

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-900" aria-label="About us hero">
        <div className="absolute inset-0">
          <Image src="/images/accessories-banner.png" alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/85 to-charcoal-900/50" />
        </div>
        {/* Decorative blurs, consistent with other dark sections on the site */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-leather-400/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div className="relative container-main pt-10 sm:pt-14 lg:pt-16 pb-20 sm:pb-24 lg:pb-28">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">About Us</li>
            </ol>
          </nav>
          <span className="text-brand-orange font-manrope font-semibold text-sm uppercase tracking-widest">Our Heritage</span>
          <h1 className="font-poppins font-bold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight mt-2 max-w-2xl">Quality Footwear for Every Step of Life</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            25+ years of trusted retail experience, serving families across India.
          </p>
        </div>
      </section>

      <div className="container-main">
        {/* Stats strip — floats up over the hero/body boundary */}
        <div className="relative -mt-12 sm:-mt-14 mb-14 sm:mb-20 bg-white rounded-2xl shadow-card-hover border border-charcoal-100 px-4 sm:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-brand-orange" strokeWidth={2} />
                </div>
                <div className="font-poppins font-bold text-2xl sm:text-3xl text-charcoal-900">{stat.value}</div>
                <div className="text-xs sm:text-sm text-charcoal-500 font-inter mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story — image + copy */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 mb-16 sm:mb-20">
          <div className="order-2 lg:order-1 flex flex-col gap-5 h-full">
            <div className="relative flex-1 min-h-[220px] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="/images/collections-banner.png"
                alt="Footwear for every member of the family, displayed together"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-start gap-3 bg-charcoal-900 text-white rounded-2xl shadow-card p-5">
              <Quote className="w-6 h-6 text-brand-orange flex-shrink-0" strokeWidth={2} />
              <p className="text-sm font-inter leading-relaxed text-white/85">
                Trust the shopkeeper to tell you the truth about fit, material, and durability — not just make a sale.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Since 1998</span>
            <h2 className="section-heading text-2xl sm:text-3xl mt-1 mb-5">Our Story</h2>
            <div className="space-y-4 text-charcoal-700 font-inter leading-relaxed">
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
          </div>
        </div>

        {/* What We Stand For */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Our Principles</span>
          <h2 className="section-heading text-2xl sm:text-3xl mt-1">What We Stand For</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16 sm:mb-20">
          {values.map((v) => (
            <div key={v.title} className="group bg-white rounded-2xl border border-charcoal-200 p-6 text-center hover:border-brand-orange/30 hover:shadow-card-hover transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-5 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <v.icon className="w-7 h-7 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="font-poppins font-semibold text-charcoal-900 text-base mb-2">{v.title}</h3>
              <p className="text-sm text-charcoal-500 font-inter leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      <PageFaq faqs={faqs} eyebrow="Got Questions?" title="About Ansary Footwear" subtitle="Everything you might want to know about our story and how to reach us." />

      <div className="container-main">
        {/* CTA */}
        <div className="relative rounded-3xl bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-800 overflow-hidden p-8 sm:p-12 text-center mb-16 sm:mb-20">
          <div className="absolute top-0 right-0 w-60 h-60 bg-brand-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-leather-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
          <div className="relative">
            <h2 className="font-poppins font-bold text-white text-xl sm:text-2xl mb-2">Have a question for us?</h2>
            <p className="text-white/70 font-inter text-sm mb-6">We're always happy to help you find the right pair.</p>
            <Link href="/contact-us" className="btn-primary inline-flex">Get in Touch</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
