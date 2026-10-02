import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storefrontApi, slugify } from "../../../lib/storefront-api";
import SubcategoryPageClient from "./SubcategoryPageClient";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";
import { buildProductQuery, filtersFromParams, searchParamsToURLSearchParams } from "../../../lib/product-query";

const BASE_URL = "https://www.ansarifootwear.com";

export const SUBCATEGORY_SEO_OVERRIDES: Record<
  string,
  { title: string; description: string; canonicalPath: string; pageName?: string }
> = {
  "men/formal-shoes": {
    pageName: "Formal Shoes",
    title: "Formal Shoes for Men | Leather, Black & Brown Formal Shoes",
    description: "Shop formal shoes for men online, including genuine leather, black and brown formal shoes. Discover stylish, comfortable footwear for office and occasions.",
    canonicalPath: "/mens-shoes/formal-shoes-for-men/",
  },
  "men/casual-shoes": {
    pageName: "Casual Shoes",
    title: "Casual Shoes for Men | Stylish Black, White & Leather Shoes",
    description: "Buy casual shoes for men online, from stylish black and white shoes to casual leather footwear. Find comfortable styles for everyday and smart-casual wear.",
    canonicalPath: "/mens-shoes/casual-shoes-for-men/",
  },
  "men/sneakers": {
    pageName: "Sneakers",
    title: "Sneakers for Men | Stylish Casual & Leather Sneakers",
    description: "Buy sneakers for men online, including stylish casual, leather and white sneakers. Discover comfortable men’s sneakers designed for everyday and smart-casual wear.",
    canonicalPath: "/mens-shoes/sneakers-for-men/",
  },
  "men/sports-shoes": {
    pageName: "Sports Shoes",
    title: "Sports Shoes for Men | Stylish & Comfortable Sports Footwear",
    description: "Discover sports shoes for men designed for active days, walking and everyday comfort. Find stylish black sports shoes and versatile footwear for men.",
    canonicalPath: "/mens-shoes/sports-shoes-for-men/",
  },
  "men/sandals": {
    pageName: "Sandals",
    title: "Men’s Sandals | Stylish Leather & Formal Sandals for Men",
    description: "Browse men’s sandals in leather, formal and casual styles. Choose comfortable sandals for men online, designed for everyday wear and special occasions.",
    canonicalPath: "/mens-shoes/mens-sandals/",
  },
  "men/slippers-flip-flops": {
    pageName: "Slipper & Flipflop",
    title: "Slippers & Flip Flops for Men | Stylish & Comfortable Footwear",
    description: "Shop slippers and flip flops for men in leather, casual and formal styles. Find soft, stylish footwear for daily use, comfort and effortless wear.",
    canonicalPath: "/mens-shoes/slippers-flip-flops-for-men/",
  },
  "men/loafers": {
    pageName: "Loafers",
    title: "Loafers for Men | Leather, Casual & Formal Loafers",
    description: "Choose loafers for men in leather, casual and formal styles. Find penny, black and brown loafers designed for versatile everyday and occasion wear.",
    canonicalPath: "/mens-shoes/loafers-for-men/",
  },
  "men/boots": {
    pageName: "Men’s Boots",
    title: "Boots for Men | Stylish Casual, Chelsea & Winter Boots",
    description: "Step into men’s boots for every occasion, from black and leather styles to casual, formal and riding boots. Find durable footwear built for everyday wear.",
    canonicalPath: "/mens-shoes/mens-boots/",
  },
  "women/flats": {
    pageName: "Flats",
    title: "Women’s Flats Online | Stylish Flat Shoes & Sandals for Women",
    description: "Discover women’s flats in stylish, casual and formal designs. Choose comfortable flat shoes, sandals and chappals for women, perfect for everyday wear.",
    canonicalPath: "/womens-shoes/womens-flats/",
  },
  "women/mojari-shoes": {
    pageName: "Mojari Shoes",
    title: "Mojari Shoes for Women | Stylish Jutti & Traditional Footwear",
    description: "Order mojari shoes and jutti for women in stylish traditional designs. Find comfortable ethnic footwear crafted for festive occasions and everyday elegance.",
    canonicalPath: "/womens-shoes/mojari-shoes-for-women/",
  },
  "women/sandals": {
    pageName: "Sandals",
    title: "Sandals for Women | Flat, Heels & Stylish Sandals",
    description: "Browse sandals for women in flat, heel, party wear and casual styles. Find comfortable footwear for daily wear, office occasions, weddings and special events.",
    canonicalPath: "/womens-shoes/sandals-for-women/",
  },
  "women/slippers": {
    pageName: "Slippers",
    title: "Slippers for Women | Stylish, Comfortable & Casual Slippers",
    description: "Discover slippers for women in stylish, flat, heel, casual and flip-flop styles. Find comfortable footwear for home, daily wear and every occasion.",
    canonicalPath: "/womens-shoes/slippers-for-women/",
  },
  "women/kolhapuri-chappal": {
    pageName: "Kolhapuri Chappal",
    title: "Kolhapuri Chappal for Women | Traditional Ladies Chappal",
    description: "Order Kolhapuri chappal for women in traditional styles. Find comfortable ladies Kolhapuri chappals for everyday wear, ethnic looks and special occasions.",
    canonicalPath: "/womens-shoes/kolhapuri-chappal-for-women/",
  },
  "kids/boys": {
    pageName: "Boys",
    title: "Shoes for Boys | Stylish, Casual & Formal Boys Shoes",
    description: "Shop shoes for boys in stylish, casual and formal designs. Find white, black, leather, party wear and everyday boys footwear for every occasion.",
    canonicalPath: "/kids-shoes/boys-shoes/",
  },
  "kids/girls": {
    pageName: "Girls",
    title: "Shoes for Girls | Stylish Girls Footwear & Sandals Online",
    description: "Explore footwear for girls in stylish shoes, sandals and everyday designs. Find girls shoes online, including sports styles and comfortable options for kids.",
    canonicalPath: "/kids-shoes/girls-shoes/",
  },
  "kids/new-born-baby": {
    pageName: "Baby Shoes",
    title: "Baby Shoes | Baby Girl & Boy Shoes Online | Infant Footwear",
    description: "Browse baby shoes for girls and boys in comfortable styles for newborns, infants and toddlers. Find baby shoes online for everyday, winter and special occasions.",
    canonicalPath: "/kids-shoes/baby-shoes/",
  },
  "kids/toddler-2-5-years": {
    pageName: "Toddler Shoes (2 to 5 Years)",
    title: "Toddler Shoes | Toddler Boy & Girl Shoes Online",
    description: "Explore toddler shoes for boys and girls in comfortable styles for everyday wear. Find toddler footwear designed for growing feet, playtime and special occasions.",
    canonicalPath: "/kids-shoes/toddler-shoes/",
  },
  "kids/big-kids-shoes-10-14-years": {
    pageName: "Junior (10–14 Years)",
    title: "Junior Shoes (10–14 Years) | Shoes for Boys & Girls",
    description: "Explore junior shoes for boys and girls aged 10–14 years, with stylish, comfortable footwear for school, sports, everyday wear and special occasions.",
    canonicalPath: "/kids-shoes/junior-shoes/",
  },
  "kids/school-shoes": {
    pageName: "School Shoes",
    title: "School Shoes | Boys & Girls School Shoes | Black & White",
    description: "Find school shoes for boys and girls in classic black and white styles. Explore comfortable school footwear for kids, designed for everyday school wear.",
    canonicalPath: "/kids-shoes/school-shoes/",
  },
  "kids/casual-shoes": {
    pageName: "Casual Shoes",
    title: "Kids Casual Shoes | Stylish & Comfortable Shoes for Kids Online",
    description: "Kids Casual Shoes | Stylish & Comfortable Shoes for Kids Online",
    canonicalPath: "/kids-shoes/kids-casual-shoes/",
  },
  "kids/sneakers": {
    pageName: "Sneakers",
    title: "Kids Sneakers | Sneakers for Boys & Girls | Kids Sneakers Online",
    description: "Explore kids sneakers for boys and girls in stylish everyday designs. Find white sneakers and comfortable footwear for active kids, playtime and casual wear.",
    canonicalPath: "/kids-shoes/kids-sneakers/",
  },
  "kids/sandals": {
    pageName: "Sandals",
    title: "Kids Sandals | Sandals for Boys & Girls | Kids Sandals Online",
    description: "Shop kids sandals for boys and girls in comfortable everyday styles. Find stylish children’s sandals and heel sandals for kids, with options available online.",
    canonicalPath: "/kids-shoes/kids-sandals/",
  },
  "kids/slippers": {
    pageName: "Slippers",
    title: "Kids Slippers | Comfortable Slippers for Boys & Girls",
    description: "Buy kids slippers for boys and girls in comfortable everyday styles. Find children’s slippers for home, winter and casual wear, with options for kids online.",
    canonicalPath: "/kids-shoes/kids-slippers/",
  },
  "accessories/socks": {
    pageName: "Socks",
    title: "Socks | Men’s & Women’s Socks | Cotton, Ankle & Winter Socks",
    description: "Explore socks for men and women in cotton, ankle, long and winter styles. Find comfortable everyday socks, grip socks and footwear essentials for every season.",
    canonicalPath: "/accessories/shoe-accessories/socks/",
  },
  "accessories/shoe-care-products": {
    pageName: "Shoes Care Products",
    title: "Shoe Cleaner & Cleaning Kits | Leather, Suede & White Shoes",
    description: "Find shoe cleaner, cleaning kits and care products for white, leather, suede and sports shoes. Choose sprays and complete shoe care kits.",
    canonicalPath: "/accessories/shoe-accessories/shoes-care-products/",
  },
  "accessories/shoes-polish": {
    pageName: "Shoe Polish",
    title: "Shoe Polish | Black, Brown & White Shoe Polish Cream",
    description: "Explore shoe polish in black, brown and white shades, including shoe polish cream and leather shoe polish for maintaining a clean, polished finish.",
    canonicalPath: "/accessories/shoe-accessories/shoe-polish/",
  },
  "accessories/shoes-brush": {
    pageName: "Shoe Brush",
    title: "Shoe Brush | Shoe Polish & Cleaning Brushes for Shoes",
    description: "Find shoe brushes for polishing and cleaning, including suede shoe brushes and washing brushes. Choose the right brush for everyday shoe care.",
    canonicalPath: "/accessories/shoe-accessories/shoe-brush/",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryKey: string; subcategory: string }>;
}): Promise<Metadata> {
  const { categoryKey, subcategory } = await params;
  const config = await storefrontApi.getCategory(categoryKey);
  const match = config?.subcategories.find((s) => slugify(s.name) === subcategory);

  if (!config || !match) {
    return { title: "Page Not Found — Ansary Footwear" };
  }

  let seoTitle: string | undefined;
  let seoDesc: string | undefined;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${API_URL}/seo/${categoryKey}-${subcategory}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.title) seoTitle = data.title;
      if (data.description) seoDesc = data.description;
    }
  } catch (err) {
    // Ignore on SSR fail
  }

  const override = SUBCATEGORY_SEO_OVERRIDES[`${categoryKey}/${subcategory}`];

  const audience = config.name.replace(/'s Footwear| Shoes/gi, "").trim();
  const defaultTitle = override?.title || `${match.name} for ${audience} — Ansary Footwear`;
  const defaultDesc =
    override?.description ||
    `Shop ${match.name} in our ${config.name} range — ${match.count} styles. ${config.description}`;

  const title = seoTitle || defaultTitle;
  const description = seoDesc || defaultDesc;

  const canonicalUrl = override?.canonicalPath
    ? `https://www.ansarifootwear.com${override.canonicalPath}`
    : `/${categoryKey}/${subcategory}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl.startsWith("http") ? canonicalUrl : `${BASE_URL}${canonicalUrl}`,
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ categoryKey: string; subcategory: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryKey, subcategory } = await params;
  const config = await storefrontApi.getCategory(categoryKey);
  const match = config?.subcategories.find((s) => slugify(s.name) === subcategory);

  if (!config || !match) {
    notFound();
  }

  const override = SUBCATEGORY_SEO_OVERRIDES[`${categoryKey}/${subcategory}`];

  const sp = searchParamsToURLSearchParams(await searchParams);
  const filters = filtersFromParams(sp);
  const sort = sp.get("sort") || "popularity";
  const gender = sp.get("gender") || "";
  const ageGroup = sp.get("age") || "";
  const productsRes = await storefrontApi.getProducts(
    buildProductQuery({ categoryKey, subcategory: match.name, gender, ageGroup, filters, sort }, 1)
  );

  return (
    <>
      {config && match && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            {
              name: config.name,
              url:
                categoryKey === "men"
                  ? `${BASE_URL}/mens-shoes/`
                  : categoryKey === "women"
                  ? `${BASE_URL}/womens-shoes/`
                  : categoryKey === "kids"
                  ? `${BASE_URL}/kids-shoes/`
                  : categoryKey === "accessories"
                  ? `${BASE_URL}/accessories/`
                  : `${BASE_URL}/${categoryKey}`,
            },
            {
              name: override?.pageName || match.name,
              url: override?.canonicalPath
                ? `${BASE_URL}${override.canonicalPath}`
                : `${BASE_URL}/${categoryKey}/${subcategory}`,
            },
          ]}
        />
      )}
      <SubcategoryPageClient
        categoryKey={categoryKey}
        subcategorySlug={subcategory}
        initialConfig={config}
        initialProducts={productsRes.items}
        initialTotal={productsRes.total}
        pageTitle={override?.pageName || match.name}
        pageDescription={override?.description}
      />
    </>
  );
}
