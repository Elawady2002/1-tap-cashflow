"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Search, Check } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";

export default function RadarPage() {
    const { variations, setSelectedKeyword, selectedKeyword, setAnalysis } = useSearch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSelect = async (v: string) => {
        setSelectedKeyword(v);
    };

    const handleContinue = async () => {
        if (!selectedKeyword) return;
        setLoading(true);
        try {
            const resp = await fetch("/api/analysis", {
                method: "POST",
                body: JSON.stringify({ keyword: selectedKeyword })
            });
            const data = await resp.json();
            setAnalysis(data);
            router.push("/analysis");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-10"
        >
            <header className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl text-text-primary">Keyword Expansion</h1>
                    <p className="subtitle">Choose a specific marketing angle or sub-niche to analyze the conversation landscape.</p>
                </div>
            </header>

            <div className="card-base flex flex-col gap-8">
                <div className="flex items-center justify-between border-b border-border-dim/50 pb-6">
                    <div className="flex items-center gap-2">
                        <Search size={18} className="text-accent" />
                        <h3 className="text-lg">Generated Variations</h3>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand-tint rounded-full">
                        <Sparkles size={14} className="text-accent" />
                        <span className="text-[11px] font-bold text-accent uppercase tracking-wider">AI Optimized</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {variations.length > 0 ? variations.map((v, i) => {
                        const isSelected = selectedKeyword === v;
                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(v)}
                                className={clsx(
                                    "px-6 py-3 rounded-xl border text-[15px] font-medium transition-all flex items-center gap-2",
                                    isSelected
                                        ? "bg-accent text-black border-accent shadow-gold"
                                        : "bg-surface border-border-dim text-text-secondary hover:border-accent/40 hover:text-text-primary"
                                )}
                            >
                                {v}
                                {isSelected && <Check size={16} />}
                            </button>
                        );
                    }) : (
                        <div className="w-full py-20 text-center border border-dashed border-border-dim rounded-xl">
                            <p className="text-text-muted">No variations found. Please start a new search from the dashboard.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center bg-surface border border-border-dim rounded-2xl p-8 gap-6">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Selected Focus</span>
                    <span className="text-text-primary font-bold text-xl">{selectedKeyword || "Choose a variation above..."}</span>
                </div>
                <button
                    onClick={handleContinue}
                    disabled={loading || !selectedKeyword}
                    className="btn-primary min-w-[280px] h-14"
                >
                    {loading ? "Preparing Analysis..." : "Analyze Marketplace"}
                    <ArrowRight size={20} />
                </button>
            </div>
        </motion.div>
    );
}
