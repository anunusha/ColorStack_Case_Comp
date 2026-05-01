"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] md:flex-row">
      <MobileNav />
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
