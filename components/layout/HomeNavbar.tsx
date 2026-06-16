/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Wrapper from "@/components/ui/Wrapper";

const buyReviewsLinks = [
  { id: 1, href: "/products/buy-google-reviews/", label: "Google", bg: "#FFFAEB" },
  { id: 2, href: "/products/buy-google-local-guide-reviews/", label: "Google Local Guide", bg: "#E875331A" },
  { id: 3, href: "/products/buy-trustpilot-reviews/", label: "TrustPilot", bg: "#E7F7EC99" },
  { id: 4, href: "/products/buy-glassdoor-reviews/", label: "Glassdoor", bg: "#F1FAF4" },
  { id: 5, href: "/products/buy-facebook-reviews/", label: "Facebook", bg: "#D5E7FF99" },
  { id: 6, href: "/products/buy-google-gps-reviews/", label: "Google GPS", bg: "#FFE8E657" },
  { id: 7, href: "/products/buy-thumbtack-reviews/", label: "Thumbtack", bg: "#EAF9FF" },
  { id: 8, href: "/products/buy-zillow-reviews/", label: "Zillow", bg: "#F4F8FF" },
  { id: 9, href: "/products/buy-google-lsa-reviews/", label: "Google LSA", bg: "#EAF6EE" },
  { id: 10, href: "/products/buy-trustpilot-verified-reviews/", label: "TrustPilot Verified", bg: "#E7F7EC99" },
  { id: 11, href: "/products/buy-houzz-reviews/", label: "Houzz", bg: "#F3FFED" },
  { id: 12, href: "/products/buy-home-advisor-reviews/", label: "Home Advisor", bg: "#FFF7EA" },
  { id: 13, href: "/products/buy-bbb-reviews/", label: "BBB", bg: "#E4F7FF99" },
  { id: 14, href: "/products/buy-indeed-reviews/", label: "Indeed", bg: "#EFF4FF" },
  { id: 15, href: "/products/buy-google-playstore-reviews/", label: "Google Playstore", bg: "#EFFCFF" },
  { id: 16, href: "/products/buy-home-star-reviews/", label: "Home Star", bg: "#F0FAFF" },
  { id: 17, href: "/products/buy-product-reviews/", label: "Product Reviews", bg: "#F6FFE8" },
  { id: 18, href: "/products/buy-booking-com-reviews/", label: "Booking", bg: "#C8DFFF33" },
  { id: 19, href: "/products/buy-weddingwire-reviews/", label: "WeddingWire", bg: "#13B3BA17" },
  { id: 20, href: "/products/buy-avvo-reviews/", label: "Avvo", bg: "#EBF6FF" },
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
    `relative text-[15px] font-medium transition-colors duration-150 text-[#212121]`;

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
        <div className="flex items-center justify-between py-2 gap-6">
          {/* Logo */}
          <Link href="/" aria-label="GetReviews.Buzz Home" className="shrink-0">
            <img
              src="/uploads/media/1778825414712-b5950796-7335-4c0c-a6ed-2f5ee108976e-logo-white.png"
              alt="GetReviews.Buzz"
              width={180}
              height={50}
              className="pt-2.5 w-[180px] h-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <Wrapper>
            <nav className="hidden lg:flex items-center gap-10 ml-[25%]">
              <div className="group static">
                <Link
                  href="/"
                  className={`${navLinkClass(buyReviewsActive)} ${activeUnderline(buyReviewsActive)} flex items-center gap-1`}
                >
                  Get Reviews
                  <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>

                {/* Mega dropdown */}
                <div
                  className="fixed right-0 left-0 z-[1000] invisible border-t border-[rgba(0,0,0,0.1)] bg-white opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.10)] rounded-b-xl transition-all duration-200 delay-150 group-hover:visible group-hover:opacity-100 group-hover:delay-0 top-[140px]"

                ><Wrapper>
                    <div className="mx-auto w-full px-[20px] pt-[25px] pb-[10px]">

                      <div className="grid grid-cols-5 gap-y-4 gap-x-10">
                        {buyReviewsLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center w-full rounded-[9px]"
                          >
                            <span
                              className="text-base text-[#212121] w-full px-[22px] py-4 rounded-md transition-colors duration-300"
                              style={{ backgroundColor: item.bg }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fff6a8"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = item.bg; }}
                            >
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
              <Link href="/blog/" className={`${navLinkClass(isActive("/blog"))} ${activeUnderline(isActive("/blog"))}`}>
                Blog
              </Link>
              <Link href="/review-rating-calculator/" className={`${navLinkClass(isActive("/review-rating-calculator"))} ${activeUnderline(isActive("/review-rating-calculator"))}`}>
                Tools
              </Link>
            </nav>
          </Wrapper>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <a
              href="mailto:marketing@getreviews.buzz"
              className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#dddddd62] bg-white transition-colors hover:border-[#ffcc00]"
            >
              <img src="/uploads/media/1777870205391-99cce059-929e-481a-8f04-4a4e61a1756b-email.svg" alt="Email Us" width={22} height={22} />
            </a>

            <div className="relative group">
              <button
                className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#dddddd62] bg-white transition-colors group-hover:border-[#ffcc00]"
              >
                <img src="/uploads/media/1777870219505-7138fb27-1142-4c79-ac43-57219c45e4fc-phone.svg" alt="Call Us" width={22} height={22} />
              </button>

              <div className="absolute top-[calc(100%+8px)] right-[-150px] z-[9999] w-[350px] overflow-hidden rounded-lg bg-white shadow-[0_5px_20px_rgba(0,0,0,0.2)] invisible opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
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
                      <Link href="/contact-us" className="text-black underline">drop enquiry</Link>.)
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
            </div>

            {status === "loading" ? (
              <div className="h-12 w-[120px] animate-pulse rounded-[10px] bg-slate-100" />
            ) : session ? (
              <div className="relative group">
                <button className="inline-flex h-12 w-[120px] items-center justify-center gap-2 rounded-[10px] border border-[#dddddd62] bg-white text-[16px] font-normal text-black transition-colors hover:border-[#ffcc00] font-[Poppins]">
                  <img src="/uploads/media/1777870235572-65c0dbc3-913b-4c08-b381-e6ac6f665331-login-1.svg" alt="login icon" width={22} height={22} />
                  <span>{userInitials}</span>
                </button>
                <div className="absolute top-[calc(100%+4px)] right-0 z-[1000] invisible w-48 rounded-xl border border-[#eee] bg-white py-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#fff6a8] transition-colors">Dashboard</Link>
                  <Link href="/dashboard/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#fff6a8] transition-colors">Account Details</Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-[#212121] hover:bg-[#fff6a8] transition-colors">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="inline-flex h-12 w-[120px] items-center justify-center gap-2 rounded-[10px] border border-[#dddddd62] bg-white text-[16px] font-normal text-black transition-colors hover:border-[#ffcc00] font-[Poppins]">
                <img src="/uploads/media/1777870235572-65c0dbc3-913b-4c08-b381-e6ac6f665331-login-1.svg" alt="login icon" width={20} height={20} />
                <span>Login</span>
              </Link>
            )}

            <Link
              href="/schedule-appointment/"
              className="inline-flex h-12 w-[160px] items-center justify-center gap-2 rounded-[10px] bg-black text-base font-medium text-white transition-colors hover:bg-[#222] hover:text-[#ffcc00] font-[Poppins]"
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
              <Link href="/blog/" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>Blog</Link>
            </li>
            <li className="px-5 py-3">
              <Link href="/review-rating-calculator/" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>Tools</Link>
            </li>
            {session ? (
              <>
                <li className="px-5 py-3">
                  <Link href="/dashboard" className="text-[#212121] text-base font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                </li>
                <li className="px-5 py-3">
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }} className="text-[#212121] text-base font-medium">Logout</button>
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