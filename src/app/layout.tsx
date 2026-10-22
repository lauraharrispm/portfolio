import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteAnalytics from "@/components/SiteAnalytics";

const GA_MEASUREMENT_ID = "G-S49DLLQHFT";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  // Italic added for HowIWork's part statements: same brand serif, not a
  // second typeface, just a lighter/smaller supporting-line treatment.
  style: ["normal", "italic"],
});

// Two weights only: regular for reading text, medium for buttons,
// links, labels, and inline emphasis. The site uses no bold.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lauraharrispm.com/"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.svg",
  },
  title: "Laura Harris | Fractional Product Leader",
  description:
    "Fractional product leader for startups with product-market fit. Product-led growth (PLG) leadership without a full-time hire.",
  openGraph: {
    title: "Laura Harris | Fractional Product Leader",
    description:
      "Fractional product leader for startups with product-market fit. Product-led growth (PLG) leadership without a full-time hire.",
    url: "https://www.lauraharrispm.com/",
    siteName: "Laura Harris",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Laura Harris | Fractional Product Leader",
    description:
      "Fractional product leader for startups with product-market fit. Product-led growth (PLG) leadership without a full-time hire.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${instrumentSans.variable}`}
    >
      <head>
        {/* Static head snippet also allows Search Console's GA ownership check. */}
        {process.env.VERCEL_ENV === "production" && (
          <script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          var ownerMode = new URLSearchParams(location.search).get('measurement');
          var ownerCookie = /(?:^|; )lh_internal=1(?:;|$)/.test(document.cookie);
          // Renewed on every visit, so owner mode never lapses silently.
          if (ownerMode === 'internal' || ownerCookie) document.cookie = 'lh_internal=1; Max-Age=2592000; Path=/; SameSite=Lax; Secure';
          if (ownerMode === 'public') document.cookie = 'lh_internal=; Max-Age=0; Path=/; SameSite=Lax; Secure';
          if (navigator.doNotTrack !== '1' && !navigator.globalPrivacyControl && !/(?:^|; )lh_internal=1(?:;|$)/.test(document.cookie)) {
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {send_page_view:true, ignore_referrer:false});
          }
        `,
            }}
          />
        )}
      </head>
      <body>
        {children}
        <SiteAnalytics />
      </body>
      {process.env.VERCEL_ENV === "production" && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      )}
    </html>
  );
}
