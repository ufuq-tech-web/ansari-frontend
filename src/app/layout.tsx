import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "../components/SiteChrome";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ansaribootthouse.com"),
  title: {
    default: "Ansari Boot House — Quality Footwear for Every Step of Life",
    template: "%s",
  },
  description:
    "Discover affordable, quality footwear for men, women, and kids at Ansari Boot House. 25+ years of trusted retail experience. Shop boots, sandals, sneakers and more.",
  openGraph: {
    title: "Ansari Boot House — Quality Footwear for Every Step of Life",
    description: "Affordable footwear for the whole family. Men, Women, Kids & Accessories.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ansari Boot House",
  url: "https://www.ansaribootthouse.com",
  description:
    "Affordable, quality footwear for men, women, and kids. 25+ years of trusted retail experience.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Fashion Street",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400001",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-98765-43210",
    contactType: "customer service",
    email: "care@ansaribootthouse.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@500;600;700&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
