import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQs — Ansary Footwear",
  description: "Answers to common questions about shipping, returns, sizing, and payment at Ansary Footwear, plus category-specific footwear FAQs.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return <FaqClient />;
}
