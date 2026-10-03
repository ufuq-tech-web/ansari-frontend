import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Heart, Users, Truck, Quote, Calendar, MapPin, Award, ArrowRight } from 'lucide-react';
import PageFaq from '../../components/PageFaq';
import Newsletter from '../../components/Newsletter';
import { getPageFaqs } from '../../lib/seo-faqs';

export async function generateMetadata(): Promise<Metadata> {
  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/about-us`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  const title = seoTitle || "About Ansari Footwear | Shoes Shop in India";
  const description =
    seoDesc ||
    "Learn about Ansari Footwear, our journey, footwear collections and commitment to serving customers across India with quality shoes and footwear.";
  const canonicalUrl = "https://www.ansarifootwear.com/shoes-shop-in-india/";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
  };
}

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
  { icon: Truck, title: 'Reliable, Every Time', text: "COD, easy 7-day returns, and transparent live shipping rates — the same promises we've built our reputation on since day one.", gradient: 'from-sky-400 to-blue-500' },
];

const stats = [
  { icon: Calendar, value: '1998', label: 'Founded' },
  { icon: Award, value: '25+', label: 'Years of Trust' },
  { icon: Users, value: '100K+', label: 'Happy Customers' },
  { icon: MapPin, value: '5', label: 'Cities Served' },
];

const familyCategories = [
  { label: 'Men', description: "Formals to weekend casuals", href: '/mens-shoes', image: '/images/Banner/new-arrival-men.png' },
  { label: 'Women', description: 'Heels, flats & everyday wear', href: '/womens-shoes', image: '/images/Banner/new-arrival-women.png' },
  { label: 'Kids', description: 'Built for play, made to last', href: '/kids-shoes', image: '/images/Banner/new-arrival-kid.png' },
  { label: 'New Arrivals', description: "This season's freshest styles", href: '/new-arrivals', image: '/images/men-collection/men-sneakers.png' },
];

export default async function AboutUsPage() {
  const faqs = await getPageFaqs('about-us', defaultAboutFaqs);
  let seo = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/seo/about-us`, { next: { revalidate: 60 } });
    if (res.ok) seo = await res.json();
  } catch (err) {}

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-900" aria-label="About us hero">
        <div className="absolute inset-0">
          <Image src={seo?.heroImage || "/images/hero-banner/hero-about-us.png"} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover opacity-40" />
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
              <li className="text-white font-medium">{seo?.h1 || "About Us"}</li>
            </ol>
          </nav>
          <span className="text-brand-orange font-manrope font-semibold text-sm uppercase tracking-widest">{seo?.heroEyebrow || "Our Heritage"}</span>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight mt-2 max-w-2xl">{seo?.h1 || "About Us"}</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            {seo?.description || "Learn about Ansari Footwear, our journey, footwear collections and commitment to serving customers across India with quality shoes and footwear."}
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
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 mb-24 sm:mb-28">
          <div className="order-2 lg:order-1 relative pt-10 sm:pt-14">
            <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] rounded-2xl overflow-hidden shadow-card-hover">
              <Image
                src="/images/why-choose.png"
                alt="A family fitting shoes together at Ansary Footwear"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-start gap-3">
                <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-sm sm:text-base font-inter leading-relaxed text-white/90">
                  Trust the shopkeeper to tell you the truth about fit, material, and durability — not just make a sale.
                </p>
              </div>
            </div>
            <div className="absolute -top-2 -left-2 sm:top-0 sm:left-6 w-32 h-24 sm:w-44 sm:h-32 rounded-xl overflow-hidden border-4 border-brand-ivory shadow-xl">
              <Image
                src="/images/cta.png"
                alt="A family shopping for shoes together"
                fill
                sizes="176px"
                className="object-cover object-right"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">Since 1998</span>
            <h2 className="section-heading text-2xl sm:text-3xl mt-1 mb-5">{seo?.content?.storyTitle || "Our Story"}</h2>
            <div className="space-y-4 text-charcoal-700 font-inter leading-relaxed">
              {seo?.content?.storyText ? (
                typeof seo.content.storyText === "string" ? (
                  seo.content.storyText.split("\n\n").map((p: string, idx: number) => <p key={idx}>{p}</p>)
                ) : Array.isArray(seo.content.storyText) ? (
                  seo.content.storyText.map((p: string, idx: number) => <p key={idx}>{p}</p>)
                ) : (
                  <p>{String(seo.content.storyText)}</p>
                )
              ) : (
                <>
                  <p>
                    Ansary Footwear started as a single family-run footwear shop on Fashion Street, Mumbai, at a time when
                    buying a good pair of shoes meant trusting the shopkeeper to tell you the truth about fit, material, and
                    durability — not just make a sale. That principle is still the one thing we&apos;ve refused to compromise on
                    as the business has grown.
                  </p>
                  <p>
                    Over the past 25 years, we&apos;ve grown from that one storefront into a footwear destination for men, women,
                    kids, and everything in between — formal shoes for the office, school shoes that survive a full term of
                    playground use, festive sandals for wedding season, and the shoe-care essentials that make a good pair
                    last even longer.
                  </p>
                  <p>
                    What hasn&apos;t changed is who we&apos;re building this for: families who want footwear that&apos;s honestly priced,
                    genuinely durable, and backed by a store that stands behind what it sells. That&apos;s the same promise our
                    founders made across the counter two and a half decades ago, and it&apos;s the one we&apos;re carrying online today.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Custom Body Sections from Backend CMS */}
        {seo?.sections && Array.isArray(seo.sections) && seo.sections.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-8 mb-20">
            {seo.sections.map((sec: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-card">
                {sec.subtitle && (
                  <span className="text-accent font-manrope font-semibold text-xs uppercase tracking-wide">{sec.subtitle}</span>
                )}
                {sec.title && (
                  <h3 className="font-poppins font-bold text-xl sm:text-2xl text-charcoal-900 mt-1 mb-3">{sec.title}</h3>
                )}
                {sec.content && (
                  <div className="text-charcoal-700 font-inter leading-relaxed whitespace-pre-line">{sec.content}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Shop the family — photo band */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-accent font-manrope font-semibold text-sm uppercase tracking-wide">What We Stock</span>
          <h2 className="section-heading text-2xl sm:text-3xl mt-1">Footwear for Every Member of the Family</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-20">
          {familyCategories.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-card bg-charcoal-100"
            >
              <Image
                src={c.image}
                alt={`${c.label} footwear at Ansary Footwear`}
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="text-white font-poppins font-semibold text-base sm:text-lg">{c.label}</h3>
                <p className="text-white/70 font-inter text-xs sm:text-sm mt-0.5 hidden sm:block">{c.description}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-white text-xs sm:text-sm font-manrope font-semibold group-hover:gap-2 transition-all duration-300">
                  Shop now <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              </div>
            </Link>
          ))}
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

      <Newsletter />
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        