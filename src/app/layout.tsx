import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  icons: {
    icon: "/favicon.svg",
  },
  title: "Laura Harris | Fractional Product Leader",
  description:
    "Fractional product leader for startups with product-market fit. Product growth leadership without a full-time hire.",
  openGraph: {
    title: "Laura Harris | Fractional Product Leader",
    description:
      "Fractional product leader for startups with product-market fit. Product growth leadership without a full-time hire.",
    url: "https://lauraharrispm.com",
    siteName: "Laura Harris",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Laura Harris | Fractional Product Leader",
    description:
      "Fractional product leader for startups with product-market fit. Product growth leadership without a full-time hire.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${instrumentSans.variable}`}>
      <body>{children}</body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </html>
  );
}
