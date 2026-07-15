"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Info, FileText } from "lucide-react";
import { adminApi } from "../../lib/admin-api";
import Select from "./Select";

interface CategoryOption {
  key: string;
  name: string;
}

interface Section {
  heading: string;
  body: string;
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
const labelClass = "text-sm font-poppins font-medium text-charcoal-700 block mb-1.5";

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4.5 h-4.5 text-brand-orange" strokeWidth={2} />
      </div>
      <div>
        <h3 className="font-poppins font-semibold text-charcoal-900 text-sm">{title}</h3>
        <p className="text-xs text-charcoal-400 font-inter">{subtitle}</p>
      </div>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl border border-charcoal-200 p-5">{children}</div>;
}

export default function GuideForm({ slug, onSuccess, onCancel }: { slug?: string; onSuccess?: () => void; onCancel?: () => void }) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [title, setTitle] = useState("");
  const [categoryKey, setCategoryKey] = useState("");
  const [description, setDescription] = useState("");
  const [readTime, setReadTime] = useState("");
  const [sections, setSections] = useState<Section[]>([{ heading: "", body: "" }]);
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishSuccess = () => (onSuccess ? onSuccess() : router.push("/admin/guides"));
  const finishCancel = () => (onCancel ? onCancel() : router.push("/admin/guides"));

  useEffect(() => {
    adminApi.get<CategoryOption[]>("/categories").then(setCategories);
  }, []);

  useEffect(() => {
    if (!slug) return;
    adminApi
      .get<any>(`/guides/${slug}`)
      .then((g) => {
        setTitle(g.title);
        setCategoryKey(g.category.key);
        setDescription(g.description);
        setReadTime(g.readTime);
        setSections(g.content);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const updateSection = (i: number, key: keyof Section, value: string) => {
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryKey) {
      setError("Please select a category");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { title, categoryKey, description, readTime, content: sections };
    try {
      if (slug) {
        await adminApi.patch(`/guides/${slug}`, payload);
      } else {
        await adminApi.post("/guides", payload);
      }
      finishSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save guide");
      setSaving(false);
    }
  };

  if (loading) return <p className="text-charcoal-400 font-inter py-8 text-center">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Section>
        <SectionHeader icon={Info} title="Guide Details" subtitle="Title, category, and summary" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. How to Choose Formal Shoes" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <Select
              value={categoryKey}
              onChange={setCategoryKey}
              placeholder="Select category"
              options={categories.map((c) => ({ value: c.key, label: c.name }))}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Short Description</label>
          <input required value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
        </div>

        <div className="mt-4">
          <label className={labelClass}>Read Time (e.g. "4 min read")</label>
          <input required value={readTime} onChange={(e) => setReadTime(e.target.value)} className={inputClass} />
        </div>
      </Section>

      <Section>
        <SectionHeader icon={FileText} title="Article Content" subtitle="Sections shown on the guide page" />
        <div className="flex flex-col gap-4">
          {sections.map((s, i) => (
            <div key={i} className="border border-charcoal-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  required
                  value={s.heading}
                  onChange={(e) => updateSection(i, "heading", e.target.value)}
                  placeholder="Section heading"
                  className={`${inputClass} flex-1`}
                />
                {sections.length > 1 && (
                  <button type="button" onClick={() => setSections((prev) => prev.filter((_, idx) => idx !== i))} className="p-2 text-charcoal-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                )}
              </div>
              <textarea
                required
                value={s.body}
                onChange={(e) => updateSection(i, "body", e.target.value)}
                placeholder="Section body text"
                rows={3}
                className={inputClass}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSections((prev) => [...prev, { heading: "", body: "" }])}
          className="mt-3 flex items-center gap-1.5 text-sm text-brand-orange font-poppins font-semibold hover:gap-2 transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Add Section
        </button>
      </Section>

      {error && <p className="text-sm text-red-600 font-inter">{error}</p>}

      <div className="flex gap-3 pt-1 sticky bottom-0 bg-brand-ivory/95 backdrop-blur -mx-1 px-1 py-3 sm:static sm:bg-transparent sm:backdrop-blur-none sm:p-0">
        <button type="submit" disabled={saving} className="bg-brand-orange text-white font-poppins font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-50">
          {saving ? "Saving…" : slug ? "Save Changes" : "Create Guide"}
        </button>
        <button type="button" onClick={finishCancel} className="text-charcoal-600 font-poppins font-semibold px-6 py-2.5 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
