/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Wrapper from "./Wrapper";

const buyReviewsLinks = [
  { href: "/products/google-reviews/", label: "Google", img: "https://www.google.com/s2/favicons?domain=google.com&sz=64" },
  { href: "/products/buy-google-local-guide-reviews/", label: "Google Local Guide", img: "https://www.google.com/s2/favicons?domain=google.com&sz=64" },
  { href: "/products/buy-trustpilot-reviews/", label: "TrustPilot", img: "https://www.google.com/s2/favicons?domain=trustpilot.com&sz=64" },
  { href: "/products/buy-glassdoor-reviews/", label: "Glassdoor", img: "https://www.google.com/s2/favicons?domain=glassdoor.com&sz=64" },
  { href: "/products/facebook-reviews/", label: "Facebook", img: "https://www.google.com/s2/favicons?domain=facebook.com&sz=64" },
  { href: "/products/google-gps-reviews/", label: "Google GPS", img: "https://www.google.com/s2/favicons?domain=maps.google.com&sz=64" },
  { href: "/products/thumbtack-reviews/", label: "Thumbtack", img: "https://www.google.com/s2/favicons?domain=thumbtack.com&sz=64" },
  { href: "/products/buy-zillow-reviews/", label: "Zillow", img: "https://www.google.com/s2/favicons?domain=zillow.com&sz=64" },
  { href: "/products/google-lsa-reviews/", label: "Google LSA", img: "https://www.google.com/s2/favicons?domain=google.com&sz=64" },
  { href: "/products/trustpilot-verified-reviews/", label: "TrustPilot Verified", img: "https://www.google.com/s2/favicons?domain=trustpilot.com&sz=64" },
  { href: "/products/buy-houzz-reviews/", label: "Houzz", img: "https://www.google.com/s2/favicons?domain=houzz.com&sz=64" },
  { href: "/products/buy-home-advisor-reviews/", label: "Home Advisor", img: "https://www.google.com/s2/favicons?domain=homeadvisor.com&sz=64" },
  { href: "/products/buy-bbb-reviews/", label: "BBB", img: "https://www.google.com/s2/favicons?domain=bbb.org&sz=64" },
  { href: "/products/indeed-reviews/", label: "Indeed", img: "https://www.google.com/s2/favicons?domain=indeed.com&sz=64" },
  { href: "/products/buy-google-play-store-reviews-ratings/", label: "Google Playstore", img: "https://www.google.com/s2/favicons?domain=play.google.com&sz=64" },
  { href: "/products/homestars-reviews/", label: "Home Star", img: "https://www.google.com/s2/favicons?domain=homestars.com&sz=64" },
  { href: "/products/product-reviews/", label: "Product Reviews", img: "https://www.google.com/s2/favicons?domain=amazon.com&sz=64" },
  { href: "/products/booking-com-reviews/", label: "Booking", img: "https://www.google.com/s2/favicons?domain=booking.com&sz=64" },
  { href: "/products/weddingwire-reviews/", label: "WeddingWire", img: "https://www.google.com/s2/favicons?domain=weddingwire.com&sz=64" },
  { href: "/products/avvo-reviews/", label: "Avvo", img: "https://www.google.com/s2/favicons?domain=avvo.com&sz=64" },
];

