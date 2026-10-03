import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export async function generateMetadata(): Promise<Metadata> {
  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/faq`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  const title = seoTitle || "FAQs | Ansari Footwear | Frequently Asked Questions";
  const description =
    seoDesc ||
    "Find answers to frequently asked questions about Ansari Footwear products, orders, payments, shipping, returns and exchanges.";
  const canonicalUrl = "https://www.ansarifootwear.com/faqs/";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function FaqPage() {
  let seo = null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
  try {
    const res = await fetch(`${API_URL}/seo/faqs`, { next: { revalidate: 60 } });
    if (res.ok) seo = await res.json();
    else {
      const fallbackRes = await fetch(`${API_URL}/seo/faq`, { next: { revalidate: 60 } });
      if (fallbackRes.ok) seo = await fallbackRes.json();
    }
  } catch (err) {}

  return <FaqClient heroDescription={seo?.description} pageData={seo} />;
}
