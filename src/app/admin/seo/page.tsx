"use client";

import { useEffect, useState } from "react";
import { Search, Save, CheckCircle2, ChevronDown, ChevronUp, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";
import { useRef } from "react";
import ImageCropModal from "../../../components/shared/ImageCropModal";
import ConfirmModal from "../../../components/shared/ConfirmModal";

interface Faq {
  question: string;
  answer: string;
}

interface SeoData {
  pageKey: string;
  title: string;
  description: string;
  keywords: string;
  heroImage?: string;
  faqs: Faq[];
}

const SEO_PAGES = [
  { key: "home", label: "Homepage", group: "Core Pages" },
  { key: "about-us", label: "About Us", group: "Core Pages" },
  { key: "contact-us", label: "Contact Us", group: "Core Pages" },
  { key: "shipping-policy", label: "Shipping Info", group: "Core Pages" },
  { key: "returns-exchanges", label: "Returns & Exchanges", group: "Core Pages" },
  { key: "faqs", label: "FAQs", group: "Core Pages" },
  { key: "privacy-policy", label: "Privacy Policy", group: "Core Pages" },
  { key: "terms-conditions", label: "Terms & Conditions", group: "Core Pages" },
  { key: "order-tracking", label: "Order Tracking", group: "Core Pages" },
  { key: "journal", label: "Footwear Journal (Blog)", group: "Core Pages" },
  { key: "trending", label: "Trending Shoes", group: "Core Pages" },
  { key: "best-sellers", label: "Best Selling Shoes", group: "Core Pages" },
  { key: "category-men", label: "Men's Category", group: "Categories" },
  { key: "men-formal-shoes", label: "Men's Formal Shoes", group: "Subcategories" },
  { key: "men-casual-shoes", label: "Men's Casual Shoes", group: "Subcategories" },
  { key: "men-sneakers", label: "Men's Sneakers", group: "Subcategories" },
  { key: "men-sports-shoes", label: "Men's Sports Shoes", group: "Subcategories" },
  { key: "men-sandals", label: "Men's Sandals", group: "Subcategories" },
  { key: "men-slippers-flip-flops", label: "Men's Slippers & Flip Flops", group: "Subcategories" },
  { key: "men-loafers", label: "Men's Loafers", group: "Subcategories" },
  { key: "men-boots", label: "Men's Boots", group: "Subcategories" },
  { key: "category-women", label: "Women's Category", group: "Categories" },
  { key: "women-flats", label: "Women's Flats", group: "Subcategories" },
  { key: "women-mojari-shoes", label: "Women's Mojari Shoes", group: "Subcategories" },
  { key: "women-sandals", label: "Women's Sandals", group: "Subcategories" },
  { key: "women-slippers", label: "Women's Slippers", group: "Subcategories" },
  { key: "women-kolhapuri-chappal", label: "Women's Kolhapuri Chappal", group: "Subcategories" },
  { key: "category-kids", label: "Kids' Category", group: "Categories" },
  { key: "kids-boys", label: "Kids' Boys", group: "Subcategories" },
  { key: "kids-girls", label: "Kids' Girls", group: "Subcategories" },
  { key: "kids-new-born-baby", label: "Kids' Baby Shoes", group: "Subcategories" },
  { key: "kids-toddler-2-5-years", label: "Kids' Toddler Shoes (2 to 5 Years)", group: "Subcategories" },
  { key: "kids-big-kids-shoes-10-14-years", label: "Kids' Junior (10–14 Years)", group: "Subcategories" },
  { key: "kids-school-shoes", label: "Kids' School Shoes", group: "Subcategories" },
  { key: "kids-casual-shoes", label: "Kids' Casual Shoes", group: "Subcategories" },
  { key: "kids-sneakers", label: "Kids' Sneakers", group: "Subcategories" },
  { key: "kids-sandals", label: "Kids' Sandals", group: "Subcategories" },
  { key: "kids-slippers", label: "Kids' Slippers", group: "Subcategories" },
  { key: "accessories-socks", label: "Accessories: Socks", group: "Subcategories" },
  { key: "accessories-shoe-care-products", label: "Accessories: Shoes Care Products", group: "Subcategories" },
  { key: "accessories-shoes-polish", label: "Accessories: Shoe Polish", group: "Subcategories" },
  { key: "accessories-shoes-brush", label: "Accessories: Shoe Brush", group: "Subcategories" },
  { key: "category-accessories", label: "Shoes Accessories", group: "Categories" },
  { key: "guides", label: "Buying Guides Library", group: "Core Pages" },
  { key: "sale", label: "Sale / Discounts", group: "Core Pages" },
  { key: "brands", label: "Shoe Brands (Main Page)", group: "Core Pages" },
  { key: "brand-sparx", label: "Brand: Sparx", group: "Brands" },
  { key: "brand-nike", label: "Brand: Nike", group: "Brands" },
  { key: "brand-adda", label: "Brand: ADDA", group: "Brands" },
  { key: "brand-red-tape", label: "Brand: Red Tape", group: "Brands" },
  { key: "brand-jqr", label: "Brand: JQR", group: "Brands" },
  { key: "brand-abros", label: "Brand: Abros", group: "Brands" },
  { key: "brand-lakhani", label: "Brand: Lakhani", group: "Brands" },
  { key: "brand-bata", label: "Brand: Bata", group: "Brands" },
  { key: "brand-liberty", label: "Brand: Liberty", group: "Brands" },
  { key: "brand-action", label: "Brand: Action", group: "Brands" },
];

function SeoForm({ pageKey, label }: { pageKey: string; label: string }) {
  const [data, setData] = useState<SeoData>({ pageKey, title: "", description: "", keywords: "", faqs: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [confirmDeleteHero, setConfirmDeleteHero] = useState(false);

  useEffect(() => {
    if (expanded && loading) {
      adminApi.get<SeoData>(`/seo/${pageKey}`).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [expanded, loading, pageKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await adminApi.patch(`/seo/${pageKey}`, data);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

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

  return (
    <div className="bg-white border border-charcoal-200 rounded-xl mb-4 overflow-hidden shadow-sm">
      <button 
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-charcoal-50 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
          <span className="font-poppins font-bold text-sm text-charcoal-900">{label}</span>
          <span className="text-xs text-charcoal-400 font-inter">(/seo/{pageKey})</span>
        </div>
        <div className={`p-1.5 rounded-full transition-colors ${expanded ? 'bg-charcoal-100 text-charcoal-900' : 'bg-transparent text-charcoal-400 group-hover:bg-charcoal-100'}`}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="p-5 border-t border-charcoal-200">
          {loading ? (
            <div className="text-xs text-charcoal-500 font-inter py-4">Loading SEO data...</div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              
              <div>
                <label className="text-xs font-poppins font-semibold text-charcoal-500 block mb-1.5 uppercase tracking-wide">SEO Title</label>
                <input
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="e.g. Premium Footwear | Ansary Footwear"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-poppins font-semibold text-charcoal-500 block mb-1.5 uppercase tracking-wide">Hero Cover Image / Thumbnail</label>
                <div className="flex flex-col gap-2">
                  {data.heroImage && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-charcoal-200 group">
                      <img src={data.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
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
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white flex justify-center text-center items-center hover:bg-charcoal-50 cursor-pointer font-semibold"
                  >
                    <ImageIcon className="w-4 h-4 mr-2 text-charcoal-500" />
                    {data.heroImage ? "Change Hero Image" : "Upload Hero Image"}
                  </button>
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

              <div>
                <label className="text-xs font-poppins font-semibold text-charcoal-500 block mb-1.5 uppercase tracking-wide">Meta Description</label>
                <textarea
                  value={data.description || ""}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  rows={2}
                  placeholder="Shop premium footwear..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-poppins font-semibold text-charcoal-500 block mb-1.5 uppercase tracking-wide">Keywords (comma-separated)</label>
                <input
                  value={data.keywords || ""}
                  onChange={(e) => setData({ ...data, keywords: e.target.value })}
                  placeholder="shoes, boots, sneakers..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-charcoal-100">
                  <label className="text-xs font-poppins font-bold text-charcoal-900 block uppercase tracking-wide">FAQs</label>
                  <button type="button" onClick={addFaq} className="flex items-center gap-1 text-[10px] font-poppins font-bold text-brand-orange uppercase tracking-wider hover:bg-brand-orange/10 px-2 py-1 rounded">
                    <Plus className="w-3 h-3" /> Add FAQ
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {data.faqs.map((faq, i) => (
                    <div key={i} className="bg-charcoal-50 border border-charcoal-200 p-4 rounded-xl flex flex-col gap-3 relative">
                      <button type="button" onClick={() => removeFaq(i)} className="absolute top-3 right-3 text-charcoal-400 hover:text-red-500" title="Remove FAQ">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-poppins font-semibold text-charcoal-400 absolute top-3 left-4">#{i + 1}</span>
                      
                      <div className="mt-4">
                        <label className="text-[10px] font-poppins font-semibold text-charcoal-600 block mb-1 uppercase tracking-wide">Question</label>
                        <input
                          value={faq.question}
                          onChange={(e) => updateFaq(i, "question", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-poppins font-semibold text-charcoal-600 block mb-1 uppercase tracking-wide">Answer</label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => updateFaq(i, "answer", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange resize-none"
                        />
                      </div>
                    </div>
                  ))}
                  {data.faqs.length === 0 && <span className="text-xs text-charcoal-400 font-inter italic">No FAQs added for this page.</span>}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-charcoal-150 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-brand-orange/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
                {success && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-poppins font-bold uppercase tracking-wide animate-pulse">
                    <CheckCircle2 className="w-4 h-4" /> Saved!
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
                setData({ ...data, heroImage: url });
                setCropImageSrc(null);
              }}
              aspectRatio={21 / 9}
            />
          )}

          <ConfirmModal
            isOpen={confirmDeleteHero}
            title="Remove Hero Image"
            message="Are you sure you want to remove this hero image? The page will revert to its default text-only header."
            confirmText="Remove Image"
            danger={true}
            onClose={() => setConfirmDeleteHero(false)}
            onConfirm={async () => {
              const newData = { ...data, heroImage: "" };
              setData(newData);
              try {
                await adminApi.patch(`/seo/${pageKey}`, newData);
              } catch(e) {}
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminSeoPage() {
  const groups = Array.from(new Set(SEO_PAGES.map(p => p.group)));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-2xl lg:text-3xl tracking-tight flex items-center justify-center sm:justify-start gap-2.5">
            <Search className="w-7 h-7 text-brand-orange" strokeWidth={2.5} />
            SEO & FAQs
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-2">
            Configure Meta Tags and Rich Snippet FAQs for Search Engines
          </p>
        </div>
      </div>

      <div className="w-full">
        {groups.map(group => (
          <div key={group} className="mb-10">
            <h3 className="font-poppins font-black text-charcoal-800 text-xs sm:text-sm uppercase tracking-widest mb-4 bg-charcoal-50 py-2 px-4 rounded-lg inline-block border border-charcoal-200/60 shadow-sm">{group}</h3>
            <div className="flex flex-col gap-2">
              {SEO_PAGES.filter(p => p.group === group).map(page => (
                <SeoForm key={page.key} pageKey={page.key} label={page.label} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
