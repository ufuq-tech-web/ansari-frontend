import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";
import PageFaq from "../../components/PageFaq";
import { getPageFaqs } from "../../lib/seo-faqs";

export const metadata: Metadata = {
  title: "Contact Us — Ansary Footwear",
  description: "Get in touch with Ansary Footwear — store address, phone, email, and a contact form for questions about orders, sizing, or returns.",
  alternates: { canonical: "/contact-us" },
};

const defaultContactFaqs = [
  { question: "What's the fastest way to get a response?", answer: "Call or WhatsApp us during store hours for the quickest reply. Email and the contact form typically get a response within one business day." },
  { question: "What are your customer service hours?", answer: "Monday to Saturday, 10 AM to 8:30 PM, and Sunday 11 AM to 6 PM." },
  { question: "How do I get help with an existing order?", answer: "Include your order number in your message so we can pull up the details right away — or check Track Order for a live status update." },
  { question: "Can I request a callback?", answer: "Yes, just mention your phone number and a good time to call in the message field, and our team will reach out." },
];

export default async function ContactUsPage() {
  const faqs = await getPageFaqs("contact-us", defaultContactFaqs);
  return (
    <>
      <ContactUsClient />
      <PageFaq faqs={faqs} subtitle="Quick answers before you reach out." />
    </>
  );
}
