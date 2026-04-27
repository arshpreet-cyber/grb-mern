"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof ProfileData, string | null>>;

export default function AccountPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData>({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState<PasswordData>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/get-profile")
      .then((r) => r.json())
      .then((data) => setProfile({ name: data.name ?? "", email: data.email ?? "", phone: data.phone ?? "" }))
      .catch(console.error)
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
    if (!profile.phone) newErrors.phone = "Phone number is required!";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
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
    <main className="min-h-screen bg-[#f4f6f9] text-gray-800 font-sans pb-10">
      {loading && <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">Loading...</div>}

      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 py-4 mb-8 shadow-sm">
        <div className="w-full px-4 md:px-8">
           <h1 className="text-[1.1rem] font-semibold text-gray-700 flex items-center gap-2 justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Account Settings - Profile
          </h1>
        </div>
      </header>

      <div className="max-w-5xl px-4 md:px-8">

        {message && (
          <div className={`mb-6 rounded px-4 py-3 text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
            {message}
          </div>
        )}

        {/* Account Details Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-md mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#1a3b5c]">Account Details</h2>
          </div>
          <div className="p-6">
            <form onSubmit={submitProfile}>
              {/* Read-only Email */}
              <div className="mb-6 bg-gray-50 p-3 rounded border border-gray-100">
                <span className="text-sm font-semibold text-gray-600 ">Registered Email : </span>
                <span className="text-sm text-gray-500">{profile.email}</span>
              </div>

              {/* Full Name & Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1" htmlFor="inputName">Full Name</label>
                  <input
                    className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-[4px] px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    id="inputName" type="text" name="name"
                    value={profile.name} onChange={handleProfileChange}
                  />
                  {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1" htmlFor="inputPhone">Phone Number</label>
                  <input
                    className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-[4px] px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    id="inputPhone" type="tel" name="phone"
                    value={profile.phone} onChange={handleProfileChange}
                  />
                  {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
                </div>
              </div>

              <button className="bg-[#295b8d] hover:bg-[#1f4770] text-white text-sm font-medium px-5 py-2.5 rounded-[4px] transition-colors disabled:opacity-60" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-md mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#1a3b5c]">Change Password</h2>
          </div>
          <div className="p-6">
            <form onSubmit={submitPassword}>
              <div className="mb-5">
                <label className="block text-sm text-gray-500 mb-1" htmlFor="currentPassword">Current Password</label>
                <input className="w-full border border-gray-300 rounded-[4px] px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500" id="currentPassword" type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="mb-5">
                <label className="block text-sm text-gray-500 mb-1" htmlFor="newPassword">New Password</label>
                <input className="w-full border border-gray-300 rounded-[4px] px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500" id="newPassword" type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1" htmlFor="confirmPassword">Confirm Password</label>
                <input className="w-full border border-gray-300 rounded-[4px] px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500" id="confirmPassword" type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required />
              </div>
              <button className="bg-[#295b8d] hover:bg-[#1f4770] text-white text-sm font-medium px-6 py-2.5 rounded-[4px] transition-colors disabled:opacity-60" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Password"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}
