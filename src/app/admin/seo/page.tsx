"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Layout,
  FileText,
  HelpCircle,
  Sparkles,
  Code2,
  Eye,
} from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import ImageCropModal from "../../../components/shared/ImageCropModal";
import ConfirmModal from "../../../components/shared/ConfirmModal";

interface Faq {
  question: string;
  answer: string;
}

interface PageSection {
  title?: string;
  subtitle?: string;
  content?: string;
  items?: string[];
}

interface SeoData {
  pageKey: string;
  title: string;
  description: string;
  keywords: string;
  heroImage?: string | null;
  h1?: string | null;
  heroEyebrow?: string | null;
  sections?: PageSection[];
  content?: Record<string, any>;
  faqs: Faq[];
}

export interface PageDef {
  key: string;
  label: string;
  group: "Core Pages" | "Categories" | "Subcategories" | "Brands";
  path: string;
}

export const SEO_PAGES: PageDef[] = [
  { key: "home", label: "Homepage", group: "Core Pages", path: "/" },
  { key: "about-us", label: "About Us", group: "Core Pages", path: "/shoes-shop-in-india" },
  { key: "contact-us", label: "Contact Us", group: "Core Pages", path: "/shoes-shop-contact-numbers" },
  { key: "shipping-policy", label: "Shipping Info", group: "Core Pages", path: "/shipping-information" },
  { key: "returns-exchanges", label: "Returns & Exchanges", group: "Core Pages", path: "/returns-exchanges" },
  { key: "faqs", label: "FAQs", group: "Core Pages", path: "/faqs" },
  { key: "privacy-policy", label: "Privacy Policy", group: "Core Pages", path: "/privacy-policy" },
  { key: "terms-conditions", label: "Terms & Conditions", group: "Core Pages", path: "/terms-conditions" },
  { key: "order-tracking", label: "Order Tracking", group: "Core Pages", path: "/order-tracking" },
  { key: "journal", label: "Footwear Journal (Blog)", group: "Core Pages", path: "/footwears-journal" },
  { key: "trending", label: "Trending Shoes", group: "Core Pages", path: "/shoes-collection/trending-shoes" },
  { key: "best-sellers", label: "Best Selling Shoes", group: "Core Pages", path: "/shoes-collection/best-selling-shoes" },

  { key: "category-men", label: "Men's Category", group: "Categories", path: "/mens-shoes" },
  { key: "men-formal-shoes", label: "Men's Formal Shoes", group: "Subcategories", path: "/mens-shoes/formal-shoes-for-men" },
  { key: "men-casual-shoes", label: "Men's Casual Shoes", group: "Subcategories", path: "/mens-shoes/casual-shoes-for-men" },
  { key: "men-sneakers", label: "Men's Sneakers", group: "Subcategories", path: "/mens-shoes/sneakers-for-men" },
  { key: "men-sports-shoes", label: "Men's Sports Shoes", group: "Subcategories", path: "/mens-shoes/sports-shoes-for-men" },
  { key: "men-sandals", label: "Men's Sandals", group: "Subcategories", path: "/mens-shoes/mens-sandals" },
  { key: "men-slippers-flip-flops", label: "Men's Slippers & Flip Flops", group: "Subcategories", path: "/mens-shoes/slippers-flip-flops-for-men" },
  { key: "men-loafers", label: "Men's Loafers", group: "Subcategories", path: "/mens-shoes/loafers-for-men" },
  { key: "men-boots", label: "Men's Boots", group: "Subcategories", path: "/mens-shoes/mens-boots" },

  { key: "category-women", label: "Women's Category", group: "Categories", path: "/womens-shoes" },
  { key: "women-flats", label: "Women's Flats", group: "Subcategories", path: "/womens-shoes/womens-flats" },
  { key: "women-mojari-shoes", label: "Women's Mojari Shoes", group: "Subcategories", path: "/womens-shoes/mojari-shoes-for-women" },
  { key: "women-sandals", label: "Women's Sandals", group: "Subcategories", path: "/womens-shoes/sandals-for-women" },
  { key: "women-slippers", label: "Women's Slippers", group: "Subcategories", path: "/womens-shoes/slippers-for-women" },
  { key: "women-kolhapuri-chappal", label: "Women's Kolhapuri Chappal", group: "Subcategories", path: "/womens-shoes/kolhapuri-chappal-for-women" },

  { key: "category-kids", label: "Kids' Category", group: "Categories", path: "/kids-shoes" },
  { key: "kids-boys", label: "Kids' Boys", group: "Subcategories", path: "/kids-shoes/boys-shoes" },
  { key: "kids-girls", label: "Kids' Girls", group: "Subcategories", path: "/kids-shoes/girls-shoes" },
  { key: "kids-new-born-baby", label: "Kids' Baby Shoes", group: "Subcategories", path: "/kids-shoes/baby-shoes" },
  { key: "kids-toddler-2-5-years", label: "Kids' Toddler Shoes (2 to 5 Years)", group: "Subcategories", path: "/kids-shoes/toddler-shoes" },
  { key: "kids-big-kids-shoes-10-14-years", label: "Kids' Junior (10–14 Years)", group: "Subcategories", path: "/kids-shoes/junior-shoes" },
  { key: "kids-school-shoes", label: "Kids' School Shoes", group: "Subcategories", path: "/kids-shoes/school-shoes" },
  { key: "kids-casual-shoes", label: "Kids' Casual Shoes", group: "Subcategories", path: "/kids-shoes/kids-casual-shoes" },
  { key: "kids-sneakers", label: "Kids' Sneakers", group: "Subcategories", path: "/kids-shoes/kids-sneakers" },
  { key: "kids-sandals", label: "Kids' Sandals", group: "Subcategories", path: "/kids-shoes/kids-sandals" },
  { key: "kids-slippers", label: "Kids' Slippers", group: "Subcategories", path: "/kids-shoes/kids-slippers" },

  { key: "category-accessories", label: "Shoes Accessories", group: "Categories", path: "/accessories" },
  { key: "accessories-socks", label: "Accessories: Socks", group: "Subcategories", path: "/accessories/shoe-accessories/socks" },
  { key: "accessories-shoe-care-products", label: "Accessories: Shoes Care Products", group: "Subcategories", path: "/accessories/shoe-accessories/shoes-care-products" },
  { key: "accessories-shoes-polish", label: "Accessories: Shoe Polish", group: "Subcategories", path: "/accessories/shoe-accessories/shoe-polish" },
  { key: "accessories-shoes-brush", label: "Accessories: Shoe Brush", group: "Subcategories", path: "/accessories/shoe-accessories/shoe-brush" },

  { key: "guides", label: "Buying Guides Library", group: "Core Pages", path: "/guides" },
  { key: "sale", label: "Sale / Discounts", group: "Core Pages", path: "/sale" },

  { key: "brands", label: "Shoe Brands (Main Page)", group: "Core Pages", path: "/brands" },
  { key: "brand-sparx", label: "Brand: Sparx", group: "Brands", path: "/brands/sparx" },
  { key: "brand-nike", label: "Brand: Nike", group: "Brands", path: "/brands/nike" },
  { key: "brand-adda", label: "Brand: ADDA", group: "Brands", path: "/brands/adda" },
  { key: "brand-red-tape", label: "Brand: Red Tape", group: "Brands", path: "/brands/red-tape" },
  { key: "brand-jqr", label: "Brand: JQR", group: "Brands", path: "/brands/jqr" },
  { key: "brand-abros", label: "Brand: Abros", group: "Brands", path: "/brands/abros" },
  { key: "brand-lakhani", label: "Brand: Lakhani", group: "Brands", path: "/brands/lakhani" },
  { key: "brand-bata", label: "Brand: Bata", group: "Brands", path: "/brands/bata" },
  { key: "brand-liberty", label: "Brand: Liberty", group: "Brands", path: "/brands/liberty" },
  { key: "brand-action", label: "Brand: Action", group: "Brands", path: "/brands/action" },
];

