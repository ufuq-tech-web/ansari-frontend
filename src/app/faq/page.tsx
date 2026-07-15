import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQs — Ansari Boot House",
  description: "Answers to common questions about shipping, returns, sizing, and payment at Ansari Boot House, plus category-specific footwear FAQs.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return <FaqClient />;
}
