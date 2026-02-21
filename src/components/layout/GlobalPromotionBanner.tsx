import React from 'react';
import { Sparkles, ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function GlobalPromotionBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full sticky top-0 z-50 pt-4 pb-4 -mt-4 bg-[#080808]/80 backdrop-blur-md group mb-6"
        >
            {/* Main Banner Container */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl p-5 md:p-6 transition-all duration-500 hover:border-accent/30 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                {/* Animated Glow Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-accent/10 to-transparent pointer-events-none opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px] pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-700" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex w-14 h-14 shrink-0 items-center justify-center bg-accent/10 border border-accent/20 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                            <PlayCircle size={28} className="text-accent" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded border border-accent/10">Exclusive Training</span>
                                <Sparkles size={12} className="text-accent animate-pulse" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                                Scale your earnings to <span className="text-accent">$1,000 - $5,000</span> a day
                            </h2>
                            <p className="text-text-muted text-xs sm:text-sm max-w-2xl">
                                Join our free advanced training session and learn the high-scale strategies used by our top 1% members.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.open("https://freedomescapexcelerator.com/5k-per-day", "_blank")}
                        className="btn-primary whitespace-nowrap px-8 h-12 shadow-gold group/btn"
                    >
                        <span>Watch Training Now</span>
                        <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
