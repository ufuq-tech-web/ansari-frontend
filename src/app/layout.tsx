import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "../components/SiteChrome";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ansarifootwear.com"),
  title: {
    default: "Ansary Footwear — Quality Footwear for Every Step of Life",
    template: "%s",
  },
  description:
    "Discover affordable, quality footwear for men, women, and kids at Ansary Footwear. 25+ years of trusted retail experience. Shop boots, sandals, sneakers and more.",
  openGraph: {
    title: "Ansary Footwear — Quality Footwear for Every Step of Life",
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
  name: "Ansary Footwear",
  url: "https://www.ansarifootwear.com",
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
    email: "care@ansarifootwear.com",
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
