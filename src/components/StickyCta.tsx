import Image from 'next/image';
import Link from 'next/link';

// Persistent on every storefront page (rendered from SiteChrome). Sits above
// MobileBottomNav on mobile (that's fixed bottom-0, 64px tall) instead of
// overlapping it, and flush to the bottom on desktop where there's no
// bottom nav. SiteChrome reserves matching space via padding-bottom.
export default function StickyCta() {
  return (
    <div
      className="fixed bottom-16 lg:bottom-0 inset-x-0 z-40 h-16 lg:h-20 bg-[#0B1330] border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
      aria-label="Special offer"
    >
      <div className="container-main h-full">
        <div className="flex items-center justify-between gap-3 sm:gap-4 h-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative hidden sm:block w-11 h-11 lg:w-14 lg:h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/images/cta.png" alt="" fill sizes="56px" className="object-cover object-right" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-poppins font-semibold text-xs sm:text-sm lg:text-base truncate">
                Your next pair starts here.
              </p>
              <p className="text-white/70 font-inter text-[11px] sm:text-xs hidden sm:block">
                Get 10% off your first order.
              </p>
            </div>
          </div>
          <Link
            href="/#newsletter"
            className="flex-shrink-0 bg-gradient-to-r from-brand-orange to-leather-400 text-white font-poppins font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:shadow-lg hover:shadow-brand-orange/30 active:scale-95 transition-all duration-300 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1330]"
          >
            Get 10% Off
          </Link>
        </div>
      </div>
    </div>
  );
}
