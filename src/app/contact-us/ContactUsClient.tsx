"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle, Instagram, Facebook } from "lucide-react";

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-colors";
const labelClass = "text-sm font-poppins font-medium text-charcoal-700 block mb-1.5";

const contactCards = [
  { icon: MapPin, title: "Visit Our Store", lines: ["123 Fashion Street, Mumbai,", "Maharashtra 400001"], gradient: "from-amber-400 to-brand-orange" },
  { icon: Phone, title: "Call Us", lines: ["+91 98765 43210"], gradient: "from-emerald-400 to-brand-green" },
  { icon: Mail, title: "Email Us", lines: ["care@ansarifootwear.com"], gradient: "from-sky-400 to-blue-500" },
  { icon: Clock, title: "Store Hours", lines: ["Mon–Sat: 10 AM – 8:30 PM", "Sunday: 11 AM – 6 PM"], gradient: "from-rose-400 to-brand-orange" },
];

const socials = [
  { icon: Instagram, href: "https://instagram.com/ansarifootwear", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
];

export default function ContactUsClient({
  heroDescription,
  pageData,
}: {
  heroDescription?: string;
  pageData?: any;
} = {}) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const dynamicContactCards = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      lines: pageData?.content?.address
        ? [pageData.content.address]
        : ["123 Fashion Street, Mumbai,", "Maharashtra 400001"],
      gradient: "from-amber-400 to-brand-orange",
    },
    {
      icon: Phone,
      title: "Call Us",
      lines: pageData?.content?.phone ? [pageData.content.phone] : ["+91 98765 43210"],
      gradient: "from-emerald-400 to-brand-green",
    },
    {
      icon: Mail,
      title: "Email Us",
      lines: pageData?.content?.email ? [pageData.content.email] : ["care@ansarifootwear.com"],
      gradient: "from-sky-400 to-blue-500",
    },
    {
      icon: Clock,
      title: "Store Hours",
      lines: pageData?.content?.storeHours
        ? [pageData.content.storeHours]
        : ["Mon–Sat: 10 AM – 8:30 PM", "Sunday: 11 AM – 6 PM"],
      gradient: "from-rose-400 to-brand-orange",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-900 aspect-auto min-h-[320px] sm:min-h-[380px] lg:aspect-[3/1] lg:min-h-0" aria-label="Contact us hero">
        <div className="absolute inset-0">
          <Image src={pageData?.heroImage || "/images/hero-banner/hero-contact-us.png"} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/85 to-charcoal-900/50" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-leather-400/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative container-main py-10 sm:py-14 lg:py-16 h-full flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">{pageData?.h1 || "Contact Us"}</li>
            </ol>
          </nav>
          <span className="text-brand-orange font-manrope font-semibold text-sm uppercase tracking-widest">{pageData?.heroEyebrow || "We're Here To Help"}</span>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight mt-2">{pageData?.h1 || "Contact Us"}</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            {pageData?.description || heroDescription || "Contact Ansari Footwear for product enquiries, orders, support and assistance. Find our shoes shop contact details and get in touch with our team."}
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-14">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {dynamicContactCards.map((c) => (
              <div key={c.title} className="group bg-white rounded-2xl border border-charcoal-200 p-5 flex items-start gap-4 hover:border-brand-orange/30 hover:shadow-card-hover transition-all duration-300">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-charcoal-900 text-sm">{c.title}</h3>
                  <p className="text-sm text-charcoal-500 font-inter mt-0.5 leading-relaxed">
                    {c.lines.map((line, i) => (
                      <span key={i}>{line}{i < c.lines.length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>
            ))}

            <div className="bg-charcoal-900 rounded-2xl p-5">
              <h3 className="font-poppins font-semibold text-white text-sm mb-3">Follow Us</h3>
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-orange flex items-center justify-center text-white transition-colors duration-300"
                  >
                    <s.icon className="w-4.5 h-4.5" strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-card">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7 text-brand-green" strokeWidth={2} />
                  </div>
                  <h2 className="font-poppins font-bold text-charcoal-900 text-xl">Message Sent</h2>
                  <p className="text-sm text-charcoal-500 font-inter mt-2 max-w-sm">
                    Thanks for reaching out — our team typically replies within one business day.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-5 text-brand-orange font-poppins font-semibold text-sm hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h2 className="font-poppins font-bold text-charcoal-900 text-lg mb-1">Send Us a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Your Name</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Subject</label>
                    <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} placeholder="e.g. Order status, sizing question" />
                  </div>
                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
                  </div>
                  <button type="submit" className="btn-primary self-start">
                    Send Message <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Custom Body Sections from Backend CMS */}
        {pageData?.sections && Array.isArray(pageData.sections) && pageData.sections.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-8 mt-16">
            {pageData.sections.map((sec: any, idx: number) => (
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
      </div>
    </div>
  );
}
