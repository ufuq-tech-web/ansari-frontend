export interface FaqItem {
  question: string;
  answer: string;
}

// Fetches admin-managed FAQs for a page (SeoMetadata.faqs), falling back to
// the given defaults when the admin hasn't configured any for that pageKey yet.
export async function getPageFaqs(pageKey: string, fallback: FaqItem[]): Promise<FaqItem[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${API_URL}/seo/${pageKey}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.faqs) && data.faqs.length > 0) return data.faqs;
    }
  } catch (err) {
    // Ignore on SSR fail — fall back below
  }
  return fallback;
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