export default function HomeNavbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileReviewsOpen, setMobileReviewsOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [phoneDropOpen, setPhoneDropOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(73);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [sticky]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) {
        setPhoneDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path: string) => pathname?.startsWith(path);
  const buyReviewsActive = isActive("/services/buy-reviews-online") || isActive("/products");

  const navLinkClass = (active: boolean) =>
    `relative text-[15px] font-medium transition-colors duration-150 hover:text-[#ffcc00] ${active ? "text-[#ffcc00]" : "text-[#212121]"
    }`;

  const activeUnderline = (active: boolean) =>
    active
      ? "after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-[3px] after:bg-[#ffcc00] after:content-['']"
      : "hover:after:absolute hover:after:bottom-[-22px] hover:after:left-0 hover:after:w-full hover:after:h-[3px] hover:after:bg-[#ffcc00] hover:after:content-['']";

  const userInitials = session?.user?.name
    ? session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  const NavContent = (
    <header ref={headerRef} className="w-full bg-white z-[1001]">

      <div className="mx-auto w-full px-5">
        <div className="flex items-center justify-between py-3 gap-6">
          {/* Logo */}
          <Link href="/" aria-label="GetReviews.Buzz Home" className="shrink-0">
            <img
              src="https://getreviews.buzz/storage/app/blog/kSoP1QwwRTAIZ7Z8G8KOwstnQCGKrnP0e2ludxw7.png"
              alt="GetReviews.Buzz"
              width={180}
              height={50}
              style={{ paddingTop: "10px", width: "180px", height: "auto" }}
            />
          </Link>

          {/* Desktop Nav */}
          <Wrapper>
            <nav className="hidden lg:flex items-center gap-10 ml-[25%]">
              <div className="group static">
                <Link
                  href="/buy-reviews"
                  className={`${navLinkClass(buyReviewsActive)} ${activeUnderline(buyReviewsActive)} flex items-center gap-1`}
                >
                  Get Reviews
                  <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>

                {/* Mega dropdown */}
                <div
                  className="fixed right-0 left-0 z-[1000] invisible border-t border-[rgba(0,0,0,0.1)] bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100"
                  style={{ top: `${headerHeight}px` }}
                ><Wrapper>
                    <div className="mx-auto w-full px-10 pt-8 pb-5">
                      <div className="grid grid-cols-5 gap-3">
                        {buyReviewsLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 p-2.5 rounded-[9px] hover:bg-[#FFF6A8] transition-colors group/item"
                          >
                            <img
                              src={item.img}
                              alt={item.label}
                              width={40}
                              height={40}
                              className="h-10 w-10 shrink-0 rounded border border-[#ffcc00] bg-white p-1.5"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                            <span className="text-base text-[#212121] group-hover/item:text-[#212121]">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-[#ffcc00]">

                      </div>
                    </div>
                  </Wrapper>
                </div>
              </div>

              <Link href="/how-it-works/" className={`${navLinkClass(isActive("/how-it-works"))} ${activeUnderline(isActive("/how-it-works"))}`}>
                How it Works
              </Link>
              <Link href="/about-us/" className={`${navLinkClass(isActive("/about-us"))} ${activeUnderline(isActive("/about-us"))}`}>
                About
              </Link>
              <Link href="/blog" className={`${navLinkClass(isActive("/blog"))} ${activeUnderline(isActive("/blog"))}`}>
                Blog
              </Link>
              <Link href="#" className={`${navLinkClass(false)} ${activeUnderline(false)}`}>
                Tools
              </Link>
            </nav>
          </Wrapper>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <a
              href="mailto:marketing@getreviews.buzz"
              className="inline-flex h-12.5 w-12.5 items-center justify-center rounded-[10px] border border-[#ddd] bg-white transition-colors hover:border-[#ffcc00]"
            >
              <img src="https://beta.getreviews.buzz/storage/app/blog/0520560001775463982_email-1.svg" alt="Email Us" width={22} height={22} />
            </a>

            <div className="relative" ref={phoneRef}>
              <button
                onClick={() => setPhoneDropOpen((v) => !v)}
                className="inline-flex h-12.5 w-12.5 items-center justify-center rounded-[10px] border border-[#ddd] bg-white transition-colors hover:border-[#ffcc00]"
              >
                <img src="https://beta.getreviews.buzz/storage/app/blog/0901060001775463990_Vector.svg" alt="Call Us" width={22} height={22} />
              </button>

              {phoneDropOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 z-[9999] w-87.5 overflow-hidden rounded-lg bg-white shadow-[0_5px_20px_rgba(0,0,0,0.2)]">
                  <h5 className="m-0 rounded-t-lg bg-[#FFE57F] px-4 py-3 text-[15px] font-medium text-black">Contacts</h5>
                  <div className="flex items-stretch">
                    <div className="w-16 flex items-center justify-center py-4">
                      <a href="tel:+14302335402">
                        <span className="inline-flex items-center justify-center bg-[#1A73E8] rounded-full w-11 h-11">
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
                            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                          </svg>
                        </span>
                      </a>
                    </div>
                    <div className="w-px bg-[#e0e0e0]" />
                    <div className="flex-1 p-3">
                      <p className="text-sm text-black mb-1">Phone</p>
                      <div className="flex items-center gap-1 mb-1">
                        <img src="https://flagcdn.com/us.svg" width={20} alt="US" />
                        <a href="tel:+14302335402" className="text-sm font-medium text-black hover:text-[#e0b000] transition-colors no-underline">
                          +1 430-233-5402
                        </a>
                      </div>
                      <p className="text-[13px] text-black m-0">
                        (If we don&apos;t pick up,{" "}
                        <Link href="/contact/" className="text-black underline">drop enquiry</Link>.)
                      </p>
                    </div>
                  </div>
                  <hr className="border-[#eee] m-0" />
                  <div className="flex items-stretch">
                    <div className="w-16 flex items-center justify-center py-4">
                      <a href="https://api.whatsapp.com/send?phone=13068025402" target="_blank" rel="noreferrer">
                        <span className="inline-flex items-center justify-center bg-[#25D366] rounded-full w-11 h-11">
                          <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" width={30} height={30} />
                        </span>
                      </a>
                    </div>
                    <div className="w-px bg-[#e0e0e0]" />
                    <div className="flex-1 p-3">
                      <p className="text-sm text-black mb-1">WhatsApp</p>
                      <div className="flex items-center gap-1">
                        <img src="https://flagcdn.com/us.svg" width={20} alt="US" />
                        <a href="https://api.whatsapp.com/send?phone=13068025402" target="_blank" rel="noreferrer" className="text-sm font-medium text-black hover:text-[#e0b000] transition-colors no-underline">
                          +1 306 802 5402
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {status === "loading" ? (
              <div className="h-12.5 w-30 animate-pulse rounded-[10px] bg-slate-100" />
            ) : session ? (
              <div className="relative group">
                <button className="inline-flex h-12.5 w-30 items-center justify-center gap-2 rounded-[10px] border border-[#ddd] bg-white text-sm font-medium text-black transition-colors hover:border-[#ffcc00] font-[Poppins]">
                  <img src="https://beta.getreviews.buzz/storage/app/blog/0908809001775472579_login-1.svg" alt="login icon" width={22} height={22} />
                  <span>{userInitials}</span>
                </button>
                <div className="absolute top-[calc(100%+4px)] right-0 z-[1000] invisible w-48 rounded-xl border border-[#eee] bg-white py-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#fff6a8] transition-colors">Dashboard</Link>
                  <Link href="/dashboard/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#fff6a8] transition-colors">Account Details</Link>
                  <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#fff6a8] transition-colors">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="inline-flex h-12.5 w-30 items-center justify-center gap-2 rounded-[10px] border border-[#ddd] bg-white text-sm font-medium text-black transition-colors hover:border-[#ffcc00] font-[Poppins]">
                <img src="https://beta.getreviews.buzz/storage/app/blog/0908809001775472579_login-1.svg" alt="login icon" width={20} height={20} />
                <span>Login</span>
              </Link>
            )}

            <Link
              href="/schedule-appointment/"
              className="inline-flex h-12.5 w-40 items-center justify-center gap-2 rounded-[10px] bg-black text-sm font-medium text-white transition-colors hover:bg-[#222] hover:text-[#ffcc00] font-[Poppins]"
            >
              Book a Call
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex flex-col gap-1.25 p-2 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-black transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1.75" : ""}`} />
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-black transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1.75" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[rgba(0,0,0,0.1)]">
          <ul className="divide-y divide-[rgba(0,0,0,0.08)]">
            <li className="px-5 py-3">
              <Link href="/" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            </li>
            <li className="px-5 py-3">
              <button
                className="w-full flex items-center justify-between text-[#212121] text-base font-medium"
                onClick={() => setMobileReviewsOpen((v) => !v)}
              >
                Buy Reviews
                <svg className={`w-4 h-4 transition-transform ${mobileReviewsOpen ? "rotate-180" : ""}`} viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {mobileReviewsOpen && (
                <ul className="mt-2 pl-3 space-y-1">
                  {buyReviewsLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block py-1.5 text-base text-[#212121] hover:text-[#ffcc00] transition-colors" onClick={() => setMobileOpen(false)}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="px-5 py-3">
              <Link href="/how-it-works/" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>How it Works</Link>
            </li>
            <li className="px-5 py-3">
              <Link href="/about-us/" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>About</Link>
            </li>
            <li className="px-5 py-3">
              <Link href="/blog" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>Blog</Link>
            </li>
            <li className="px-5 py-3">
              <Link href="#" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>Tools</Link>
            </li>
            {session ? (
              <>
                <li className="px-5 py-3">
                  <Link href="/dashboard" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                </li>
                <li className="px-5 py-3">
                  <button onClick={() => { signOut({ callbackUrl: "/login" }); setMobileOpen(false); }} className="text-[#212121] text-base font-medium">Logout</button>
                </li>
              </>
            ) : (
              <li className="px-5 py-3">
                <Link href="/login" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>Login</Link>
              </li>
            )}
            <li className="px-5 py-3">
              <Link href="/schedule-appointment/" className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-[10px] text-sm font-medium" onClick={() => setMobileOpen(false)}>
                Book a Call
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );

  return (
    <>
      {/* Sticky wrapper: fixed full-width at top, Wrapper constrains inner content */}
      {sticky ? (
        <div className="fixed top-0 left-0 right-0 z-[1001] bg-white shadow-md">
          <Wrapper>
            {NavContent}
          </Wrapper>
        </div>
      ) : (
        <Wrapper>
          {NavContent}
        </Wrapper>
      )}

      {/* Spacer to prevent content jump when sticky kicks in */}
      {sticky && <div style={{ height: `${headerHeight}px` }} />}
    </>
  );
}