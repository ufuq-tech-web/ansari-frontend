import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { storefrontApi } from "../../../lib/storefront-api";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";
import ProductCard from "../../../components/ProductCard";

const BASE_URL = "https://www.ansaribootthouse.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await storefrontApi.getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found — Ansari Boot House" };
  }

  const title = `${post.title} — Ansari Boot House`;
  return {
    title,
    description: post.excerpt,
    openGraph: { title, description: post.excerpt, type: "article" },
    alternates: { canonical: `/journal/${post.slug}` },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await storefrontApi.getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await storefrontApi.getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  
  const { items: products } = await storefrontApi.getProducts({ limit: 10 });
  // Select a highly rated product natively, fallback to first available
  const featuredProduct = products.find(p => p.rating > 4.5) || products[0];

  return (
    <div className="min-h-screen bg-brand-ivory">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Journal", url: `${BASE_URL}/journal` },
          { name: post.title, url: `${BASE_URL}/journal/${post.slug}` },
        ]}
      />
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Article hero">
        <div className="absolute inset-0">
          <img src={post.image} alt="" loading="eager" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
        </div>
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">Journal</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">{post.title}</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-3xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-white/75 text-sm font-inter">
            <span>By {post.author}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" strokeWidth={2} /> {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <article 
            className="lg:col-span-2 min-w-0 overflow-hidden break-words prose prose-charcoal prose-lg max-w-none prose-img:rounded-2xl prose-img:shadow-sm" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <aside>
            <div className="bg-white rounded-2xl p-5 shadow-card border border-charcoal-200 sticky top-24">
              <h3 className="font-poppins font-semibold text-charcoal-900 text-sm mb-4">More Articles</h3>
              <div className="space-y-3">
                {relatedPosts.map((p) => (
                  <Link key={p.slug} href={`/journal/${p.slug}`} className="flex items-start gap-3 group">
                    <div className="w-9 h-9 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-brand-orange" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="font-poppins font-medium text-charcoal-900 text-sm leading-snug group-hover:text-brand-orange transition-colors">{p.title}</h4>
                      <span className="text-xs text-charcoal-400 font-inter">{p.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/journal" className="mt-4 inline-flex items-center gap-1.5 text-brand-orange font-poppins font-semibold text-xs hover:gap-2.5 transition-all">
                All Articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            {featuredProduct && (
              <div className="bg-white rounded-2xl p-5 shadow-card border border-charcoal-200 mt-6 sticky top-[380px]">
                <h3 className="font-poppins font-semibold text-charcoal-900 text-sm mb-4">Shop the Look</h3>
                <ProductCard product={featuredProduct} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
