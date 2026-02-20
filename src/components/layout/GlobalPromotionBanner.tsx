import React from 'react';
import { Smartphone, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function GlobalPromotionBanner() {
    return (
        <div className="w-full bg-linear-to-r from-[#20c5b5] to-[#12a197] rounded-xl p-6 lg:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start shadow-2xl relative overflow-hidden mb-8 border border-white/10">
            {/* Background Glow */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 blur-3xl rounded-full pointer-events-none" />

            {/* Icon Container */}
            <div className="w-16 h-16 shrink-0 relative flex items-center justify-center bg-white/20 border border-white/30 rounded-2xl backdrop-blur-md self-start sm:mt-1 z-10">
                <Smartphone size={28} className="text-white" />
                <div className="absolute -top-2 -right-2 bg-[#FFC107] text-[#0A0A0A] font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full leading-none shadow-md">
                    $
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4 z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    Want To Multiply Your Earnings To $1,000 - $5,000 A Day?
                </h2>

                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-4xl">
                    The Inbox Money Vault system is powerful, but if you want to scale to truly life-changing income, you need to watch this exclusive training which shows how to make the serious money. And guess what? This training is free for all Inbox Money Vault members.
                </p>

                <a
                    href="https://freedomescapexcelerator.com/5k-per-day"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FFC107] hover:bg-[#FFD54F] text-[#0A0A0A] font-bold px-6 py-3.5 rounded-md transition-all w-fit mt-2 shadow-[0_4px_14px_0_rgba(255,193,7,0.39)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.23)] hover:-translate-y-0.5"
                >
                    <Sparkles size={18} className="text-[#0A0A0A]" />
                    Click Here To Learn How
                    <ArrowRight size={18} className="text-[#0A0A0A] ml-1" />
                </a>
            </div>
        </div>
    );
}
