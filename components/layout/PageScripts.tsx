"use client";

import Script from "next/script";

export default function PageScripts({
  headerScript,
  bodyScript,
  footerScript,
}: {
  headerScript?: string | null;
  bodyScript?: string | null;
  footerScript?: string | null;
}) {
  return (
    <>
      {headerScript && (
        <Script id="header-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: headerScript }} />
      )}
      {bodyScript && (
        <Script id="body-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: bodyScript }} />
      )}
      {footerScript && (
        <Script id="footer-script" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: footerScript }} />
      )}
    </>
  );
}
