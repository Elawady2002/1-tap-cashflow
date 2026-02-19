"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, History, ArrowRight, Zap, Globe, Cpu } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { motion } from "framer-motion";

export default function Dashboard() {
    const { keyword, setKeyword, setVariations, history, addToHistory } = useSearch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async (val?: string) => {
        const searchVal = val || keyword;
        if (!searchVal) return;

        setLoading(true);
        addToHistory(searchVal);

        try {
            const resp = await fetch("/api/radar", {
                method: "POST",
                body: JSON.stringify({ keyword: searchVal })
            });
            const data = await resp.json();
            setVariations(data.variations || []);
            router.push("/radar");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-20 py-10"
        >

            {/* Main Search Interface */}
            <section className="relative">
                <div className="glass-card bg-transparent! p-0! border-none">
                    <div className="flex flex-col gap-8">
                        <div className="flex gap-4">
                            <div className="flex-1 flex items-center gap-5 bg-[#0A0A0A] border border-[#141414] px-8 py-6 focus-within:border-[#D4AF37] transition-all group">
                                <Search size={24} className="text-[#475569] group-focus-within:text-[#D4AF37]" />
                                <input
                                    type="text"
                                    placeholder="Describe your product or target niche..."
                                    className="bg-transparent border-none outline-none text-[18px] w-full text-white placeholder-[#475569] font-medium"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <button
                                onClick={() => handleSearch()}
                                disabled={loading || !keyword}
                                className="elite-btn min-w-[260px]"
                            >
                                {loading ? "Initializing..." : "Engage Neural Radar"}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <div className="grid grid-cols-3 gap-8">
                {/* History Box */}
                <div className="glass-card flex flex-col gap-8 col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <History size={18} className="text-[#D4AF37]" />
                            <h3 className="text-[16px] text-white font-bold uppercase tracking-widest">Recent Vectors</h3>
                        </div>
                        <span className="text-[10px] text-[#475569] font-bold uppercase tracking-widest">Global History</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {history.length > 0 ? history.map((h, i) => (
                            <button
                                key={i}
                                onClick={() => handleSearch(h)}
                                className="flex items-center justify-between p-5 bg-black border border-[#141414] hover:border-[#D4AF37]/40 text-[#94A3B8] hover:text-white transition-all text-sm group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Globe size={14} className="text-[#475569]" />
                                    <span className="font-medium">{h}</span>
                                </div>
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]" />
                            </button>
                        )) : (
                            <div className="col-span-2 py-10 text-center border border-dashed border-[#141414]">
                                <p className="text-[#475569] text-sm font-medium">No previous intelligence sessions found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Process Box */}
                <div className="glass-card bg-[#D4AF37]/5 border-[#D4AF37]/10 flex flex-col justify-between items-start gap-10">
                    <Cpu size={32} className="text-[#D4AF37]" />
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[20px] text-white leading-tight font-bold">Closed-Loop Discovery.</h3>
                        <p className="text-[#94A3B8] text-sm leading-relaxed">
                            From broad niches to specific human intent—all within a single, unified pipeline.
                        </p>
                    </div>
                    <div className="w-full h-1 bg-[#141414]">
                        <div className="w-[80%] h-full bg-[#D4AF37]"></div>
                    </div>
                </div>
            </div>

        </motion.div>
    );
}
