import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import FeaturedCategories from "../components/FeaturedCategories";
import NewArrivals from "../components/NewArrival";
import FeaturedCollections from "../components/FeaturedCollections";
import BestSellers from "../components/BestSellers";
import ShopByBrand from "../components/ShopByBrand";
import WhyChooseUs from "../components/WhyChooseUs";
import PromotionalBanner from "../components/PromotionBanner";
import CustomerReviews from "../components/CustomerReviews";
import InstagramGallery from "../components/InstagramGallery";
import Newsletter from "../components/Newsletter";
import RecentlyViewed from "../components/RecentlyViewed";
import PageFaq from "../components/PageFaq";
import { getPageFaqs, buildFaqJsonLd } from "../lib/seo-faqs";
import { Metadata } from 'next';

const defaultHomeFaqs = [
  { question: "What payment methods do you accept?", answer: "We accept Cash on Delivery (COD), all major credit and debit cards, UPI, and net banking." },
  { question: "How long does delivery take?", answer: "Most orders arrive within 4-6 business days for metro cities and 6-9 business days for other locations." },
  { question: "Can I return or exchange an item?", answer: "Yes — unworn shoes in original packaging can be returned or exchanged within 7 days of delivery." },
  { question: "Do you have physical stores?", answer: "Yes, our flagship store is at 123 Fashion Street, Mumbai, Maharashtra 400001." },
];

export async function generateMetadata(): Promise<Metadata> {
  let title = "Ansary Footwear";
  let description = "Premium Footwear";
  let keywords = "";

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
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

export default async function Home() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ansary Footwear",
    "url": "https://www.ansarifootwear.com",
    "logo": "https://www.ansarifootwear.com/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98765-43210",
      "contactType": "customer service"
    }
  };

  const faqs = await getPageFaqs('home', defaultHomeFaqs);
  const faqJsonLd = buildFaqJsonLd(faqs);

  return (
    <div className="min-h-screen bg-brand-ivory font-inter text-charcoal-900 pb-16 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedCategories />
        <NewArrivals />
        <BestSellers />
        <ShopByBrand />
        <FeaturedCollections />
        <PromotionalBanner />
        <CustomerReviews />
        <WhyChooseUs />
        <InstagramGallery />
        <PageFaq faqs={faqs} subtitle="Everything you need to know before you shop with us." />
        <Newsletter />
        <RecentlyViewed />
      </main>
    </div>
  );
}
