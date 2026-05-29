"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface ProfileData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof ProfileData, string | null>>;

export default function AccountPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData>({ name: "", email: "" });
  const [passwords, setPasswords] = useState<PasswordData>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/get-profile")
      .then((r) => r.json())
      .then((data) => setProfile({ name: data.name ?? "", email: data.email ?? "" }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof ProfileData;
    setProfile({ ...profile, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: null });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const submitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!profile.name) newErrors.name = "Name is required!";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name }),
      });
      const data = await res.json();
      setMessage(res.ok ? "Profile updated successfully!" : data.error ?? "Failed to update profile.");
    } catch {
      setMessage("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const submitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { setMessage("Passwords do not match."); return; }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      setMessage(res.ok ? "Password changed successfully!" : data.error ?? "Failed to change password.");
      if (res.ok) setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setMessage("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f9] dark:bg-[#0f1117] text-gray-800 dark:text-slate-200 font-sans pb-10 transition-colors">
      {loading && <div className="fixed inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">Loading...</div>}

      {/* Page Header */}
      <header className="bg-white dark:bg-[#1a1f2c] border-b border-gray-200 dark:border-slate-800 py-4 mb-8 shadow-sm transition-colors">
        <div className="w-full px-4 md:px-8">
           <h1 className="text-[1.1rem] font-semibold text-gray-700 dark:text-white flex items-center gap-2 justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-slate-400">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Account Settings - Profile
          </h1>
        </div>
      </header>

      <div className="w-full px-4 md:px-8">

        {message && (
          <div className={`mb-6 rounded px-4 py-3 text-sm font-medium border ${message.includes("success") ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"}`}>
            {message}
          </div>
        )}

        {/* Account Details Card */}
        <div className="bg-white dark:bg-[#1a1f2c] border border-gray-200 dark:border-slate-800 shadow-sm rounded-md mb-8 transition-colors">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-[#1a3b5c] dark:text-white">Account Details</h2>
          </div>
          <div className="p-6">
            <form onSubmit={submitProfile}>
              {/* Read-only Email */}
              <div className="mb-6 bg-gray-50 dark:bg-slate-800/50 p-3 rounded border border-gray-100 dark:border-slate-700 transition-colors">
                <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">Registered Email : </span>
                <span className="text-sm text-gray-500 dark:text-slate-500">{profile.email}</span>
              </div>

              {/* Full Name */}
              <div className="mb-6">
                <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1" htmlFor="inputName">Full Name</label>
                <input
                  className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300 dark:border-slate-700"} bg-white dark:bg-slate-800 rounded-[4px] px-3 py-2 text-sm text-gray-700 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 transition-colors`}
                  id="inputName" type="text" name="name"
                  value={profile.name} onChange={handleProfileChange}
                />
                {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
              </div>

              <button className="bg-[#295b8d] dark:bg-indigo-600 hover:bg-[#1f4770] dark:hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-[4px] transition-all disabled:opacity-60" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white dark:bg-[#1a1f2c] border border-gray-200 dark:border-slate-800 shadow-sm rounded-md mb-8 transition-colors">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-[#1a3b5c] dark:text-white">Change Password</h2>
          </div>
          <div className="p-6">
            <form onSubmit={submitPassword}>
              <div className="mb-5">
                <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1" htmlFor="currentPassword">Current Password</label>
                <input className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[4px] px-3 py-2 text-sm text-gray-700 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors" id="currentPassword" type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="mb-5">
                <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1" htmlFor="newPassword">New Password</label>
                <input className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[4px] px-3 py-2 text-sm text-gray-700 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors" id="newPassword" type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1" htmlFor="confirmPassword">Confirm Password</label>
                <input className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[4px] px-3 py-2 text-sm text-gray-700 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors" id="confirmPassword" type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required />
              </div>
              <button className="bg-[#295b8d] dark:bg-indigo-600 hover:bg-[#1f4770] dark:hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-[4px] transition-all disabled:opacity-60" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Password"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}
