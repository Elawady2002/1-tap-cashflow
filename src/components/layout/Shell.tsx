"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { WelcomeBanner } from "../dashboard/WelcomeBanner";
import { SupportBanner } from "../dashboard/SupportBanner";
import { GlobalPromotionBanner } from "./GlobalPromotionBanner";
import { Zap } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#080808] w-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto scroll-smooth relative">
                <div className="px-16 pt-10 pb-16 max-w-7xl mx-auto min-h-full flex flex-col">
                    {pathname === "/dashboard" && <GlobalPromotionBanner />}
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
        </div>
    );
}
