"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import DataTable, { Column, StatusPill } from "@/components/ui/DataTable";
import { Users, Search, Edit2, Shield, User as UserIcon, Phone, Mail, X } from "lucide-react";

type User = {
  id: string;
  displayId: number | null;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleSave = async () => {
    if (!editUser) return;
    setSaving(true);
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editUser.id, role: editUser.role, status: editUser.status, phone: editUser.phone }),
    });
    setSaving(false);
    setEditUser(null);
    fetchUsers(search);
  };

  const columns: Column<User>[] = [
    {
      key: "displayId",
      header: "#",
      render: (u) => (
        <span className="font-mono font-bold text-gray-400 dark:text-slate-500 text-[12px]">
          #{u.displayId ?? "—"}
        </span>
      ),
    },
    {
      key: "name",
      header: "User Details",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-bold text-sm shadow-sm">
            {u.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-gray-900 dark:text-white text-[13px]">{u.name ?? "—"}</span>
            <span className="text-[11px] text-gray-400 dark:text-white/50 flex items-center gap-1">
               <Mail size={10} /> {u.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      render: (u) => (
        <span className="text-gray-600 dark:text-white text-[13px] flex items-center gap-1.5 font-medium">
          <Phone size={14} className="text-gray-400" />
          {u.phone ?? "—"}
        </span>
      ),
    },
    {
      key: "role",
      header: "System Role",
      render: (u) => (
        <StatusPill 
          value={u.role} 
          colorMap={{
            ADMIN: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-900/20 dark:text-violet-400",
            MANAGER: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400",
            SEO: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-900/20 dark:text-cyan-400",
            DEVELOPER: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-400",
            TESTER: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-400",
            USER: "border-gray-200 bg-gray-50 text-gray-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
          }}
        />
      ),
    },
    {
      key: "status",
      header: "Account Status",
      render: (u) => (
        <StatusPill 
          value={u.status} 
          colorMap={{
            active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400",
            passive: "border-gray-200 bg-gray-50 text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
          }}
        />
      ),
    },
    {
      key: "createdAt",
      header: "Joined On",
      render: (u) => <span className="text-gray-400 dark:text-white/50 text-[11px] font-mono whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
  ];

  const actions = [
    {
      label: "Edit User",
      icon: <Edit2 size={14} />,
      onClick: (u: User) => setEditUser(u),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-white dark:bg-[#1a1f2c] border border-gray-100 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">System Users</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-white">Manage permissions and roles for your team and customers.</p>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700">
           <span className="text-xs font-black text-gray-500 dark:text-white uppercase tracking-widest">{users.length} Total Users</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1f2c] rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          actions={actions}
          searchable
          searchPlaceholder="Search by name, email or phone..."
          searchValue={search}
          onSearchChange={setSearch}
          pageSize={10}
        />
      </div>

      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="bg-violet-600 dark:bg-violet-900/50 px-6 py-4 flex items-center gap-3">
              <Shield className="text-white h-5 w-5" />
              <h2 className="text-lg font-bold text-white">Modify User Access</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-violet-600 font-black shadow-sm">
                  {editUser.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 dark:text-white/50 uppercase tracking-tighter">Current User</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{editUser.email}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    value={editUser.phone ?? ""} 
                    onChange={e => setEditUser(u => u ? { ...u, phone: e.target.value } : u)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white" 
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">System Role</label>
                <select 
                  value={editUser.role} 
                  onChange={e => setEditUser(u => u ? { ...u, role: e.target.value } : u)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
                >
                  {["ADMIN", "MANAGER", "SEO", "DEVELOPER", "TESTER", "USER"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider mb-1.5 block">Account Status</label>
                <select 
                  value={editUser.status} 
                  onChange={e => setEditUser(u => u ? { ...u, status: e.target.value } : u)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="passive">Passive</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={() => setEditUser(null)} 
                className="px-5 py-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="px-6 py-2 text-sm font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 disabled:opacity-60 transition-all"
              >
                {saving ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
