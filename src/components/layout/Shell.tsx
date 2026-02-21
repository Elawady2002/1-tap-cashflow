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
                    <GlobalPromotionBanner />

                    {pathname === "/dashboard" && (
                        <div className="mb-12">
                            <WelcomeBanner />
                        </div>
                    )}
                    {children}
                    <div className="mt-20">
                        <SupportBanner />
                    </div>
                </div>
            </main>
        </div>
    );
}
