import { Fraunces, Inter, Noto_Sans_Devanagari } from "next/font/google";

import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "600"],
});

export const metadata = {
  title: "TaxBridge",
  description: "A guided tool for finding tax credits and refund opportunities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} ${notoDevanagari.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
