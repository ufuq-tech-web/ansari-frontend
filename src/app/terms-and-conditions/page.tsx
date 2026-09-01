import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions — Ansary Footwear',
  description: 'The terms and conditions governing your use of the Ansary Footwear website and your orders with us.',
  alternates: { canonical: '/terms-and-conditions' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Terms and conditions hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Terms & Conditions</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Terms & Conditions</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Last updated: July 2026
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-14 max-w-3xl">
        <div className="space-y-6 text-charcoal-700 font-inter leading-relaxed">
          <p>
            By accessing or placing an order on ansarifootwear.com, you agree to the terms below. Please read them
            before using our site.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Use of the Website</h2>
          <p>
            You agree to use this site only for lawful purposes — browsing, purchasing, and managing genuine orders.
            You won't attempt to disrupt the site, scrape it at scale, or use it to conduct fraudulent transactions.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Product Information & Pricing</h2>
          <p>
            We aim to display accurate product descriptions, images, and pricing. Occasionally, an error may occur —
            in that case, we'll contact you before processing the order, and you may cancel or accept the corrected
            price. Prices are subject to change without notice, but a price will never change on an order you've
            already placed and paid for.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Orders & Acceptance</h2>
          <p>
            Placing an order is an offer to buy. We may decline or cancel any order — for example due to stock
            unavailability, a pricing error, or suspected fraud — and will notify you if this happens, with a full
            refund for any amount already charged.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Returns, Exchanges & Shipping</h2>
          <p>
            Orders are governed by our{' '}
            <Link href="/return-exchange" className="text-brand-orange hover:underline">Returns & Exchanges</Link>{' '}
            and{' '}
            <Link href="/shipping-policy" className="text-brand-orange hover:underline">Shipping Policy</Link>,
            which form part of these terms.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Intellectual Property</h2>
          <p>
            All content on this site — including the Ansary Footwear name, logo, layout, and original text — is
            our property or used with permission, and may not be reproduced without consent. Product photography
            sourced from third-party providers remains the property of its respective owners.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Limitation of Liability</h2>
          <p>
            We aren't liable for indirect or consequential damages arising from use of this site, to the extent
            permitted by applicable law. This doesn't affect your statutory rights as a consumer.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Governing Law</h2>
          <p>
            These terms are governed by the laws of India, and any disputes will be subject to the jurisdiction of
            the courts in Mumbai, Maharashtra.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the site after changes are posted means
            you accept the revised terms.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Contact</h2>
          <p>
            Questions about these terms can be sent to{' '}
            <a href="mailto:care@ansarifootwear.com" className="text-brand-orange hover:underline">care@ansarifootwear.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
