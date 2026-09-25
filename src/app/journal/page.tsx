import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { storefrontApi } from '../../lib/storefront-api';

export const metadata = {
  title: 'Journal — Ansary Footwear',
  description: 'Editorial insights, style guides, and journal entries from the Ansary Footwear team.',
  alternates: { canonical: '/journal' },
};

export default async function JournalPage() {
  const posts = await storefrontApi.getBlogPosts();
  let seo = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/seo/journal`, { next: { revalidate: 60 } });
    if (res.ok) seo = await res.json();
  } catch (err) {}

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-900" aria-label="Articles hero">
        <div className="absolute inset-0">
          <Image
            src={seo?.heroImage || '/images/hero-banner/hero-sale.png'}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover object-top ${seo?.heroImage ? 'opacity-40 mix-blend-overlay' : 'opacity-45'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/80 to-charcoal-900/40" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Journal</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-bold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight text-shadow-sm">{seo?.title || 'The Journal'}</h1>
          <p className="mt-4 text-white/90 text-base sm:text-lg font-inter leading-relaxed max-w-xl text-shadow-sm">
            {seo?.description || 'Tips, trends, and tutorials from the Ansary Footwear team.'}
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-12">
        {posts.length === 0 ? (
          <p className="text-charcoal-500 font-inter text-center py-16">No articles published yet.</p>
        ) : (
          <>
            {/* Featured post */}
            <Link
              href={`/journal/${posts[0].slug}`}
              className="group grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-charcoal-100 hover:border-brand-orange/30 transition-all duration-300 mb-8 sm:mb-10"
            >
              <div className="relative h-64 lg:h-auto lg:min-h-[380px] bg-charcoal-100 overflow-hidden">
                <Image
                  src={posts[0].image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-poppins font-semibold text-brand-orange shadow-sm">
                  <FileText className="w-3.5 h-3.5" strokeWidth={2} /> Featured
                </span>
              </div>
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 text-xs text-charcoal-400 font-inter">
                  <span className="text-leather-400 font-poppins font-semibold uppercase tracking-wide">{posts[0].author}</span>
                  <span className="text-charcoal-300">•</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" strokeWidth={2} /> {posts[0].readTime}</span>
                </div>
                <h2 className="font-poppins font-bold text-charcoal-900 text-2xl sm:text-3xl leading-snug group-hover:text-brand-orange transition-colors">
                  {posts[0].title}
                </h2>
                <p className="mt-3 text-charcoal-500 font-inter leading-relaxed line-clamp-3">{posts[0].excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-brand-orange font-poppins font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                  Read Article <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </div>
            </Link>

            {posts.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {posts.slice(1).map((post) => (
                  <Link
                    key={post.id}
                    href={`/journal/${post.slug}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-charcoal-200 hover:border-brand-orange/30 transition-all duration-300 group flex flex-col"
                  >
                    <div className="relative h-52 bg-charcoal-100 overflow-hidden">
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-poppins font-semibold text-leather-400 uppercase tracking-wide shadow-sm">
                        <FileText className="w-3 h-3 text-brand-orange" strokeWidth={2} /> {post.author}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
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
          </>
        )}
      </div>
    </div>
  );
}
