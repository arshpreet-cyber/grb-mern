"use client";

import HomeNavbar from "@/components/HomeNavbar";
import HomePage from "./pages/HomePage";
import HomeFooter from "@/components/HomeFooter";


export default function index() {
  return (

      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <HomeNavbar />
        <HomePage />
        <HomeFooter />
      </div>
  );
}