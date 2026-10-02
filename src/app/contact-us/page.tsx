import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import PageFaq from "../../components/PageFaq";
import Newsletter from "../../components/Newsletter";
import { getPageFaqs } from "../../lib/seo-faqs";

export async function generateMetadata(): Promise<Metadata> {
  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/contact-us`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  const title = seoTitle || "Contact Ansari Footwear | Shoes Shop Contact Details";
  const description =
    seoDesc ||
    "Contact Ansari Footwear for product enquiries, orders, support and assistance. Find our shoes shop contact details and get in touch with our team.";
  const canonicalUrl = "https://www.ansarifootwear.com/shoes-shop-contact-numbers/";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
  };
}

const defaultContactFaqs = [
  { question: "What's the fastest way to get a response?", answer: "Call or WhatsApp us during store hours for the quickest reply. Email and the contact form typically get a response within one business day." },
  { question: "What are your customer service hours?", answer: "Monday to Saturday, 10 AM to 8:30 PM, and Sunday 11 AM to 6 PM." },
  { question: "How do I get help with an existing order?", answer: "Include your order number in your message so we can pull up the details right away — or check Track Order for a live status update." },
  { question: "Can I request a callback?", answer: "Yes, just mention your phone number and a good time to call in the message field, and our team will reach out." },
];

export default async function ContactUsPage() {
  const faqs = await getPageFaqs("contact-us", defaultContactFaqs);
  let seo = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/seo/contact-us`, { next: { revalidate: 60 } });
    if (res.ok) seo = await res.json();
  } catch (err) {}

  return (
    <>
      <ContactUsClient heroDescription={seo?.description} />
      <PageFaq faqs={faqs} subtitle="Quick answers before you reach out." />
      <Newsletter />
    </>
  );
}
