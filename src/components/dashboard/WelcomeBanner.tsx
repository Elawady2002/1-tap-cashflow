"use client";

import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";

export function WelcomeBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full relative overflow-hidden rounded-2xl border border-border-dim bg-panel p-8 md:p-10 shadow-lg"
        >
            <div className="absolute top-0 right-0 w-[40%] h-full bg-linear-to-l from-brand-tint to-transparent pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                <div className="flex flex-col gap-6 max-w-lg">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
                            Welcome to <span className="text-accent underline decoration-accent/20">1-Tap Cashflow</span>
                        </h2>
                        <p className="text-text-secondary text-base leading-relaxed">
                            Learn how to discover high-potential discussions and generate natural responses that convert in just 3 minutes.
                        </p>
                    </div>

                    <button className="btn-primary w-fit shadow-lg shadow-accent/10">
                        <Sparkles size={18} />
                        <span>Quick Start Video</span>
                    </button>
                </div>

                {/* Video Placeholder */}
                <div className="w-full lg:w-[400px] aspect-video bg-page border border-border-dim rounded-xl flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-2xl transition-all hover:border-accent/30">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-ad7155463fb2?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale group-hover:opacity-40 transition-opacity" />

                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 bg-accent text-black rounded-full flex items-center justify-center relative z-20 shadow-xl"
                    >
                        <Play size={22} className="fill-current ml-1" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
