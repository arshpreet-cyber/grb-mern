"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";
import { Ticket, Search, Edit2, Trash2, Plus, Calendar, Tag, Percent, DollarSign, X } from "lucide-react";

type Coupon = {
  id: number;
  code: string | null;
  discount: string | null;
  discountType: string | null;
  discountOn: string | null;
  quantity: string | null;
  expiry: string | null;
  discountFor: number;
  status: string | null;
  createdAt: string | null;
};

const DISCOUNT_TYPE: Record<string, string> = { "1": "Percentage", "2": "Fixed Price" };
const DISCOUNT_ON: Record<string, string> = { "1": "All", "2": "Qty" };

const EMPTY_FORM = { code: "", discount: "", discountType: "1", discountOn: "1", quantity: "", expiry: "", discountFor: 1, status: "1" };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (c: Coupon) => {
    setEditId(c.id);
    setForm({ code: c.code ?? "", discount: c.discount ?? "", discountType: c.discountType ?? "1", discountOn: c.discountOn ?? "1", quantity: c.quantity ?? "", expiry: c.expiry ?? "", discountFor: c.discountFor ?? 1, status: c.status ?? "1" });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) {
      await fetch(`/api/coupons/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    setShowModal(false);
    fetchCoupons();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      header: "Coupon Code",
      render: (c) => (
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Tag size={16} />
           </div>
           <span className="font-mono font-black text-gray-900 dark:text-white text-[13px] tracking-widest uppercase">{c.code ?? "—"}</span>
        </div>
      ),
    },
    {
      key: "discount",
      header: "Value",
      render: (c) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-gray-900 dark:text-white text-[14px]">
             {c.discount ? (c.discountType === "1" ? `${c.discount}% OFF` : `$${c.discount} OFF`) : "—"}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-white/50 uppercase font-bold tracking-tighter">
             Type: {DISCOUNT_TYPE[c.discountType ?? ""] ?? "—"}
          </span>
        </div>
      ),
    },
    {
      key: "discountOn",
      header: "Application",
      render: (c) => (
        <span className="text-gray-600 dark:text-white text-[13px] font-medium">
          Applied On: {DISCOUNT_ON[c.discountOn ?? ""] ?? "—"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Usage Limit",
      render: (c) => (
        <span className="text-gray-500 dark:text-white text-[12px] font-mono">{c.quantity ?? "∞"} Left</span>
      ),
    },
    {
      key: "expiry",
      header: "Expires On",
      render: (c) => (
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-white/50 text-[11px] font-mono">
           <Calendar size={12} />
           {c.expiry ?? "Never"}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <StatusPill 
          value={c.status === "1" ? "Active" : "Expired"} 
          colorMap={{
            Active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            Expired: "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400",
          }}
        />
      ),
    },
  ];

  const actions = [
    {
      label: "Edit Coupon",
      icon: <Edit2 size={14} />,
      onClick: (c: Coupon) => openEdit(c),
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} className="text-red-500" />,
      onClick: (c: Coupon) => handleDelete(c.id),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Ticket size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Coupons & Rewards</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-white">Create and manage discount codes for your customers.</p>
          </div>
        </div>
        <button 
          onClick={openAdd} 
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Coupon
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={coupons}
          columns={columns}
          loading={loading}
          actions={actions}
          searchable
          searchPlaceholder="Search by coupon code..."
          searchValue={search}
          onSearchChange={setSearch}
          pageSize={10}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="bg-violet-600 dark:bg-violet-900/50 px-6 py-4 flex items-center gap-3">
              <Tag className="text-white h-5 w-5" />
              <h2 className="text-lg font-bold text-white">{editId ? "Edit Coupon" : "Create Coupon"}</h2>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Coupon Code</label>
                  <input 
                    value={form.code} 
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-black outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                    placeholder="e.g. SAVE20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Status</label>
                  <select 
                    value={form.status} 
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
                  >
                    <option value="1">Active</option>
                    <option value="2">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Discount Value</label>
                  <input 
                    value={form.discount} 
                    onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                    placeholder="e.g. 20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Discount Type</label>
                  <select 
                    value={form.discountType} 
                    onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
                  >
                    <option value="1">Percentage (%)</option>
                    <option value="2">Fixed Price ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Applies On</label>
                  <select 
                    value={form.discountOn} 
                    onChange={e => setForm(f => ({ ...f, discountOn: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
                  >
                    <option value="1">All Products</option>
                    <option value="2">Quantity Limit</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Quantity Limit</label>
                  <input 
                    value={form.quantity} 
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Expiry Date</label>
                  <input 
                    type="date" 
                    value={form.expiry} 
                    onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Specific User ID</label>
                  <input 
                    type="number" 
                    value={form.discountFor} 
                    onChange={e => setForm(f => ({ ...f, discountFor: Number(e.target.value) }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                  />
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
                {saving ? "Saving..." : (editId ? "Update Coupon" : "Create Coupon")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
