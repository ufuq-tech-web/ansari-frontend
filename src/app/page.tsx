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

export default function Home() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ansari Boot House",
    "url": "https://www.ansaribootthouse.com",
    "logo": "https://www.ansaribootthouse.com/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98765-43210",
      "contactType": "customer service"
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory font-inter text-charcoal-900 pb-16 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
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
