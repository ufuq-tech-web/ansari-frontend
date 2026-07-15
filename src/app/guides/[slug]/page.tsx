import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { storefrontApi } from "../../../lib/storefront-api";
import { findProductsForGuide } from "../../../lib/catalog-helpers";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";
import ProductCard from "../../../components/ProductCard";

const BASE_URL = "https://www.ansaribootthouse.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await storefrontApi.getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found — Ansari Boot House" };
  }

  const title = `${guide.title} — Ansari Boot House`;
  return {
    title,
    description: guide.description,
    openGraph: { title, description: guide.description, type: "article" },
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await storefrontApi.getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const allGuides = await storefrontApi.getGuides();
  const relatedGuides = allGuides
    .filter((g) => g.categoryKey === guide.categoryKey && g.slug !== guide.slug)
    .slice(0, 3);

  const productsRes = await storefrontApi.getProducts({ categoryKey: guide.categoryKey, limit: 100 });
  const shopProducts = findProductsForGuide(guide, productsRes.items);

  return (
    <div className="min-h-screen bg-brand-ivory">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Buying Guides", url: `${BASE_URL}/guides` },
          { name: guide.categoryName, url: `${BASE_URL}/${guide.categoryKey}` },
          { name: guide.title, url: `${BASE_URL}/guides/${guide.slug}` },
        ]}
      />
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Guide hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li><Link href="/guides" className="hover:text-white transition-colors">Buying Guides</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li><Link href={`/${guide.categoryKey}`} className="hover:text-white transition-colors">{guide.categoryName}</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">{guide.title}</li>
            </ol>
          </nav>
          <span className="text-leather-300 font-poppins font-semibold text-sm uppercase tracking-wide">{guide.categoryName}</span>
          <h1 className="mt-1 font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-3xl">{guide.title}</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-2xl">{guide.description}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-white/60 text-sm font-inter">
            <Clock className="w-4 h-4" strokeWidth={2} /> {guide.readTime}
          </span>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2 space-y-8">
            {guide.content.map((section) => (
              <div key={section.heading}>
                <h2 className="font-poppins font-bold text-charcoal-900 text-xl sm:text-2xl mb-3">{section.heading}</h2>
                <p className="text-charcoal-700 font-inter leading-relaxed">{section.body}</p>
              </div>
            ))}

            {shopProducts.length > 0 && (
              <div>
                <h2 className="font-poppins font-bold text-charcoal-900 text-xl sm:text-2xl mb-5">Shop the Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  {shopProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Link
                href={`/${guide.categoryKey}`}
                className="inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-sm hover:gap-2.5 transition-all"
              >
                Shop {guide.categoryName} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          <aside>
            <div className="bg-white rounded-2xl p-5 shadow-card border border-charcoal-200 sticky top-24">
              <h3 className="font-poppins font-semibold text-charcoal-900 text-sm mb-4">More {guide.categoryName} Guides</h3>
              <div className="space-y-3">
                {relatedGuides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-brand-orange" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="font-poppins font-medium text-charcoal-900 text-sm leading-snug group-hover:text-brand-orange transition-colors">{g.title}</h4>
                      <span className="text-xs text-charcoal-400 font-inter">{g.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/guides" className="mt-4 inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-xs hover:gap-2.5 transition-all">
                All Guides <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
