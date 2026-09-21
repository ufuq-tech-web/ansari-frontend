import type { Metadata } from "next";
import { Sora, Manrope, Inter } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import SiteChrome from "../components/SiteChrome";
import Providers from "../components/Providers";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${inter.variable}`}>
      <GoogleTagManager gtmId="GTM-ML48RVLB" />
      <head>
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
