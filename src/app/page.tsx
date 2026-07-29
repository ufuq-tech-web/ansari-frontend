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
import { Metadata } from 'next';

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
    "url": "https://www.ansaribootthouse.com",
    "logo": "https://www.ansaribootthouse.com/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98765-43210",
      "contactType": "customer service"
    }
  };

  let faqs: any[] = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${API_URL}/seo/home`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.faqs && Array.isArray(data.faqs)) faqs = data.faqs;
    }
  } catch (err) {}

  const faqJsonLd = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

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
        <Newsletter />
        <RecentlyViewed />
      </main>
    </div>
  );
}
