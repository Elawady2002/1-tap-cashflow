"use client";

import { motion } from "framer-motion";
import { Cpu, Settings, PlayCircle, Layers, Check, Sparkles, BrainCircuit, Workflow } from "lucide-react";

export default function AutopilotPage() {
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
                            <Cpu size={32} className="text-[#D4AF37]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[48px] text-white leading-tight">Autopilot</h1>
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#D4AF37]">The Autonomous Growth Engine</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 bg-[#10B981]/10 px-3 py-1 border border-[#10B981]/20 rounded-sm">
                        <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#10B981]">Engine Ready</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[32px] font-bold text-white leading-tight">
                            Set it and forget it. <br />
                            <span className="text-[#D4AF37] glow-text">Autonomous Domination.</span>
                        </h2>
                        <p className="text-[#94A3B8] text-[17px] leading-relaxed">
                            Autopilot transforms 1-Tap Cashflow from a tool into a 24/7 worker. Configure your triggers, define your rules, and let our AI handle the engagement cycle while you sleep.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[
                            { title: "Smart Triggers", icon: Sparkles, desc: "Automatically engage when keywords trend" },
                            { title: "Workflow Builder", icon: Workflow, desc: "Design complex engagement sequences" },
                            { title: "Neural Filters", icon: BrainCircuit, desc: "Only engage with high-relevance intent" }
                        ].map((item, idx) => (
                            <div key={idx} className="glass-card p-6 flex items-start gap-4">
                                <div className="p-3 bg-[#141414] border border-[#222] rounded-sm text-[#D4AF37]">
                                    <item.icon size={20} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-white font-bold text-[14px]">{item.title}</h4>
                                    <p className="text-[#475569] text-[12px]">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="elite-btn w-fit px-12 mt-4 group">
                        <span>Initialize Autopilot</span>
                        <PlayCircle size={18} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="glass-card p-10 bg-[#050505] border-[#141414] relative overflow-hidden flex flex-col gap-8 min-h-[500px]">
                        <div className="flex items-center justify-between border-b border-[#141414] pb-6">
                            <div className="flex items-center gap-3">
                                <Settings size={18} className="text-[#D4AF37]" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Engine Configuration</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#141414]" />
                                <div className="w-2 h-2 rounded-full bg-[#141414]" />
                                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                            </div>
                        </div>

                        {/* Visual Workflow Mock */}
                        <div className="flex flex-col items-center gap-6 relative flex-1 justify-center py-10">
                            <div className="flex flex-col items-center gap-4 relative z-10 w-full max-w-[200px]">
                                <div className="w-full bg-[#111] border border-[#222] p-4 text-center rounded-sm text-[11px] font-bold text-[#475569] uppercase tracking-widest">Keyword Detect</div>
                                <div className="h-6 w-0.5 bg-[#D4AF37]/20" />
                                <div className="w-full bg-[#D4AF37]/5 border border-[#D4AF37]/40 p-4 text-center rounded-sm text-[11px] font-bold text-white uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.05)]">Neural Filter</div>
                                <div className="h-6 w-0.5 bg-[#D4AF37]/20" />
                                <div className="w-full bg-[#111] border border-[#222] p-4 text-center rounded-sm text-[11px] font-bold text-[#475569] uppercase tracking-widest">Execute Profile</div>
                            </div>

                            {/* Background Grid/Lines */}
                            <div className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-[#141414] to-transparent top-1/2 -translate-y-1/2" />
                            <div className="absolute inset-y-0 w-px bg-linear-to-b from-transparent via-[#141414] to-transparent left-1/2 -translate-x-1/2" />
                        </div>

                        <div className="mt-auto flex flex-col gap-4">
                            <div className="flex items-center justify-between text-[11px] text-[#475569] font-bold uppercase tracking-widest">
                                <span>Autonomous Tasks / Month</span>
                                <span className="text-white">Unlimited</span>
                            </div>
                            <div className="h-1 w-full bg-[#141414] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2 }}
                                />
                            </div>
                        </div>

                        {/* Glow effect */}
                        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                    </div>

                    <div className="flex items-center gap-3 px-6 text-[#475569]">
                        <Layers size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Stacked Automation Layers: 4 (Elite)</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
