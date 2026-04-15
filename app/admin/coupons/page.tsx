"use client";

import { useEffect, useState } from "react";

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
const STATUS_LABELS: Record<string, string> = { "1": "Active", "2": "Expired" };
const STATUS_COLORS: Record<string, string> = {
  "1": "bg-green-100 text-green-700",
  "2": "bg-red-100 text-red-500",
};

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
    const res = await fetch("/api/coupons");
    const data = await res.json();
    setCoupons(Array.isArray(data) ? data : []);
    setLoading(false);
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

  const filtered = coupons.filter(c => c.code?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Coupons</h1>
        <button onClick={openAdd} className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          + Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search by code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Discount</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Applies On</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Expiry</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={10} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-10 text-gray-400">No coupons found.</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-violet-700">{c.code ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{c.discount ? (c.discountType === "1" ? `${c.discount}%` : `$${c.discount}`) : "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{DISCOUNT_TYPE[c.discountType ?? ""] ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{DISCOUNT_ON[c.discountOn ?? ""] ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{c.quantity ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{c.expiry ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[c.status ?? ""] ?? "bg-gray-100 text-gray-500"}`}>
                      {STATUS_LABELS[c.status ?? ""] ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(c)} className="text-violet-600 hover:underline text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{editId ? "Edit Coupon" : "Add Coupon"}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Coupon Code</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 font-mono focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="e.g. SAVE20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-violet-300">
                    <option value="1">Active</option>
                    <option value="2">Expired</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Discount</label>
                  <input value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="e.g. 20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Discount Type</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-violet-300">
                    <option value="1">Percentage (%)</option>
                    <option value="2">Fixed Price</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Applies On</label>
                  <select value={form.discountOn} onChange={e => setForm(f => ({ ...f, discountOn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-violet-300">
                    <option value="1">All</option>
                    <option value="2">Qty</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Quantity</label>
                  <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="e.g. 100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Expiry Date</label>
                  <input type="date" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Discount For (User ID)</label>
                  <input type="number" value={form.discountFor} onChange={e => setForm(f => ({ ...f, discountFor: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium disabled:opacity-60">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
