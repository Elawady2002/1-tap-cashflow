"use client";

import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, Star, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

const BENEFITS = [
    "Full Niche Research & Setup",
    "Tailored AI Response Profiles",
    "Hand-picked High-Intent Threads",
    "24/7 Monitoring & Lead Filtering",
    "White-label Engagement Reports"
];

export default function DFYPage() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-16 py-10"
        >
            <header className="flex items-end justify-between border-b border-[#141414] pb-10">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center rounded-sm">
                            <Briefcase size={32} className="text-[#D4AF37]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[48px] text-white leading-tight">Done-For-You</h1>
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#D4AF37]">The Ultimate Hands-Free Experience</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 bg-(--gold-tint-10) px-3 py-1 border border-(--gold-primary)/20 rounded-sm">
                        <Star size={12} className="text-[#D4AF37]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Premium Managed Service</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[32px] font-bold text-white leading-tight">
                            We build your pipeline. <br />
                            <span className="text-[#D4AF37] glow-text">You collect the results.</span>
                        </h2>
                        <p className="text-[#94A3B8] text-[18px] leading-relaxed">
                            Stop spending time on research and configuration. Our team of Pro specialists will handle the heavy lifting, from finding your perfect social niches to crafting the perfect AI personas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {BENEFITS.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-4 text-white"
                            >
                                <CheckCircle2 size={20} className="text-[#D4AF37]" />
                                <span className="text-[16px] font-medium">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                        <button className="btn-primary px-10 group">
                            <span>Request Activation</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-2 text-[#475569]">
                            <ShieldCheck size={16} />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Limited Slots Available</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="glass-card p-1 bg-linear-to-br from-[#141414] to-black border-[#222] shadow-2xl relative z-10">
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop"
                            alt="Pro Team"
                            className="rounded-lg opacity-80"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
                            <div className="flex items-center gap-3 text-[#D4AF37] mb-2 font-black text-[10px] uppercase tracking-[0.3em]">
                                <Sparkles size={14} />
                                <span>Expert Management</span>
                            </div>
                            <p className="text-white text-[14px] leading-relaxed max-w-sm">
                                "Our dedicated account managers ensure your 1-Tap Cashflow environment is optimized for maximum conversion 24/7."
                            </p>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
                </div>
            </div>
        </motion.div>
    );
}
