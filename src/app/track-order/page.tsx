import type { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";

export async function generateMetadata(): Promise<Metadata> {
  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/track-order`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  const title = seoTitle || "Order Tracking | Track Your Ansari Footwear Order";
  const description =
    seoDesc ||
    "Track your Ansari Footwear order online and check your latest order status, shipping progress and delivery updates using your order details.";
  const canonicalUrl = "https://www.ansarifootwear.com/order-tracking/";

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function TrackOrderPage() {
  let seo = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/seo/track-order`, { next: { revalidate: 60 } });
    if (res.ok) seo = await res.json();
  } catch (err) {}

  return <TrackOrderClient heroDescription={seo?.description} />;
}
