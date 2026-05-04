"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";
import { ShoppingBag, Plus, Edit2, Trash2, Package, Search, Image as ImageIcon, Upload, X } from "lucide-react";

type Product = {
  id: number;
  title: string | null;
  catType: string | null;
  status: string | null;
  price: string | null;
  priority: number | null;
  stock: string | null;
  media: string | null;
  minimumQuantity: number | null;
  createdAt: string | null;
};

const CAT_OPTIONS = ["REVIEWS", "SEO", "SMM", "ACCOUNTS", "GBP"];
const STATUS_OPTIONS = ["PUBLISH", "DRAFT", "UNUSED"];

const EMPTY_FORM = { title: "", catType: "REVIEWS", status: "DRAFT", price: "", priority: 1000, stock: "", media: "", minimumQuantity: 1 };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ title: p.title ?? "", catType: p.catType ?? "REVIEWS", status: p.status ?? "DRAFT", price: p.price ?? "", priority: p.priority ?? 1000, stock: p.stock ?? "", media: p.media ?? "", minimumQuantity: p.minimumQuantity ?? 1 });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm(f => ({ ...f, media: data.url }));
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) {
      await fetch(`/api/products/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    setShowModal(false);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const columns: Column<Product>[] = [
    {
      key: "title",
      header: "Product Info",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
            {p.media ? (
              <img src={p.media} alt={p.title ?? ""} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="text-gray-300 h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-gray-900 dark:text-white text-[13px]">{p.title ?? "—"}</span>
            <span className="text-[11px] text-gray-400 dark:text-white/50">{p.catType ?? "—"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (p) => (
        <span className="font-bold text-gray-900 dark:text-white text-[14px]">
          {p.price ? `$${p.price}` : "—"}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Inventory",
      render: (p) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-medium text-gray-600 dark:text-white">{p.stock ?? "—"}</span>
          <span className="text-[10px] text-gray-400 dark:text-white/50 uppercase tracking-tighter">Min Qty: {p.minimumQuantity ?? 1}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <StatusPill 
          value={p.status ?? "DRAFT"} 
          colorMap={{
            PUBLISH: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            DRAFT: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400",
            UNUSED: "border-gray-200 bg-gray-50 text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
          }}
        />
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (p) => <span className="text-gray-500 dark:text-white text-[12px]">{p.priority ?? "—"}</span>,
    },
  ];

  const actions = [
    {
      label: "Edit Product",
      icon: <Edit2 size={14} />,
      onClick: (p: Product) => openEdit(p),
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} className="text-red-500" />,
      onClick: (p: Product) => handleDelete(p.id),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Products Catalog</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-white">Manage your digital products, pricing and inventory.</p>
          </div>
        </div>
        <button 
          onClick={openAdd} 
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={products}
          columns={columns}
          loading={loading}
          actions={actions}
          searchable
          searchPlaceholder="Search products by title..."
          searchValue={search}
          onSearchChange={setSearch}
          pageSize={10}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="bg-violet-600 dark:bg-violet-900/50 px-6 py-4 flex items-center gap-3">
              <ShoppingBag className="text-white h-5 w-5" />
              <h2 className="text-lg font-bold text-white">{editId ? "Edit Product" : "Create Product"}</h2>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Product Title</label>
                <input 
                  value={form.title} 
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                  placeholder="e.g. Google Maps Reviews"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Category</label>
                  <select 
                    value={form.catType} 
                    onChange={e => setForm(f => ({ ...f, catType: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
                  >
                    {CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Status</label>
                  <select 
                    value={form.status} 
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Price ($)</label>
                  <input 
                    value={form.price} 
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Priority Score</label>
                  <input 
                    type="number" 
                    value={form.priority} 
                    onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Min Purchase Qty</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={form.minimumQuantity} 
                    onChange={e => setForm(f => ({ ...f, minimumQuantity: Number(e.target.value) }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Stock Label</label>
                  <input 
                    value={form.stock} 
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                    placeholder="In Stock"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Product Cover Image</label>
                <div className="mt-2 flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 transition-all">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                    {form.media ? (
                      <img src={form.media} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300 h-6 w-6" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="cursor-pointer bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-white hover:border-violet-500 hover:text-violet-600 transition-all flex items-center gap-2 w-fit">
                      <Upload size={14} />
                      {uploading ? "Uploading..." : (form.media ? "Change Image" : "Upload Image")}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {form.media && (
                      <button 
                        type="button" 
                        onClick={() => setForm(f => ({ ...f, media: "" }))} 
                        className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 w-fit"
                      >
                        <X size={12} />
                        Remove current image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-5 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="px-6 py-2 text-sm font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 disabled:opacity-60 transition-all"
              >
                {saving ? "Saving..." : (editId ? "Update Product" : "Create Product")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
