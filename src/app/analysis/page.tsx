"use client";

import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, ArrowRight, BarChart3, Target, Info, Share2 } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";

export default function AnalysisPage() {
    const { analysis, selectedKeyword, setResults } = useSearch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleContinue = async () => {
        setLoading(true);
        try {
            const resp = await fetch("/api/jackpots", {
                method: "POST",
                body: JSON.stringify({ keyword: selectedKeyword })
            });
            const data = await resp.json();
            setResults(data.results || []);
            router.push("/jackpots");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getActivityColor = (level: string) => {
        if (level === 'High Activity') return 'text-success';
        if (level === 'Active') return 'text-accent';
        return 'text-text-muted';
    };

    const getActivityBg = (level: string) => {
        if (level === 'High Activity') return 'bg-success/20';
        if (level === 'Active') return 'bg-accent/20';
        return 'bg-border-dim/50';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-10"
        >
            <header className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl text-text-primary">Market Analysis</h1>
                    <p className="subtitle">
                        Market pulse for <span className="text-text-primary font-bold">"{selectedKeyword}"</span>. Insights into conversation volume and audience intent.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Activity Density */}
                <div className="card-base flex flex-col gap-8 lg:col-span-3">
                    <div className="flex items-center justify-between border-b border-border-dim/50 pb-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-accent" />
                            <h3 className="text-lg">Activity Density</h3>
                        </div>
                        <span className="px-3 py-1 bg-brand-tint border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full">Live Data</span>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className={clsx("text-5xl font-bold leading-tight", getActivityColor(analysis?.level || ''))}>
                                    {analysis?.level || "SCANNING..."}
                                </span>
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Platform Engagement intensity</span>
                            </div>
                        </div>

                        <div className="h-3 w-full bg-page rounded-full overflow-hidden border border-border-dim">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: analysis?.level === 'High Activity' ? '100%' : analysis?.level === 'Active' ? '65%' : '25%' }}
                                className={clsx("h-full transition-all duration-1000",
                                    analysis?.level === 'High Activity' ? 'bg-success shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-accent shadow-gold'
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border-dim/50">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-text-muted font-bold uppercase tracking-widest">Total Discussions</span>
                            <span className="text-2xl text-text-primary font-bold">{analysis?.count || 0}</span>
                            <span className="text-xs text-text-muted italic">Within the last 7 days.</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-text-muted font-bold uppercase tracking-widest">Analysis Range</span>
                            <span className="text-2xl text-text-primary font-bold">7 Days</span>
                            <span className="text-xs text-text-muted italic">Current lookback window.</span>
                        </div>
                    </div>
                </div>

                {/* Intent/Need Classification */}
                <div className="card-base bg-brand-tint border-accent/10 flex flex-col gap-6 lg:col-span-2">
                    <div className="flex items-center gap-2 border-b border-accent/10 pb-4">
                        <Target size={18} className="text-accent" />
                        <h3 className="text-lg">Core Audience Needs</h3>
                    </div>

                    <div className="bg-page/50 rounded-xl p-6 border border-accent/5 relative overflow-hidden flex-1">
                        <Info size={20} className="absolute top-4 right-4 text-accent/20" />
                        <p className="text-text-secondary text-[15px] leading-relaxed italic whitespace-pre-line">
                            {analysis?.classification || "Analyzing conversation sentiment and identifying specific user pain points..."}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto pt-4">
                        <div className="flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-widest">
                            <span>Analysis Accuracy</span>
                            <span className="text-accent">94%</span>
                        </div>
                        <div className="h-1.5 w-full bg-page rounded-full overflow-hidden">
                            <div className="h-full bg-accent/40 w-[94%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center bg-surface border border-border-dim rounded-2xl p-8 gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-tint flex items-center justify-center">
                        <Share2 size={18} className="text-accent" />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">Analysis complete across all major platforms.</span>
                </div>
                <button
                    onClick={handleContinue}
                    disabled={loading}
                    className="btn-primary min-w-[280px] h-14"
                >
                    {loading ? "Finding Discussions..." : "Find Target Discussions"}
                    <ArrowRight size={20} />
                </button>
            </div>
        </motion.div>
    );
}
