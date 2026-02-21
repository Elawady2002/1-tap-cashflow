"use client";

import { motion } from "framer-motion";
import { Headphones, ExternalLink } from "lucide-react";

export function SupportBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-base flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-10 border-white/5 bg-[#0A0A0B]/40 hover:bg-[#0A0A0B]/60 transition-all duration-500 group"
        >
            <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.05)] group-hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-500">
                    <Headphones size={28} className="text-accent" />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">Need specific guidance?</h3>
                    <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-xl">
                        Our tactical documentation library covers every feature in detail. Read the official <span className="text-accent font-medium">1-Tap Cashflow playbook</span>.
                    </p>
                </div>
            </div>

            <button className="btn-secondary h-12 px-8 whitespace-nowrap bg-white/[0.02] border-white/10 hover:bg-white/[0.05] transition-all duration-300">
                <span>Access Documentation</span>
                <ExternalLink size={16} className="text-text-muted" />
            </button>
        </motion.div>
    );
}
