import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-S49DLLQHFT";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  title: "Laura Harris | Fractional Product Lead",
  description:
    "Product Lead impact without a full-time hire. Fractional growth product leadership for consumer startups past product-market fit.",
  openGraph: {
    title: "Laura Harris | Fractional Product Lead",
    description:
      "Product Lead impact without a full-time hire. Fractional growth product leadership for consumer startups past product-market fit.",
    url: "https://lauraharrispm.com",
    siteName: "Laura Harris",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Laura Harris | Fractional Product Lead",
    description:
      "Product Lead impact without a full-time hire. Fractional growth product leadership for consumer startups past product-market fit.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
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
