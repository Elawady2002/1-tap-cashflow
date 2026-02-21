"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Clock, Rocket, Activity } from "lucide-react";

const SPEED_METRICS = [
    { label: "Discovery Speed", basic: "140ms", elite: "12ms", boost: "10x" },
    { label: "AI Synthesis", basic: "2.4s", elite: "0.4s", boost: "6x" },
    { label: "Crawler Depth", basic: "Tier 1", elite: "Tier 4", boost: "Pro" }
];

export default function InstantIncomePage() {
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
                            <Zap size={32} className="text-[#D4AF37]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[48px] text-white leading-tight">Instant Income</h1>
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#D4AF37]">High-Velocity Discovery Engine</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3 text-right">
                    <div className="flex items-center gap-2 bg-[#D4AF37]/10 px-3 py-1 border border-[#D4AF37]/20 rounded-sm">
                        <Rocket size={12} className="text-[#D4AF37]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Turbo-Charged Pipeline</span>
                    </div>
                    <span className="text-[10px] text-[#475569] font-medium tracking-widest uppercase">Latency: <span className="text-[#10B981]">0.012ms</span></span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 flex flex-col gap-12">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[32px] font-bold text-white leading-tight max-w-2xl">
                            The fastest path from <br />
                            <span className="text-[#D4AF37] glow-text">Intent to Income.</span>
                        </h2>
                        <p className="text-[#94A3B8] text-[16px] leading-relaxed max-w-xl">
                            Unlock the enterprise crawler array and bypass the standard processing queue. Instant Income gives you the first-strike advantage on high-value threads before your competition even sees them.
                        </p>
                    </div>

                    <div className="glass-card p-0! overflow-hidden border-[#141414]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#141414] bg-white/2">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#475569]">System Metric</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#475569]">Standard</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Instant Mode</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#10B981]">Efficiency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SPEED_METRICS.map((metric, idx) => (
                                    <tr key={idx} className="border-b border-[#141414] hover:bg-white/1 transition-colors">
                                        <td className="p-6 text-white font-medium">{metric.label}</td>
                                        <td className="p-6 text-[#475569]">{metric.basic}</td>
                                        <td className="p-6 text-[#D4AF37] font-bold">{metric.elite}</td>
                                        <td className="p-6 text-[#10B981] font-black text-[12px] uppercase">{metric.boost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="glass-card border-[#D4AF37]/20 p-8 flex flex-col gap-8 bg-linear-to-b from-[#141414] to-black">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Pro Protocol</span>
                            <h3 className="text-[20px] font-bold text-white leading-tight">Zero-Lag Activation</h3>
                        </div>
                        <ul className="flex flex-col gap-4">
                            <li className="flex gap-3 text-[13px] text-[#94A3B8]">
                                <Clock size={16} className="text-[#D4AF37] shrink-0" />
                                <span>Real-time crawler access</span>
                            </li>
                            <li className="flex gap-3 text-[13px] text-[#94A3B8]">
                                <TrendingUp size={16} className="text-[#D4AF37] shrink-0" />
                                <span>100x increase in daily threads</span>
                            </li>
                            <li className="flex gap-3 text-[13px] text-[#94A3B8]">
                                <Activity size={16} className="text-[#D4AF37] shrink-0" />
                                <span>Priority GPU processing</span>
                            </li>
                        </ul>
                        <button className="btn-primary w-full mt-4">
                            Unlock Instant Mode
                        </button>
                    </div>

                    <div className="glass-card p-6 bg-[#0A0A0A] border-[#141414] border-dashed text-center flex flex-col items-center gap-4">
                        <p className="text-[11px] text-[#475569] font-medium leading-relaxed">
                            Your current pipeline is operating at <br />
                            <span className="text-white font-bold underline decoration-[#D4AF37]">Standard Tier Latency</span>.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
