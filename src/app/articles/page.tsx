import Link from 'next/link';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { storefrontApi } from '../../lib/storefront-api';

export const metadata = {
  title: 'Articles — Ansari Boot House',
  description: 'Shoe-care tips, sizing advice, and style guides from the Ansari Boot House team.',
  alternates: { canonical: '/articles' },
};

export default async function ArticlesPage() {
  const posts = await storefrontApi.getBlogPosts();

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Articles hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Articles</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Articles</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Tips, trends, and tutorials from the Ansari Boot House team.
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12">
        {posts.length === 0 ? (
          <p className="text-charcoal-500 font-inter text-center py-16">No articles published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/articles/${post.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-charcoal-200 hover:border-brand-orange/30 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-44 bg-charcoal-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-brand-orange" strokeWidth={2} />
                    </span>
                    <span className="text-xs text-leather-400 font-poppins font-semibold uppercase tracking-wide">{post.author}</span>
                  </div>
                  <h2 className="font-poppins font-bold text-charcoal-900 text-lg leading-snug group-hover:text-brand-orange transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-charcoal-500 font-inter leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-charcoal-400 font-inter">
                      <Clock className="w-3.5 h-3.5" strokeWidth={2} /> {post.readTime}
                    </span>
                    <ArrowRight className="w-4 h-4 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
