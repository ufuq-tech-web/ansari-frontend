import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedCategories from "@/components/FeaturedCategories";
import NewArrivals from "@/components/NewArrival";
import FeaturedCollections from "@/components/FeaturedCollections";
import BestSellers from "@/components/BestSellers";
import ShopByBrand from "@/components/ShopByBrand";
import WhyChooseUs from "@/components/WhyChooseUs";
import PromotionalBanner from "@/components/PromotionBanner";
import CustomerReviews from "@/components/CustomerReviews";
import InstagramGallery from "@/components/InstagramGallery";
import Newsletter from "@/components/Newsletter";
import PageFaq from "@/components/PageFaq";
import { getPageFaqs, buildFaqJsonLd } from "@/lib/seo-faqs";
import { storefrontApi } from "@/lib/storefront-api";
import { Metadata } from "next";

const defaultHomeFaqs = [
  { question: "What payment methods do you accept?", answer: "We accept Cash on Delivery (COD), all major credit and debit cards, UPI, and net banking." },
  { question: "How long does delivery take?", answer: "Most orders arrive within 4-6 business days for metro cities and 6-9 business days for other locations." },
  { question: "Can I return or exchange an item?", answer: "Yes — unworn shoes in original packaging can be returned or exchanged within 7 days of delivery." },
  { question: "Do you have physical stores?", answer: "Yes, our flagship store is at 123 Fashion Street, Mumbai, Maharashtra 400001." },
  { question: "How can I track my order?", answer: "Once your order ships, you'll get a tracking link by email and SMS. You can also check your order status anytime from the Track Order page." },
];

export async function generateMetadata(): Promise<Metadata> {
  let title = "Best Shoes Shop in India | Buy Shoes & Footwear Online";
  let description =
    "Shop shoes online at Ansari Footwear, a trusted shoes shop in India. Explore Sparx, Bata & Red Tape footwear for men, women & kids with COD across India.";
  let keywords = "";

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/home`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) title = data.title;
      if (data.description) description = data.description;
      if (data.keywords) keywords = data.keywords;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  return { title, description, keywords };
}

export default async function HomePage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ansary Footwear",
    url: "https://www.ansarifootwear.com",
    logo: "https://www.ansarifootwear.com/images/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-98765-43210",
      contactType: "customer service",
    },
  };

  const [faqs, productsPool, brands, reviews] = await Promise.all([
    getPageFaqs("home", defaultHomeFaqs),
    storefrontApi.getProducts({ limit: 100 }),
    storefrontApi.getBrands(),
    storefrontApi.getReviews(),
  ]);
  const faqJsonLd = buildFaqJsonLd(faqs);
  const newArrivals = productsPool.items.filter((p) => p.isNew);
  const bestSellers = productsPool.items.filter((p) => p.badge === "Bestseller").slice(0, 8);

  return (
    <div className="min-h-screen bg-brand-ivory font-inter text-charcoal-900 pb-16 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedCategories />
        <NewArrivals products={newArrivals} />
        <BestSellers products={bestSellers} />
        <ShopByBrand brands={brands} />
        <FeaturedCollections />
        <PromotionalBanner />
        <CustomerReviews reviews={reviews} />
        <WhyChooseUs />
        <InstagramGallery />
        <PageFaq faqs={faqs} subtitle="Everything you need to know before you shop with us." />
        <Newsletter />
      </main>
    </div>
  );
}
