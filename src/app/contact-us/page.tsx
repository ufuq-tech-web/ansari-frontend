import type { Metadata } from "next";
import ContactUsClient from "./ContactUsClient";

export const metadata: Metadata = {
  title: "Contact Us — Ansari Boot House",
  description: "Get in touch with Ansari Boot House — store address, phone, email, and a contact form for questions about orders, sizing, or returns.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactUsPage() {
  return <ContactUsClient />;
}
