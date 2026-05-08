"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Home, Compass, Ghost } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const cursorRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Lerp cursor position for smoothness
      cursorRef.current.x += (mouseRef.current.x - cursorRef.current.x) * 0.2;
      cursorRef.current.y += (mouseRef.current.y - cursorRef.current.y) * 0.2;

      const cursorEl = document.getElementById("custom-cursor");
      if (cursorEl) {
        cursorEl.style.transform = `translate3d(${cursorRef.current.x}px, ${cursorRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0c] flex items-center justify-center font-poppins cursor-none">
      {/* ── Radial Gradient Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(0,255,200,0.05),transparent_25%),_radial-gradient(circle_at_80%_30%,_rgba(0,153,255,0.05),transparent_25%),_radial-gradient(circle_at_50%_80%,_rgba(168,85,247,0.05),transparent_30%)]" />
      </div>

      {/* ── Custom Planet Cursor ── */}
      <div 
        id="custom-cursor"
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      >
        <div className="relative">
          {/* Planet */}
          <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.5)]" />
          {/* Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 border-2 border-white/20 rounded-[100%] rotate-12" />
        </div>
      </div>
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px]" />
        
        {/* Tied Rocket Container */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          {/* Swinging Assembly */}
          <div className="absolute top-0 left-1/2 h-full flex flex-col items-center animate-rocket-swing origin-top">
            {/* The String (Lengthened to 55vh) */}
            <div className="w-0.5 h-[55vh] bg-gradient-to-b from-white/0 via-white/20 to-white/60 shadow-[0_0_10px_white/20]" />
            
            {/* The Rocket (Restored Sleek SVG version) */}
            <div className="relative -mt-12 group scale-[4]">
                {/* Engine Fire */}
                <div className="absolute top-1/2 -left-8 -translate-y-1/2 w-10 h-3 bg-gradient-to-l from-transparent via-amber-500 to-orange-500 blur-sm rounded-full animate-pulse opacity-80" />
                
                {/* Rocket Body SVG (Horizontal) */}
                <div className="rotate-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:scale-105">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 9 6 9 11C9 14.5 10.5 17 12 17C13.5 17 15 14.5 15 11C15 6 12 2 12 2Z" fill="white" />
                    <path d="M9 15L7 19H10L9 15Z" fill="#CBD5E1" />
                    <path d="M15 15L17 19H14L15 15Z" fill="#CBD5E1" />
                    <circle cx="12" cy="9" r="1.5" fill="#1e293b" />
                  </svg>
                </div>

                {/* String Tie Point */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white] z-10" />
            </div>
          </div>
        </div>

      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Floating Ghost / Icon */}
        <div className="mb-8 animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative h-24 w-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-amber-500/20 rotate-12 transform hover:rotate-0 transition-transform duration-500 cursor-pointer group">
               <Ghost size={48} className="text-[#0a0a0c] group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Big 404 Text */}
        <h1 className="relative">
          <span className="text-[180px] md:text-[240px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 opacity-10 select-none">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-7xl font-black text-white tracking-tight">
            Lost in Space
          </span>
        </h1>

        <div className="max-w-xl mx-auto -mt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-500 mb-4">Page not found</h2>
          {/* <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
            Oops! The page you're looking for has drifted into deep space. 
            Don't worry, even the best explorers get lost sometimes.
          </p> */}
        </div>

        {/* ── Action Buttons ── */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="group relative flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-white font-bold transition-all duration-300 hover:bg-white/10 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>

          <Link 
            href="/"
            className="group relative flex items-center gap-3 px-8 py-4 bg-amber-500 rounded-2xl text-[#0a0a0c] font-bold transition-all duration-300 hover:bg-amber-400 active:scale-95 shadow-[0_8px_30px_rgb(245,158,11,0.3)] hover:shadow-[0_8px_40px_rgb(245,158,11,0.5)]"
          >
            <Home size={20} />
            <span>Back Home</span>
          </Link>
        </div>

        {/* ── Footer / Search Hint ── */}
        <div className="mt-20 flex items-center gap-6 text-slate-500 font-semibold text-sm tracking-widest uppercase opacity-40">
           <div className="flex items-center gap-2">
             <Compass size={14} />
             <span>Exploration Mode</span>
           </div>
           <span className="w-1 h-1 rounded-full bg-slate-700" />
           <span>GRB-MERN v1.0</span>
        </div>

      </div>

      {/* Decorative Circles */}
      <div className="absolute top-1/4 right-[10%] w-64 h-64 border border-white/5 rounded-full animate-spin-slow pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-96 h-96 border border-white/[0.03] rounded-full animate-spin-slow pointer-events-none" style={{ animationDirection: 'reverse' }} />
    </div>
  );
}
