import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { storefrontApi } from '../../lib/storefront-api';
import Newsletter from '../../components/Newsletter';
import PageFaq from '../../components/PageFaq';
import { getPageFaqs } from '../../lib/seo-faqs';

export const metadata = {
  title: 'Journal — Ansary Footwear',
  description: 'Editorial insights, style guides, and journal entries from the Ansary Footwear team.',
  alternates: { canonical: '/journal' },
};

const defaultJournalFaqs = [
  { question: 'How often do you publish new articles?', answer: 'We add new guides and style tips regularly — check back often or subscribe to our newsletter to get notified.' },
  { question: 'Can I suggest a topic for the Journal?', answer: "Yes — reach out via our Contact page and we'll consider it for a future article." },
  { question: 'Are the care tips in these articles safe for all shoe materials?', answer: "Most tips apply broadly, but always check the specific material of your shoes before trying a new cleaning method." },
  { question: 'Do articles link to products I can buy?', answer: 'Where relevant, articles link out to related categories or products so you can shop what you just read about.' },
  { question: 'Can I share these articles on social media?', answer: "Absolutely — use the share options on each article, or just copy the page link." },
];

export default async function JournalPage() {
  const posts = await storefrontApi.getBlogPosts();
  const faqs = await getPageFaqs('journal', defaultJournalFaqs);
  let seo = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/seo/journal`, { next: { revalidate: 60 } });
    if (res.ok) seo = await res.json();
  } catch (err) {}

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-900 aspect-auto min-h-[280px] sm:min-h-[340px] lg:aspect-[21/9] lg:min-h-0" aria-label="Articles hero">
        <div className="absolute inset-0">
          <Image
            src={seo?.heroImage || '/images/hero-banner/hero-journal.png'}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover ${seo?.heroImage ? 'opacity-40 mix-blend-overlay' : 'opacity-45'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/80 to-charcoal-900/40" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative container-main py-10 sm:py-14 lg:py-16 h-full flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Journal</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-semibold text-white text-xl sm:text-2xl lg:text-3xl leading-tight text-shadow-sm">{seo?.title || 'The Journal'}</h1>
          <p className="mt-4 text-white/90 text-base sm:text-lg font-inter leading-relaxed max-w-xl text-shadow-sm">
            {seo?.description || 'Tips, trends, and tutorials from the Ansary Footwear team.'}
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
      </div>

      <PageFaq faqs={faqs} subtitle="Answers to what readers ask most about the Journal." />

      <Newsletter />
    </div>
  );
}
