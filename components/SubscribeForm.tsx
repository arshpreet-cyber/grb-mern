"use client";

import { useState, FormEvent } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Successfully subscribed!");
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center border-b border-[#555] pb-3 mb-8"
      >
        <input
          type="email"
          placeholder="Enter Your Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="bg-transparent w-full text-white placeholder:text-[#888] outline-none text-[13px]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-[32px] h-[32px] bg-[#f5c518] text-black rounded flex items-center justify-center hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "..." : "→"}
        </button>
      </form>
      {message && (
        <p className={`text-[13px] ${message.includes("Success") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
