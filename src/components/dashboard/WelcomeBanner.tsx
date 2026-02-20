"use client";

import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";

export function WelcomeBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative overflow-hidden rounded-2xl border border-[#141414] bg-linear-to-br from-[#0D0D0D] to-[#050505] p-8 md:p-12"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[50%] h-full bg-linear-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                {/* Content Side */}
                <div className="flex flex-col gap-6 max-w-xl">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-[32px] md:text-[42px] leading-tight font-bold text-white tracking-tight">
                            Welcome back to <br />
                            <span className="text-accent glow-text">1-Tap Cashflow Elite</span>
                        </h2>
                        <p className="text-[#94A3B8] text-[16px] leading-relaxed max-w-md">
                            Watch this 3-minute tactical guide to master the art of viral comment marketing and launch your first campaign.
                        </p>
                    </div>

                    <button className="elite-btn w-fit group">
                        <span>Initialize Tour</span>
                        <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>

                {/* Video Placeholder Side */}
                <div className="w-full md:w-[480px] aspect-video bg-[#0A0A0A] border border-[#141414] rounded-xl flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-ad7155463fb2?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40" />

                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center relative z-20 group-hover:bg-accent group-hover:border-accent transition-colors"
                    >
                        <Play size={24} className="text-white fill-white ml-1 group-hover:text-black group-hover:fill-black transition-colors" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
