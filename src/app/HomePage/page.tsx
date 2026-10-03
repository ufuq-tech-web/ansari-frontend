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

  let homeSeo: any = null;
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/home`, { next: { revalidate: 60 } });
    if (res.ok) homeSeo = await res.json();
  } catch (err) {}

  const [faqs, productsPool, brands, reviews] = await Promise.all([
    getPageFaqs("home", defaultHomeFaqs),
    storefrontApi.getProducts({ limit: 100 }),
    storefrontApi.getBrands(),
    storefrontApi.getReviews(),
  ]);
  const faqJsonLd = buildFaqJsonLd(faqs);
  const newArrivals = productsPool.items.filter((p) => p.isNew);
  const bestSellers = productsPool.items.filter((p) => p.badge === "Bestseller").slice(0, 8);

  const c = homeSeo?.content || {};

  return (
    <div className="min-h-screen bg-brand-ivory font-inter text-charcoal-900 pb-16 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <main>
        <HeroSection
          slides={c.hero?.slides || c.heroSlides}
          heroImage={homeSeo?.heroImage}
          h1={homeSeo?.h1}
          heroEyebrow={homeSeo?.heroEyebrow}
          description={homeSeo?.description}
          primaryLinkHref={c.hero?.primaryLinkHref}
          primaryLinkLabel={c.hero?.primaryLinkLabel}
          secondaryLinkHref={c.hero?.secondaryLinkHref}
          secondaryLinkLabel={c.hero?.secondaryLinkLabel}
        />
        <CategorySection
          heading={c.exploreCollections?.heading}
          headingHighlight={c.exploreCollections?.headingHighlight}
          description={c.exploreCollections?.description}
        />
        <FeaturedCategories
          men={c.genderBanners?.men}
          women={c.genderBanners?.women}
          kids={c.genderBanners?.kids}
        />
        <NewArrivals
          products={newArrivals}
          hook={c.newArrivals?.hook}
          heading={c.newArrivals?.heading}
          headingHighlight={c.newArrivals?.headingHighlight}
        />
        <BestSellers
          products={bestSellers}
          hook={c.bestSellers?.hook}
          heading={c.bestSellers?.heading}
          headingHighlight={c.bestSellers?.headingHighlight}
          description={c.bestSellers?.description}
          viewAllHref={c.bestSellers?.viewAllHref}
          viewAllLabel={c.bestSellers?.viewAllLabel}
        />
        <ShopByBrand
          brands={brands}
          hook={c.brandsSection?.hook}
          heading={c.brandsSection?.heading}
          headingHighlight={c.brandsSection?.headingHighlight}
        />
        <FeaturedCollections
          hook={c.featuredCollections?.hook}
          heading={c.featuredCollections?.heading}
          headingHighlight={c.featuredCollections?.headingHighlight}
          description={c.featuredCollections?.description}
        />
        <PromotionalBanner />
        <CustomerReviews
          reviews={reviews}
          customReviews={c.customerReviews?.reviews}
          hook={c.customerReviews?.hook}
          heading={c.customerReviews?.heading}
          headingHighlight={c.customerReviews?.headingHighlight}
          ratingSummary={c.customerReviews?.ratingSummary}
        />
        <WhyChooseUs
          hook={c.whyChooseUs?.hook}
          heading={c.whyChooseUs?.heading}
          headingHighlight={c.whyChooseUs?.headingHighlight}
          description={c.whyChooseUs?.description}
          image={c.whyChooseUs?.image}
          features={c.whyChooseUs?.features}
          stats={c.whyChooseUs?.stats}
        />
        <InstagramGallery
          hook={c.community?.hook}
          heading={c.community?.heading}
          headingHighlight={c.community?.headingHighlight}
          subheading={c.community?.subheading}
        />
        {homeSeo?.sections && Array.isArray(homeSeo.sections) && homeSeo.sections.length > 0 && (
          <section className="container-main py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeSeo.sections.map((sec: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-card">
                  {sec.subtitle && (
                    <span className="text-accent font-manrope font-semibold text-xs uppercase tracking-wide">{sec.subtitle}</span>
                  )}
                  {sec.title && (
                    <h3 className="font-poppins font-bold text-lg text-charcoal-900 mt-1 mb-2">{sec.title}</h3>
                  )}
                  {sec.content && (
                    <p className="text-sm text-charcoal-600 font-inter leading-relaxed whitespace-pre-line">{sec.content}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        <PageFaq
          faqs={faqs}
          eyebrow={c.faqSection?.eyebrow || 'Got Questions?'}
          title={c.faqSection?.title}
          subtitle={c.faqSection?.subtitle || 'Everything you need to know before you shop with us.'}
        />
        <Newsletter />
      </main>
    </div>
  );
}
