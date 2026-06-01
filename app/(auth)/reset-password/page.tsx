"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600 text-sm font-medium">Invalid or missing reset token.</p>
        <Link href="/login" className="text-sm font-bold underline text-black">Back to Login</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[16px] font-bold text-gray-900">Password reset successfully!</h3>
        <p className="text-[13px] text-gray-500">You can now log in with your new password.</p>
        <button
          onClick={() => router.push("/login")}
          className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-[18px] font-bold text-gray-900">Set new password</h3>
        <p className="text-[13px] text-gray-500 mt-1">Enter and confirm your new password below.</p>
      </div>

      {(error) && (
        <div className="flex items-center gap-2.5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          <span>⚠</span> {error}
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password (min. 8 characters)"
            className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 pl-4 pr-12 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition">
            {showPassword
              ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            }
          </button>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm New Password"
          className="w-full rounded-md border border-gray-200 bg-[#F4F7FF] py-3 px-4 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-[#FFCE2E] hover:bg-[#EBB81E] py-3 text-[15px] font-bold text-black transition disabled:opacity-50"
      >
        {status === "loading" ? "Resetting..." : "Reset Password"}
      </button>

      <p className="text-center text-[13px] text-gray-500">
        <Link href="/login" className="font-bold text-black underline">← Back to Login</Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-[3px] font-sans">
      <div className="relative w-full max-w-[440px] mx-4 rounded-xl bg-white shadow-2xl px-8 py-8">
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-block">
            <img
              src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
              alt="GetReviews.Buzz"
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>
        <Suspense fallback={<div className="py-8 text-center text-gray-400 text-sm">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