function SeoForm({ page }: { page: PageDef }) {
  const { key: pageKey, label, path } = page;
  const [data, setData] = useState<SeoData>({
    pageKey,
    title: "",
    description: "",
    keywords: "",
    heroImage: null,
    h1: "",
    heroEyebrow: "",
    sections: [],
    content: {},
    faqs: [],
  });

  const [activeTab, setActiveTab] = useState<"hero" | "content" | "faqs" | "seo">("hero");
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("{}");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [confirmDeleteHero, setConfirmDeleteHero] = useState(false);
  const [cropField, setCropField] = useState<string>("heroImage");
  const [cropAspect, setCropAspect] = useState<number>(21 / 9);

  const startImageUpload = (field: string, aspect: number = 21 / 9) => {
    setCropField(field);
    setCropAspect(aspect);
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (expanded && loading) {
      adminApi.get<SeoData>(`/seo/${pageKey}`).then((res) => {
        const fullData: SeoData = {
          pageKey,
          title: res?.title || "",
          description: res?.description || "",
          keywords: res?.keywords || "",
          heroImage: res?.heroImage || null,
          h1: res?.h1 || "",
          heroEyebrow: res?.heroEyebrow || "",
          sections: Array.isArray(res?.sections) ? res.sections : [],
          content: res?.content && typeof res.content === "object" ? res.content : {},
          faqs: Array.isArray(res?.faqs) ? res.faqs : [],
        };
        setData(fullData);
        setJsonText(JSON.stringify(fullData.content || {}, null, 2));
        setLoading(false);
      });
    }
  }, [expanded, loading, pageKey]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    let contentToSave = data.content;
    if (jsonMode) {
      try {
        contentToSave = JSON.parse(jsonText);
        setData((prev) => ({ ...prev, content: contentToSave }));
        setJsonError(null);
      } catch (err: any) {
        setJsonError("Invalid JSON in content editor: " + err.message);
        setSaving(false);
        return;
      }
    }

    const payload = {
      ...data,
      content: contentToSave,
    };

    try {
      await adminApi.patch(`/seo/${pageKey}`, payload);
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setSaving(false);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Section helpers
  const addSection = () => {
    const newSections = [...(data.sections || []), { title: "", content: "", subtitle: "" }];
    setData({ ...data, sections: newSections });
  };

  const updateSection = (index: number, field: keyof PageSection, value: any) => {
    const newSections = [...(data.sections || [])];
    newSections[index] = { ...newSections[index], [field]: value };
    setData({ ...data, sections: newSections });
  };

  const removeSection = (index: number) => {
    const newSections = [...(data.sections || [])];
    newSections.splice(index, 1);
    setData({ ...data, sections: newSections });
  };

  // FAQ helpers
  const addFaq = () => {
    setData({ ...data, faqs: [...data.faqs, { question: "", answer: "" }] });
  };

  const updateFaq = (index: number, key: keyof Faq, value: string) => {
    const newFaqs = [...data.faqs];
    newFaqs[index][key] = value;
    setData({ ...data, faqs: newFaqs });
  };

  const removeFaq = (index: number) => {
    const newFaqs = [...data.faqs];
    newFaqs.splice(index, 1);
    setData({ ...data, faqs: newFaqs });
  };

  // Content block helper (for key-value in data.content)
  const updateContentField = (key: string, value: any) => {
    const newContent = { ...(data.content || {}), [key]: value };
    setData({ ...data, content: newContent });
    setJsonText(JSON.stringify(newContent, null, 2));
  };

  const updateNestedContent = (path: string[], value: any) => {
    const newContent = JSON.parse(JSON.stringify(data.content || {}));
    let curr = newContent;
    for (let i = 0; i < path.length - 1; i++) {
      if (!curr[path[i]] || typeof curr[path[i]] !== "object") {
        curr[path[i]] = {};
      }
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
    setData({ ...data, content: newContent });
    setJsonText(JSON.stringify(newContent, null, 2));
  };

  const getNestedContent = (path: string[], fallback: any = ""): any => {
    let curr: any = data.content;
    for (const p of path) {
      if (!curr || typeof curr !== "object") return fallback;
      curr = curr[p];
    }
    return curr !== undefined && curr !== null ? curr : fallback;
  };

  return (
    <div className="bg-white border border-charcoal-200 rounded-2xl mb-4 overflow-hidden shadow-sm hover:border-charcoal-300 transition-all">
      <div className="flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-charcoal-50/50 transition-colors">
        <button
          className="flex-1 flex items-center justify-between text-left mr-4"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <span className="font-poppins font-bold text-sm text-charcoal-900">{label}</span>
            <span className="text-xs text-charcoal-400 font-mono bg-charcoal-50 px-2 py-0.5 rounded border border-charcoal-150">
              {path}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg transition-colors ${
                expanded ? "bg-brand-orange text-white" : "bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200"
              }`}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-brand-orange font-poppins font-semibold bg-brand-orange/10 hover:bg-brand-orange/20 px-3 py-1.5 rounded-lg transition-colors"
          title="View Live Page"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Live</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {expanded && (
        <div className="p-5 sm:p-6 border-t border-charcoal-200 bg-charcoal-50/30">
          {loading ? (
            <div className="text-xs text-charcoal-500 font-inter py-6 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
              Loading page content and settings...
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-charcoal-200 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("hero")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins font-semibold transition-all ${
                    activeTab === "hero"
                      ? "bg-brand-orange text-white shadow-sm shadow-brand-orange/30"
                      : "bg-white text-charcoal-600 border border-charcoal-200 hover:bg-charcoal-50"
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" /> Hero & Header
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins font-semibold transition-all ${
                    activeTab === "content"
                      ? "bg-brand-orange text-white shadow-sm shadow-brand-orange/30"
                      : "bg-white text-charcoal-600 border border-charcoal-200 hover:bg-charcoal-50"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Page Content & Sections
                  {data.sections && data.sections.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-charcoal-900/10 text-[10px]">
                      {data.sections.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("faqs")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins font-semibold transition-all ${
                    activeTab === "faqs"
                      ? "bg-brand-orange text-white shadow-sm shadow-brand-orange/30"
                      : "bg-white text-charcoal-600 border border-charcoal-200 hover:bg-charcoal-50"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> FAQs
                  {data.faqs.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-charcoal-900/10 text-[10px]">
                      {data.faqs.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins font-semibold transition-all ${
                    activeTab === "seo"
                      ? "bg-brand-orange text-white shadow-sm shadow-brand-orange/30"
                      : "bg-white text-charcoal-600 border border-charcoal-200 hover:bg-charcoal-50"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> SEO & Meta Tags
                </button>
              </div>

              {/* TAB 1: HERO & HEADER */}
              {activeTab === "hero" && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-charcoal-200 shadow-sm">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-poppins font-semibold text-charcoal-700 block mb-1.5 uppercase tracking-wide">
                        Main Heading (H1)
                      </label>
                      <input
                        value={data.h1 || ""}
                        onChange={(e) => setData({ ...data, h1: e.target.value })}
                        placeholder={`e.g. ${label}`}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white"
                      />
                      <span className="text-[11px] text-charcoal-400 mt-1 block">
                        Displays as the primary H1 title on the page hero. Defaults to &quot;{label}&quot; if empty.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-poppins font-semibold text-charcoal-700 block mb-1.5 uppercase tracking-wide">
                        Eyebrow Badge / Tagline
                      </label>
                      <input
                        value={data.heroEyebrow || ""}
                        onChange={(e) => setData({ ...data, heroEyebrow: e.target.value })}
                        placeholder="e.g. Our Heritage, We're Here To Help, Collection"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white"
                      />
                      <span className="text-[11px] text-charcoal-400 mt-1 block">
                        Small badge text appearing right above the H1 heading.
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-poppins font-semibold text-charcoal-700 block mb-1.5 uppercase tracking-wide">
                      Hero Subtitle / Description Text
                    </label>
                    <textarea
                      value={data.description || ""}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                      rows={3}
                      placeholder="Explains the purpose or highlights of this page..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white resize-none"
                    />
                    <span className="text-[11px] text-charcoal-400 mt-1 block">
                      Shown under the H1 on the storefront and used as the default meta description.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-poppins font-semibold text-charcoal-700 block mb-1.5 uppercase tracking-wide">
                      Hero Banner Image / Thumbnail
                    </label>
                    <div className="flex flex-col gap-2">
                      {data.heroImage && (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-charcoal-200 group bg-charcoal-900">
                          <img
                            src={data.heroImage}
                            alt="Hero Preview"
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          />
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteHero(true)}
                            className="absolute top-2 right-2 bg-charcoal-900/80 text-white p-2 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                            title="Remove Image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => startImageUpload("heroImage", 21 / 9)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white flex justify-center text-center items-center hover:bg-charcoal-50 cursor-pointer font-semibold transition-colors"
                      >
                        <ImageIcon className="w-4 h-4 mr-2 text-charcoal-500" />
                        {data.heroImage ? "Replace Hero Image" : "Upload Hero Image"}
                      </button>

                      {pageKey === "home" && (
                        <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-charcoal-100">
                          <div>
                            <label className="text-xs font-poppins font-semibold text-charcoal-700 block mb-1 uppercase tracking-wide">
                              Primary Button (Label &amp; Link)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={getNestedContent(["hero", "primaryLinkLabel"], "")}
                                onChange={(e) => updateNestedContent(["hero", "primaryLinkLabel"], e.target.value)}
                                placeholder="Shop Men"
                                className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-inter bg-white"
                              />
                              <input
                                value={getNestedContent(["hero", "primaryLinkHref"], "")}
                                onChange={(e) => updateNestedContent(["hero", "primaryLinkHref"], e.target.value)}
                                placeholder="/mens-shoes"
                                className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-inter bg-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-poppins font-semibold text-charcoal-700 block mb-1 uppercase tracking-wide">
                              Secondary Button (Label &amp; Link)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={getNestedContent(["hero", "secondaryLinkLabel"], "")}
                                onChange={(e) => updateNestedContent(["hero", "secondaryLinkLabel"], e.target.value)}
                                placeholder="Shop Women"
                                className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-inter bg-white"
                              />
                              <input
                                value={getNestedContent(["hero", "secondaryLinkHref"], "")}
                                onChange={(e) => updateNestedContent(["hero", "secondaryLinkHref"], e.target.value)}
                                placeholder="/womens-shoes"
                                className="w-full px-3 py-2 rounded-xl border border-charcoal-200 text-xs font-inter bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setCropImageSrc(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PAGE CONTENT & SECTIONS */}
              {activeTab === "content" && (
                <div className="space-y-6">
                  {/* Mode switch */}
                  <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-charcoal-200">
                    <div>
                      <span className="font-poppins font-bold text-xs text-charcoal-900 block uppercase tracking-wide">
                        Content Editor Mode
                      </span>
                      <span className="text-[11px] text-charcoal-400 font-inter">
                        {jsonMode
                          ? "Editing raw JSON structure for advanced page objects"
                          : "Visual section blocks builder"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setJsonMode(!jsonMode)}
                      className="flex items-center gap-1.5 text-xs font-poppins font-semibold px-3 py-1.5 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 text-charcoal-700 transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5 text-brand-orange" />
                      {jsonMode ? "Switch to Visual Blocks" : "Switch to Raw JSON"}
                    </button>
                  </div>

                  {jsonMode ? (
                    <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-2">
                      <label className="text-xs font-poppins font-semibold text-charcoal-700 block uppercase tracking-wide">
                        Page JSON Content Payload
                      </label>
                      <p className="text-xs text-charcoal-500 font-inter leading-relaxed">
                        Customize structured objects (e.g. story paragraphs, stats, contact cards, slides).
                      </p>
                      <textarea
                        value={jsonText}
                        onChange={(e) => {
                          setJsonText(e.target.value);
                          setJsonError(null);
                        }}
                        rows={14}
                        className="w-full font-mono text-xs p-3.5 rounded-xl border border-charcoal-200 bg-charcoal-900 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                      {jsonError && <p className="text-xs text-red-600 font-semibold">{jsonError}</p>}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Contextual helpers for specific pages */}
                      {pageKey === "home" && (
                        <div className="space-y-6">
                          {/* 1. Explore Collections Section */}
                          <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-charcoal-100 pb-2.5">
                              <Sparkles className="w-4 h-4 text-brand-orange" />
                              <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide">
                                1. Explore Collections Section
                              </h4>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Heading Text
                                </label>
                                <input
                                  value={getNestedContent(["exploreCollections", "heading"], "")}
                                  onChange={(e) => updateNestedContent(["exploreCollections", "heading"], e.target.value)}
                                  placeholder="Explore (default)"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Highlight Word (Orange)
                                </label>
                                <input
                                  value={getNestedContent(["exploreCollections", "headingHighlight"], "")}
                                  onChange={(e) => updateNestedContent(["exploreCollections", "headingHighlight"], e.target.value)}
                                  placeholder="Collections (default)"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                Description Text
                              </label>
                              <textarea
                                value={getNestedContent(["exploreCollections", "description"], "")}
                                onChange={(e) => updateNestedContent(["exploreCollections", "description"], e.target.value)}
                                placeholder="Discover our meticulously curated selection of premium footwear and accessories, designed for every occasion."
                                rows={2}
                                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter resize-none bg-white"
                              />
                            </div>
                          </div>

                          {/* 2. Category / Gender Banners (Men, Women, Kids) */}
                          <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-charcoal-100 pb-2.5">
                              <Layout className="w-4 h-4 text-brand-orange" />
                              <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide">
                                2. Category Banners (Men, Women, Kids)
                              </h4>
                            </div>

                            <div className="grid md:grid-cols-3 gap-5">
                              {/* Men's Banner */}
                              <div className="bg-charcoal-50/70 p-4 rounded-xl border border-charcoal-200 space-y-3">
                                <span className="text-xs font-poppins font-bold text-charcoal-900 block uppercase tracking-wide">
                                  Men&apos;s Banner
                                </span>
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-charcoal-200 border border-charcoal-200 group">
                                  <img
                                    src={getNestedContent(["genderBanners", "men", "image"], "/images/category/men-catt.png")}
                                    alt="Men Banner"
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => startImageUpload("content.genderBanners.men.image", 1)}
                                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-semibold"
                                  >
                                    <ImageIcon className="w-4 h-4" /> Change Image
                                  </button>
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Title</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "men", "title"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "men", "title"], e.target.value)}
                                    placeholder="MENS"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Subtitle (Script)</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "men", "subtitle"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "men", "subtitle"], e.target.value)}
                                    placeholder="Casuals"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Button Text</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "men", "linkLabel"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "men", "linkLabel"], e.target.value)}
                                    placeholder="Shop Now"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Link URL</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "men", "linkHref"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "men", "linkHref"], e.target.value)}
                                    placeholder="/mens-shoes/casual-shoes-for-men"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                              </div>

                              {/* Women's Banner */}
                              <div className="bg-charcoal-50/70 p-4 rounded-xl border border-charcoal-200 space-y-3">
                                <span className="text-xs font-poppins font-bold text-charcoal-900 block uppercase tracking-wide">
                                  Women&apos;s Banner
                                </span>
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-charcoal-200 border border-charcoal-200 group">
                                  <img
                                    src={getNestedContent(["genderBanners", "women", "image"], "/images/category/women-catt.png")}
                                    alt="Women Banner"
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => startImageUpload("content.genderBanners.women.image", 1)}
                                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-semibold"
                                  >
                                    <ImageIcon className="w-4 h-4" /> Change Image
                                  </button>
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Title</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "women", "title"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "women", "title"], e.target.value)}
                                    placeholder="WOMENS"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Subtitle (Script)</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "women", "subtitle"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "women", "subtitle"], e.target.value)}
                                    placeholder="Heels"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Button Text</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "women", "linkLabel"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "women", "linkLabel"], e.target.value)}
                                    placeholder="Shop Now"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Link URL</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "women", "linkHref"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "women", "linkHref"], e.target.value)}
                                    placeholder="/women/heels"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                              </div>

                              {/* Kids' Banner */}
                              <div className="bg-charcoal-50/70 p-4 rounded-xl border border-charcoal-200 space-y-3">
                                <span className="text-xs font-poppins font-bold text-charcoal-900 block uppercase tracking-wide">
                                  Kids&apos; Banner
                                </span>
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-charcoal-200 border border-charcoal-200 group">
                                  <img
                                    src={getNestedContent(["genderBanners", "kids", "image"], "/images/category/kids-catt.png")}
                                    alt="Kids Banner"
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => startImageUpload("content.genderBanners.kids.image", 1983 / 793)}
                                    className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-semibold"
                                  >
                                    <ImageIcon className="w-4 h-4" /> Change Image
                                  </button>
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Title</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "kids", "title"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "kids", "title"], e.target.value)}
                                    placeholder="KIDS"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Subtitle (Script)</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "kids", "subtitle"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "kids", "subtitle"], e.target.value)}
                                    placeholder="Collection"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Button Text</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "kids", "linkLabel"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "kids", "linkLabel"], e.target.value)}
                                    placeholder="Shop Now"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-charcoal-600 block mb-0.5 uppercase">Link URL</label>
                                  <input
                                    value={getNestedContent(["genderBanners", "kids", "linkHref"], "")}
                                    onChange={(e) => updateNestedContent(["genderBanners", "kids", "linkHref"], e.target.value)}
                                    placeholder="/kids"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Product & Brand Headings */}
                          <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-charcoal-100 pb-2.5">
                              <Sparkles className="w-4 h-4 text-brand-orange" />
                              <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide">
                                3. Product &amp; Brand Sections
                              </h4>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              {/* New Arrivals */}
                              <div className="bg-charcoal-50/70 p-4 rounded-xl border border-charcoal-200 space-y-2.5">
                                <span className="text-xs font-poppins font-bold text-charcoal-900 block">New Arrivals Heading</span>
                                <div>
                                  <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Hook / Eyebrow</label>
                                  <input
                                    value={getNestedContent(["newArrivals", "hook"], "")}
                                    onChange={(e) => updateNestedContent(["newArrivals", "hook"], e.target.value)}
                                    placeholder="Just In"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Heading</label>
                                    <input
                                      value={getNestedContent(["newArrivals", "heading"], "")}
                                      onChange={(e) => updateNestedContent(["newArrivals", "heading"], e.target.value)}
                                      placeholder="New"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Highlight</label>
                                    <input
                                      value={getNestedContent(["newArrivals", "headingHighlight"], "")}
                                      onChange={(e) => updateNestedContent(["newArrivals", "headingHighlight"], e.target.value)}
                                      placeholder="Arrivals"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Best Sellers */}
                              <div className="bg-charcoal-50/70 p-4 rounded-xl border border-charcoal-200 space-y-2.5">
                                <span className="text-xs font-poppins font-bold text-charcoal-900 block">Best Sellers Heading</span>
                                <div>
                                  <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Hook / Eyebrow</label>
                                  <input
                                    value={getNestedContent(["bestSellers", "hook"], "")}
                                    onChange={(e) => updateNestedContent(["bestSellers", "hook"], e.target.value)}
                                    placeholder="Customer Favorites"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Heading</label>
                                    <input
                                      value={getNestedContent(["bestSellers", "heading"], "")}
                                      onChange={(e) => updateNestedContent(["bestSellers", "heading"], e.target.value)}
                                      placeholder="Best"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Highlight</label>
                                    <input
                                      value={getNestedContent(["bestSellers", "headingHighlight"], "")}
                                      onChange={(e) => updateNestedContent(["bestSellers", "headingHighlight"], e.target.value)}
                                      placeholder="Sellers"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Description</label>
                                  <input
                                    value={getNestedContent(["bestSellers", "description"], "")}
                                    onChange={(e) => updateNestedContent(["bestSellers", "description"], e.target.value)}
                                    placeholder="Top-rated styles loved by thousands of customers"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Link Text</label>
                                    <input
                                      value={getNestedContent(["bestSellers", "viewAllLabel"], "")}
                                      onChange={(e) => updateNestedContent(["bestSellers", "viewAllLabel"], e.target.value)}
                                      placeholder="View All"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Link URL</label>
                                    <input
                                      value={getNestedContent(["bestSellers", "viewAllHref"], "")}
                                      onChange={(e) => updateNestedContent(["bestSellers", "viewAllHref"], e.target.value)}
                                      placeholder="/shoes-collection/best-selling-shoes"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Brands Section */}
                              <div className="bg-charcoal-50/70 p-4 rounded-xl border border-charcoal-200 space-y-2.5">
                                <span className="text-xs font-poppins font-bold text-charcoal-900 block">Discover Brands</span>
                                <div>
                                  <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Hook / Eyebrow</label>
                                  <input
                                    value={getNestedContent(["brandsSection", "hook"], "")}
                                    onChange={(e) => updateNestedContent(["brandsSection", "hook"], e.target.value)}
                                    placeholder="Premium Partners"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Heading</label>
                                    <input
                                      value={getNestedContent(["brandsSection", "heading"], "")}
                                      onChange={(e) => updateNestedContent(["brandsSection", "heading"], e.target.value)}
                                      placeholder="Discover"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Highlight</label>
                                    <input
                                      value={getNestedContent(["brandsSection", "headingHighlight"], "")}
                                      onChange={(e) => updateNestedContent(["brandsSection", "headingHighlight"], e.target.value)}
                                      placeholder="Brands"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Featured Collections */}
                              <div className="bg-charcoal-50/70 p-4 rounded-xl border border-charcoal-200 space-y-2.5">
                                <span className="text-xs font-poppins font-bold text-charcoal-900 block">Featured Collections</span>
                                <div>
                                  <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Hook / Eyebrow</label>
                                  <input
                                    value={getNestedContent(["featuredCollections", "hook"], "")}
                                    onChange={(e) => updateNestedContent(["featuredCollections", "hook"], e.target.value)}
                                    placeholder="Curated for You"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Heading</label>
                                    <input
                                      value={getNestedContent(["featuredCollections", "heading"], "")}
                                      onChange={(e) => updateNestedContent(["featuredCollections", "heading"], e.target.value)}
                                      placeholder="Featured"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Highlight</label>
                                    <input
                                      value={getNestedContent(["featuredCollections", "headingHighlight"], "")}
                                      onChange={(e) => updateNestedContent(["featuredCollections", "headingHighlight"], e.target.value)}
                                      placeholder="Collections"
                                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-charcoal-600 block mb-0.5">Description</label>
                                  <input
                                    value={getNestedContent(["featuredCollections", "description"], "")}
                                    onChange={(e) => updateNestedContent(["featuredCollections", "description"], e.target.value)}
                                    placeholder="Handpicked styles for every occasion — from office to wedding day"
                                    className="w-full px-3 py-1.5 rounded-lg border border-charcoal-200 text-xs font-inter bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 4. Customer Reviews Section */}
                          <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-charcoal-100 pb-2.5">
                              <Sparkles className="w-4 h-4 text-brand-orange" />
                              <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide">
                                4. Customer Reviews &amp; Testimonials
                              </h4>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Eyebrow Hook
                                </label>
                                <input
                                  value={getNestedContent(["customerReviews", "hook"], "")}
                                  onChange={(e) => updateNestedContent(["customerReviews", "hook"], e.target.value)}
                                  placeholder="Loved by Families"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Rating Summary Text
                                </label>
                                <input
                                  value={getNestedContent(["customerReviews", "ratingSummary"], "")}
                                  onChange={(e) => updateNestedContent(["customerReviews", "ratingSummary"], e.target.value)}
                                  placeholder="4.6 out of 5 · 12,000+ reviews"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Heading
                                </label>
                                <input
                                  value={getNestedContent(["customerReviews", "heading"], "")}
                                  onChange={(e) => updateNestedContent(["customerReviews", "heading"], e.target.value)}
                                  placeholder="What Our"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Highlight Word
                                </label>
                                <input
                                  value={getNestedContent(["customerReviews", "headingHighlight"], "")}
                                  onChange={(e) => updateNestedContent(["customerReviews", "headingHighlight"], e.target.value)}
                                  placeholder="Customers Say"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* 5. Why Choose Ansari Footwear */}
                          <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-charcoal-100 pb-2.5">
                              <Sparkles className="w-4 h-4 text-brand-orange" />
                              <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide">
                                5. Why Choose Ansari Footwear
                              </h4>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Eyebrow Hook
                                </label>
                                <input
                                  value={getNestedContent(["whyChooseUs", "hook"], "")}
                                  onChange={(e) => updateNestedContent(["whyChooseUs", "hook"], e.target.value)}
                                  placeholder="Our Promise"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Description
                                </label>
                                <input
                                  value={getNestedContent(["whyChooseUs", "description"], "")}
                                  onChange={(e) => updateNestedContent(["whyChooseUs", "description"], e.target.value)}
                                  placeholder="A heritage of trust built on quality, value, and customer care"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Heading
                                </label>
                                <input
                                  value={getNestedContent(["whyChooseUs", "heading"], "")}
                                  onChange={(e) => updateNestedContent(["whyChooseUs", "heading"], e.target.value)}
                                  placeholder="Why Choose"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Highlight Word
                                </label>
                                <input
                                  value={getNestedContent(["whyChooseUs", "headingHighlight"], "")}
                                  onChange={(e) => updateNestedContent(["whyChooseUs", "headingHighlight"], e.target.value)}
                                  placeholder="Ansary Footwear"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                Feature Photo
                              </label>
                              <div className="flex items-center gap-4">
                                <div className="w-32 h-20 rounded-xl overflow-hidden bg-charcoal-100 border border-charcoal-200 relative group">
                                  <img
                                    src={getNestedContent(["whyChooseUs", "image"], "/images/why-choose.png")}
                                    alt="Why Choose Photo"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => startImageUpload("content.whyChooseUs.image", 4 / 3)}
                                  className="px-4 py-2 rounded-xl border border-charcoal-200 text-xs font-poppins font-semibold hover:bg-charcoal-50 flex items-center gap-1.5"
                                >
                                  <ImageIcon className="w-3.5 h-3.5 text-brand-orange" />
                                  Upload New Photo
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 6. Community Showcase */}
                          <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-charcoal-100 pb-2.5">
                              <Sparkles className="w-4 h-4 text-brand-orange" />
                              <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide">
                                6. Community Showcase (&quot;See how our community wears it&quot;)
                              </h4>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Eyebrow Hook
                                </label>
                                <input
                                  value={getNestedContent(["community", "hook"], "")}
                                  onChange={(e) => updateNestedContent(["community", "hook"], e.target.value)}
                                  placeholder="The Ansari Community"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Subheading
                                </label>
                                <input
                                  value={getNestedContent(["community", "subheading"], "")}
                                  onChange={(e) => updateNestedContent(["community", "subheading"], e.target.value)}
                                  placeholder="@ansarifootwear · Tag us to be featured · Watch, discover, shop."
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Heading
                                </label>
                                <input
                                  value={getNestedContent(["community", "heading"], "")}
                                  onChange={(e) => updateNestedContent(["community", "heading"], e.target.value)}
                                  placeholder="See how our"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                  Highlight Word
                                </label>
                                <input
                                  value={getNestedContent(["community", "headingHighlight"], "")}
                                  onChange={(e) => updateNestedContent(["community", "headingHighlight"], e.target.value)}
                                  placeholder="community"
                                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {pageKey === "about-us" && (
                        <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4">
                          <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide border-b border-charcoal-100 pb-2">
                            About Us: Story & Heritage Settings
                          </h4>
                          <div>
                            <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                              Story Section Title
                            </label>
                            <input
                              value={data.content?.storyTitle || ""}
                              onChange={(e) => updateContentField("storyTitle", e.target.value)}
                              placeholder="Our Story (default)"
                              className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                              Story Paragraphs (separate paragraphs with double line breaks)
                            </label>
                            <textarea
                              value={data.content?.storyText || ""}
                              onChange={(e) => updateContentField("storyText", e.target.value)}
                              rows={4}
                              placeholder="Enter customized history or story text..."
                              className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter"
                            />
                          </div>
                        </div>
                      )}

                      {pageKey === "contact-us" && (
                        <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4">
                          <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide border-b border-charcoal-100 pb-2">
                            Contact Us: Store Details
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                Phone Number
                              </label>
                              <input
                                value={data.content?.phone || ""}
                                onChange={(e) => updateContentField("phone", e.target.value)}
                                placeholder="+91 98765 43210 (default)"
                                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                Support Email
                              </label>
                              <input
                                value={data.content?.email || ""}
                                onChange={(e) => updateContentField("email", e.target.value)}
                                placeholder="care@ansarifootwear.com (default)"
                                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                Physical Store Address
                              </label>
                              <input
                                value={data.content?.address || ""}
                                onChange={(e) => updateContentField("address", e.target.value)}
                                placeholder="123 Fashion Street, Mumbai, Maharashtra 400001 (default)"
                                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="text-xs font-poppins font-semibold text-charcoal-600 block mb-1">
                                Store Hours
                              </label>
                              <input
                                value={data.content?.storeHours || ""}
                                onChange={(e) => updateContentField("storeHours", e.target.value)}
                                placeholder="Mon–Sat: 10 AM – 8:30 PM, Sunday: 11 AM – 6 PM (default)"
                                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Generic Structured Sections Builder */}
                      <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4">
                        <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
                          <div>
                            <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide">
                              Structured Body Sections
                            </h4>
                            <p className="text-[11px] text-charcoal-400 font-inter">
                              Add custom content sections with headings, descriptions, and paragraphs.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={addSection}
                            className="flex items-center gap-1 text-xs font-poppins font-bold text-white bg-brand-orange hover:bg-orange-600 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Section
                          </button>
                        </div>

                        {data.sections && data.sections.length > 0 ? (
                          <div className="space-y-4">
                            {data.sections.map((section, idx) => (
                              <div
                                key={idx}
                                className="bg-charcoal-50 p-4 rounded-xl border border-charcoal-200 space-y-3 relative group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-poppins font-bold text-charcoal-500 uppercase tracking-wider">
                                    Section #{idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeSection(idx)}
                                    className="text-charcoal-400 hover:text-red-600 p-1 transition-colors"
                                    title="Delete Section"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <div>
                                  <label className="text-[10px] font-poppins font-semibold text-charcoal-600 block mb-1 uppercase tracking-wide">
                                    Section Title
                                  </label>
                                  <input
                                    value={section.title || ""}
                                    onChange={(e) => updateSection(idx, "title", e.target.value)}
                                    placeholder="e.g. Information Stored in Your Browser"
                                    className="w-full px-3 py-2 rounded-lg border border-charcoal-200 text-sm font-inter bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-poppins font-semibold text-charcoal-600 block mb-1 uppercase tracking-wide">
                                    Section Subtitle / Tagline (Optional)
                                  </label>
                                  <input
                                    value={section.subtitle || ""}
                                    onChange={(e) => updateSection(idx, "subtitle", e.target.value)}
                                    placeholder="Optional secondary heading"
                                    className="w-full px-3 py-2 rounded-lg border border-charcoal-200 text-sm font-inter bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-poppins font-semibold text-charcoal-600 block mb-1 uppercase tracking-wide">
                                    Body Content
                                  </label>
                                  <textarea
                                    value={section.content || ""}
                                    onChange={(e) => updateSection(idx, "content", e.target.value)}
                                    rows={3}
                                    placeholder="Section paragraphs and text details..."
                                    className="w-full px-3 py-2 rounded-lg border border-charcoal-200 text-sm font-inter bg-white resize-none"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-charcoal-200 rounded-xl">
                            <FileText className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
                            <p className="text-xs text-charcoal-500 font-inter">
                              No custom body sections added. The page will use its standard built-in layout.
                            </p>
                            <button
                              type="button"
                              onClick={addSection}
                              className="mt-3 text-xs font-poppins font-bold text-brand-orange hover:underline inline-flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add First Section
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FAQS */}
              {activeTab === "faqs" && (
                <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
                    <div>
                      <h4 className="font-poppins font-bold text-xs text-charcoal-900 uppercase tracking-wide">
                        Frequently Asked Questions (Rich Snippets)
                      </h4>
                      <p className="text-[11px] text-charcoal-400 font-inter">
                        These appear in the on-page FAQ accordion and Google Rich Search Results.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addFaq}
                      className="flex items-center gap-1 text-xs font-poppins font-bold text-white bg-brand-orange hover:bg-orange-600 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add FAQ
                    </button>
                  </div>

                  {pageKey === "home" && (
                    <div className="bg-charcoal-50/70 p-4 rounded-xl border border-charcoal-200">
                      <label className="text-xs font-poppins font-semibold text-charcoal-700 block mb-1 uppercase tracking-wide">
                        FAQ Section Subtitle
                      </label>
                      <input
                        value={getNestedContent(["faqSection", "subtitle"], "")}
                        onChange={(e) => updateNestedContent(["faqSection", "subtitle"], e.target.value)}
                        placeholder="Everything you need to know before you shop with us."
                        className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-sm font-inter bg-white"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {data.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="bg-charcoal-50 border border-charcoal-200 p-4 rounded-xl flex flex-col gap-3 relative"
                      >
                        <button
                          type="button"
                          onClick={() => removeFaq(i)}
                          className="absolute top-3 right-3 text-charcoal-400 hover:text-red-500"
                          title="Remove FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-poppins font-semibold text-charcoal-400 absolute top-3 left-4">
                          #{i + 1}
                        </span>

                        <div className="mt-4">
                          <label className="text-[10px] font-poppins font-semibold text-charcoal-600 block mb-1 uppercase tracking-wide">
                            Question
                          </label>
                          <input
                            value={faq.question}
                            onChange={(e) => updateFaq(i, "question", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-poppins font-semibold text-charcoal-600 block mb-1 uppercase tracking-wide">
                            Answer
                          </label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFaq(i, "answer", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    {data.faqs.length === 0 && (
                      <span className="text-xs text-charcoal-400 font-inter italic py-4 text-center">
                        No custom FAQs added for this page yet.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: SEO & META */}
              {activeTab === "seo" && (
                <div className="bg-white p-5 rounded-2xl border border-charcoal-200 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-poppins font-semibold text-charcoal-700 uppercase tracking-wide">
                        SEO Meta Title
                      </label>
                      <span
                        className={`text-[10px] font-mono ${
                          (data.title || "").length > 60 ? "text-amber-600 font-bold" : "text-charcoal-400"
                        }`}
                      >
                        {(data.title || "").length} / 60 chars
                      </span>
                    </div>
                    <input
                      value={data.title || ""}
                      onChange={(e) => setData({ ...data, title: e.target.value })}
                      placeholder="e.g. Premium Footwear | Ansary Footwear"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-poppins font-semibold text-charcoal-700 uppercase tracking-wide">
                        Meta Description
                      </label>
                      <span
                        className={`text-[10px] font-mono ${
                          (data.description || "").length > 160 ? "text-amber-600 font-bold" : "text-charcoal-400"
                        }`}
                      >
                        {(data.description || "").length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      value={data.description || ""}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                      rows={3}
                      placeholder="Shop premium footwear..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-poppins font-semibold text-charcoal-700 block mb-1.5 uppercase tracking-wide">
                      Target Keywords (comma-separated)
                    </label>
                    <input
                      value={data.keywords || ""}
                      onChange={(e) => setData({ ...data, keywords: e.target.value })}
                      placeholder="shoes, boots, sneakers..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white"
                    />
                  </div>
                </div>
              )}

              {/* SAVE ACTION BAR */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-charcoal-200 flex items-center justify-between shadow-lg">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white font-poppins font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-brand-orange/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Page Content"}
                </button>
                {success && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-poppins font-bold uppercase tracking-wide animate-pulse">
                    <CheckCircle2 className="w-4 h-4" /> Saved Successfully!
                  </span>
                )}
              </div>
            </form>
          )}

          {cropImageSrc && (
            <ImageCropModal
              imageSrc={cropImageSrc}
              onClose={() => setCropImageSrc(null)}
              onCropped={(url) => {
                if (cropField === "heroImage") {
                  setData({ ...data, heroImage: url });
                } else if (cropField.startsWith("content.")) {
                  const path = cropField.replace("content.", "").split(".");
                  updateNestedContent(path, url);
                }
                setCropImageSrc(null);
              }}
              aspectRatio={cropAspect}
            />
          )}

          <ConfirmModal
            isOpen={confirmDeleteHero}
            title="Remove Hero Image"
            message="Are you sure you want to remove this hero image? The page will revert to its default hero image."
            confirmText="Remove Image"
            danger={true}
            onClose={() => setConfirmDeleteHero(false)}
            onConfirm={async () => {
              const newData = { ...data, heroImage: null };
              setData(newData);
              try {
                await adminApi.patch(`/seo/${pageKey}`, newData);
              } catch (e) {}
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminSeoPage() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

  const groups = ["All", ...Array.from(new Set(SEO_PAGES.map((p) => p.group)))];

  const filteredPages = SEO_PAGES.filter((p) => {
    const matchesSearch =
      p.label.toLowerCase().includes(search.toLowerCase()) ||
      p.key.toLowerCase().includes(search.toLowerCase()) ||
      p.path.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === "All" || p.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-2xl lg:text-3xl tracking-tight flex items-center gap-2.5">
            <Layout className="w-7 h-7 text-brand-orange" strokeWidth={2.5} />
            Pages & SEO Content Manager
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 font-inter mt-1.5">
            Manage full page headings, body content, images, rich snippet FAQs, and SEO tags across all storefront pages.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-charcoal-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages by name or URL..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-charcoal-200 text-xs font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {groups.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1.5 rounded-xl text-xs font-poppins font-semibold transition-all ${
                selectedGroup === group
                  ? "bg-brand-orange text-white shadow-sm shadow-brand-orange/30"
                  : "bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100 border border-charcoal-200/60"
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Pages List */}
      <div className="w-full">
        {filteredPages.length > 0 ? (
          filteredPages.map((page) => <SeoForm key={page.key} page={page} />)
        ) : (
          <div className="bg-white rounded-2xl border border-charcoal-200 p-12 text-center">
            <Search className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
            <h4 className="font-poppins font-bold text-sm text-charcoal-800">No pages matched your filter</h4>
            <p className="text-xs text-charcoal-400 font-inter mt-1">Try clearing the search input or changing the category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
