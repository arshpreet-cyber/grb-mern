'use client';
import { useEffect, useRef } from "react";
import Script from "next/script";
import Wrapper from "@/components/ui/Wrapper";

export default function ScheduleMeetingPage() {
    const calendlyRef = useRef<HTMLDivElement>(null);

    // Safely initialize the Calendly widget programmatically
    const loadCalendly = () => {
        if (typeof window !== "undefined" && (window as any).Calendly && calendlyRef.current) {
            // Clear any previous iframe content to prevent duplication
            calendlyRef.current.innerHTML = "";

            (window as any).Calendly.initInlineWidget({
                url: "https://calendly.com/getreviewsbuzz/30min",
                parentElement: calendlyRef.current,
            });
        }
    };

    useEffect(() => {
        // If the user navigates back to this page and the script is already loaded
        loadCalendly();
    }, []);

    return (
        <Wrapper>
            {/* Calendly Stylesheet */}
            <link
                href="https://assets.calendly.com/assets/external/widget.css"
                rel="stylesheet"
            />

            <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold" }}>
                Schedule a Meeting
            </h1>

            {/* Target container pinned to our React reference */}
            <div
                ref={calendlyRef}
                style={{ minWidth: "320px", height: "700px", margin: "30px auto 40px" }}
            />

            {/* External Script handling loading and navigation adjustments */}
            <Script
                src="https://assets.calendly.com/assets/external/widget.js"
                strategy="afterInteractive"
                onReady={loadCalendly} // Fires as soon as the script is active or ready
            />
        </Wrapper>
    );
}