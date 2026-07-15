import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Ansari Boot House',
  description: 'How Ansari Boot House collects, stores, and uses your information — including cart, wishlist, order data, and account details.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="relative overflow-hidden bg-charcoal-800" aria-label="Privacy policy hero">
        <div className="relative container-main py-10 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-inter">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden><span className="text-white/30">/</span></li>
              <li className="text-white font-medium">Privacy Policy</li>
            </ol>
          </nav>
          <h1 className="font-poppins font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">Privacy Policy</h1>
          <p className="mt-4 text-white/75 text-base sm:text-lg font-inter leading-relaxed max-w-xl">
            Last updated: July 2026
          </p>
        </div>
      </section>

      <div className="container-main py-10 sm:py-14 max-w-3xl">
        <div className="space-y-6 text-charcoal-700 font-inter leading-relaxed">
          <p>
            This policy explains what information Ansari Boot House collects when you use our website, and how
            it's used. We keep this simple on purpose — we don't sell your data, and we don't share it with
            advertisers.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Information Stored in Your Browser</h2>
          <p>
            Your shopping cart, wishlist, and order history are stored locally in your browser using its built-in
            storage — not on a remote server. This means:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Your cart and wishlist stay saved even if you close the tab and come back later.</li>
            <li>They're tied to that specific browser and device — switching devices or browsers, or clearing
              your browser data, will clear this information.</li>
            <li>We don't have visibility into this data unless you contact us for support with an active order.</li>
          </ul>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Information You Provide Directly</h2>
          <p>
            When you place an order, contact support, or create an account, you provide information such as your
            name, phone number, email address, and delivery address. We use this only to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Process and deliver your order</li>
            <li>Send order confirmations and delivery updates</li>
            <li>Respond to support requests submitted through our Contact Us page</li>
            <li>Improve our products and customer experience</li>
          </ul>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Third-Party Services</h2>
          <p>
            Our website loads fonts from Google Fonts and product imagery from third-party image hosts as part of
            normal page rendering. These providers may receive standard technical request information (like your
            IP address and browser type) as a normal part of serving that content, the same as any website using
            external fonts or images.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Cookies</h2>
          <p>
            We use essential cookies and browser storage required for the site to function — like keeping items in
            your cart. We do not use third-party advertising or tracking cookies.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Your Rights</h2>
          <p>
            You can clear your cart, wishlist, and locally stored order history at any time by clearing your
            browser's site data for ansaribootthouse.com. If you've shared personal information with us directly
            (for example, through a support request), you can ask us to review, correct, or delete it by reaching
            out via{' '}
            <Link href="/contact-us" className="text-brand-orange hover:underline">Contact Us</Link>.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Changes to This Policy</h2>
          <p>
            If we make material changes to how we handle your information, we'll update this page and change the
            "last updated" date above.
          </p>

          <h2 className="font-poppins font-bold text-charcoal-900 text-2xl">Contact Us</h2>
          <p>
            Questions about this policy can be sent to{' '}
            <a href="mailto:care@ansaribootthouse.com" className="text-brand-orange hover:underline">care@ansaribootthouse.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
