"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
const labelClass = "text-sm font-poppins font-medium text-charcoal-700 block mb-1.5";

export default function ContactUsClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Contact us hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Contact Us</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Get in Touch</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Questions about an order, sizing, or anything else — we're here to help.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-14">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm">Visit Our Store</h3>
                <p className="text-sm text-charcoal-500 font-inter mt-0.5">123 Fashion Street, Mumbai, Maharashtra 400001</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm">Call Us</h3>
                <p className="text-sm text-charcoal-500 font-inter mt-0.5">+91 98765 43210</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm">Email Us</h3>
                <p className="text-sm text-charcoal-500 font-inter mt-0.5">care@ansarifootwear.com</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-charcoal-200 p-5 flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm">Store Hours</h3>
                <p className="text-sm text-charcoal-500 font-inter mt-0.5">Mon–Sat: 10 AM – 8:30 PM<br />Sunday: 11 AM – 6 PM</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8">
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
      </div>
    </div>
  );
}
