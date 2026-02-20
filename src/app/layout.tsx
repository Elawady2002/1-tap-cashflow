import type { Metadata } from "next";
import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { SupportBanner } from "@/components/dashboard/SupportBanner";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "1-Tap Cashflow Pro | Executive Social Intelligence",
  description: "High-end discussion discovery and AI response generation engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-[#080808]">
        <SearchProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto scroll-smooth relative">
            <div className="px-16 py-16 max-w-7xl mx-auto min-h-full flex flex-col">
              <header className="flex flex-col gap-6 mb-20">
                <div className="flex items-center gap-3 bg-(--gold-tint-10) w-fit px-4 py-1.5 border border-(--gold-primary)/20">
                  <Zap size={14} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Active Intelligence Engine</span>
                </div>
                <WelcomeBanner />
              </header>
              {children}
              <div className="mt-20">
                <SupportBanner />
              </div>
            </div>
          </main>
        </SearchProvider>
      </body>
    </html>
  );
}
