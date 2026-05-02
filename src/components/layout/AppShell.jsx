"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n";

export default function AppShell({ children }) {
  return (
    <I18nProvider>
      <div className="flex min-h-screen flex-col bg-[var(--color-background)] md:flex-row">
        <MobileNav />
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </div>
    </I18nProvider>
  );
}
