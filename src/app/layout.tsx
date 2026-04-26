import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Laura Harris — Fractional Product Manager",
  description:
    "Fractional Product Manager for consumer startups — DTC ecommerce, marketplace, and subscription businesses past product-market fit.",
  openGraph: {
    title: "Laura Harris — Fractional Product Manager",
    description:
      "Lead Growth PM ownership for consumer startups ready to scale.",
    url: "https://laurakayharris.com",
    siteName: "Laura Harris",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Laura Harris — Fractional Product Manager",
    description:
      "Lead Growth PM ownership for consumer startups ready to scale.",
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
    </html>
  );
}
