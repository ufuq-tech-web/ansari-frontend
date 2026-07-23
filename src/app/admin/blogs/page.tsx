"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FileText, Image as ImageIcon, Calendar, Clock, X } from "lucide-react";
import { adminApi } from "../../../lib/admin-api";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  author: string;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    readTime: "3 mins read",
    author: "Ansari Admin",
  });

  const loadPosts = () => {
    adminApi.get<BlogPost[]>("/blog/admin/all").then(setPosts);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete blog post "${title}"?`)) return;
    await adminApi.delete(`/blog/${id}`);
    loadPosts();
  };

  const handleStartAdd = () => {
    setEditingPost(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      readTime: "3 mins read",
      author: "Ansari Admin",
    });
    setModalOpen(true);
  };

  const handleStartEdit = (p: BlogPost) => {
    setEditingPost(p);
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      image: p.image,
      readTime: p.readTime,
      author: p.author,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    if (editingPost) {
      await adminApi.patch(`/blog/${editingPost.id}`, form);
    } else {
      await adminApi.post("/blog", form);
    }
    loadPosts();
    setModalOpen(false);
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange";
  const labelClass = "text-sm font-poppins font-semibold text-charcoal-700 block mb-1.5";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-charcoal-900 text-xl lg:text-2xl tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-orange" strokeWidth={2.5} />
            Blogs & Articles
          </h2>
          <p className="text-xs text-charcoal-400 font-poppins font-semibold uppercase tracking-wider mt-1">
            Write and publish styling guides, shoe-care tips, and storefront announcements
          </p>
        </div>
        <button
          onClick={handleStartAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-orange-600 text-white font-poppins font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-brand-orange/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Write Article
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl border border-charcoal-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-charcoal-100 overflow-hidden">
              <img
                src={p.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-[10px] font-poppins font-bold uppercase tracking-wider text-charcoal-400 mb-2.5">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {p.createdAt}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {p.readTime}</span>
              </div>
              <h3 className="font-poppins font-bold text-charcoal-900 text-base leading-snug mb-2 group-hover:text-brand-orange transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-charcoal-500 font-inter leading-relaxed mb-6 line-clamp-3">
                {p.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-charcoal-100 pt-4">
                <span className="text-[10px] font-poppins font-bold text-charcoal-400 uppercase tracking-wide">
                  By {p.author}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(p)}
                    className="p-1.5 text-charcoal-400 hover:text-brand-orange hover:bg-brand-orange/5 rounded-lg transition-all"
                    aria-label="Edit post"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    aria-label="Delete post"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200 bg-white flex-shrink-0">
              <div>
                <h3 className="font-poppins font-bold text-charcoal-900 text-lg">
                  {editingPost ? "Edit Article" : "Write New Article"}
                </h3>
                <p className="text-xs text-charcoal-400 font-inter mt-0.5">Publish tips, trends, and tutorials</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full bg-charcoal-100 hover:bg-charcoal-200 flex items-center justify-center text-charcoal-600 transition-colors"
              >
                <X className="w-4.5 h-4.5" strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex flex-col gap-4">
              <div>
                <label className={labelClass}>Article Title</label>
                <input
                  required
                  placeholder="e.g. 5 Shoe Trends to Watch Out For This Winter"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Short Summary / Excerpt</label>
                <input
                  required
                  placeholder="Write a brief, catchy summary of the article..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Full Article Content</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write the body of your article here..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-inter text-charcoal-900 focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Image URL</label>
                  <input
                    placeholder="https://example.com/blog-thumbnail.jpg"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Read Time Label</label>
                  <input
                    required
                    placeholder="e.g. 5 mins read"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Author Name</label>
                <input
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="bg-brand-orange text-white font-poppins font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-brand-orange-dark transition-colors"
                >
                  {editingPost ? "Save Changes" : "Publish Article"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-charcoal-600 font-poppins font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
