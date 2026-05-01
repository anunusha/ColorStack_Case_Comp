import { Fraunces, Inter } from "next/font/google";

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

export const metadata = {
  title: "TaxBridge",
  description: "A guided tool for finding tax credits and refund opportunities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
