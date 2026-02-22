"use client";

import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, ArrowRight, BarChart3, Target, Info, Share2, History, Loader2, ChevronDown } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

export default function AnalysisPage() {
    const { analysis, setAnalysis, history, selectedKeyword, setSelectedKeyword, setVariations, setKeyword, keyword, setResults } = useSearch();
    const [loading, setLoading] = useState(false);
    const [fetchingHistory, setFetchingHistory] = useState<string | null>(null);
    const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);
    const [activeVariations, setActiveVariations] = useState<string[]>([]);
    const [loadingVariations, setLoadingVariations] = useState(false);
    const router = useRouter();

    const handleRootChange = async (val: string) => {
        setExpandedKeyword(val);
        if (!val) {
            setActiveVariations([]);
            return;
        }

        setLoadingVariations(true);
        try {
            const resp = await fetch("/api/radar", {
                method: "POST",
                body: JSON.stringify({ keyword: val })
            });
            const data = await resp.json();
            if (resp.ok) {
                setActiveVariations(data.variations || []);
                // Reset selected niche when root changes to avoid stale data
                if (!data.variations.includes(selectedKeyword)) {
                    setSelectedKeyword("");
                }
            }
        } catch (e) {
            console.error("Failed to fetch variations for root:", e);
        } finally {
            setLoadingVariations(false);
        }
    };

    const handleVariationChange = async (v: string) => {
        if (!v || !expandedKeyword) return;
        fetchAnalysisForVariation(v, expandedKeyword);
    };

    const fetchAnalysisForVariation = async (v: string, root: string) => {
        setFetchingHistory(v);
        try {
            // Update context to match the "root" search context
            setKeyword(root);
            setVariations(activeVariations);

            const resp = await fetch("/api/analysis", {
                method: "POST",
                body: JSON.stringify({ keyword: v })
            });
            const data = await resp.json();
            if (resp.ok) {
                setAnalysis(data);
                setSelectedKeyword(v);
            } else {
                alert(data.error || "Failed to load analysis.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        } finally {
            setFetchingHistory(null);
        }
    };

    const handleContinue = async () => {
        if (!selectedKeyword) return;
        setLoading(true);
        try {
            const resp = await fetch("/api/jackpots", {
                method: "POST",
                body: JSON.stringify({ keyword: selectedKeyword })
            });
            const data = await resp.json();
            if (resp.ok) {
                setResults(data.results || []);
                router.push("/jackpots");
            } else {
                alert(data.error || "Failed to find discussions.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    };

    const getActivityColor = (level: string) => {
        if (level === 'High Activity') return 'text-success';
        if (level === 'Active') return 'text-accent';
        return 'text-text-muted';
    };

    // Expand current context keyword on mount
    useEffect(() => {
        if (keyword && history.includes(keyword)) {
            setExpandedKeyword(keyword);
            // Pre-load variations for the current keyword
            fetch("/api/radar", {
                method: "POST",
                body: JSON.stringify({ keyword: keyword })
            }).then(r => r.json()).then(data => {
                if (data.variations) setActiveVariations(data.variations);
            });
        }
    }, [keyword, history]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-16 pb-20"
        >
            <header className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl text-text-primary mb-2 font-black tracking-tight">Market Analysis</h1>
                    <p className="subtitle text-xl max-w-3xl">
                        Deep synthesis for <span className="text-text-primary font-bold">"{selectedKeyword || "..."}"</span>. Mapping the pulse of global conversations and audience sentiment.
                    </p>
                </div>
            </header>

            {/* SECTION 1: SEARCH HISTORY (Dropdown Navigation) */}
            <section className="flex flex-col gap-8">
                <div className="flex items-center gap-4 border-b border-border-dim/30 pb-6">
                    <History size={28} className="text-accent" />
                    <h2 className="text-2xl font-bold tracking-tight">Recent Search History</h2>
                    <span className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold opacity-50 ml-auto hidden md:block">Navigate previously analyzed markets</span>
                </div>

                {history.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1.5 bg-surface/20 rounded-3xl border border-border-dim/20 backdrop-blur-sm shadow-sm">
                        {/* Root Keyword Select */}
                        <div className="relative group">
                            <select
                                value={expandedKeyword || ""}
                                onChange={(e) => handleRootChange(e.target.value)}
                                className="w-full h-14 bg-surface/40 border border-border-dim/30 rounded-2xl px-6 text-text-primary font-black text-base appearance-none cursor-pointer focus:border-accent/60 focus:bg-surface/60 transition-all outline-none"
                            >
                                <option value="" className="bg-surface text-text-muted">Select Research Root...</option>
                                {history.map((h, i) => (
                                    <option key={i} value={h} className="bg-surface text-text-primary">
                                        {h.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-accent transition-colors">
                                <ChevronDown size={20} />
                            </div>
                        </div>

                        {/* Variation Select */}
                        <div className="relative group">
                            {loadingVariations ? (
                                <div className="w-full h-14 bg-surface/40 border border-border-dim/30 rounded-2xl px-6 flex items-center justify-between animate-pulse">
                                    <span className="text-text-muted text-xs font-bold uppercase tracking-[0.2em]">Syncing...</span>
                                    <Loader2 size={20} className="animate-spin text-accent" />
                                </div>
                            ) : (
                                <>
                                    <select
                                        disabled={!expandedKeyword || activeVariations.length === 0}
                                        value={selectedKeyword || ""}
                                        onChange={(e) => handleVariationChange(e.target.value)}
                                        className="w-full h-14 bg-surface/40 border border-border-dim/30 rounded-2xl px-6 text-text-primary font-black text-base appearance-none cursor-pointer focus:border-accent/60 focus:bg-surface/60 transition-all outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <option value="" className="bg-surface text-text-muted">
                                            {expandedKeyword ? (activeVariations.length > 0 ? "Select Intelligence Niche..." : "No niches found") : "Awaiting Root Selection..."}
                                        </option>
                                        {activeVariations.map((v, i) => (
                                            <option key={i} value={v} className="bg-surface text-text-primary">
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-accent transition-colors">
                                        <ChevronDown size={20} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="col-span-full card-base bg-page/20 border-dashed border-2 py-20 flex flex-col items-center justify-center gap-6 opacity-60">
                        <div className="w-16 h-16 rounded-3xl bg-surface flex items-center justify-center border border-border-dim/50">
                            <History size={32} className="text-text-muted/40" />
                        </div>
                        <p className="text-xl text-text-muted font-medium italic">History is clear. Start your first search to fill this space.</p>
                    </div>
                )}
            </section>

            {/* SECTION 2: INTEL & ANALYSIS (Activity + Core Needs) */}
            <section className="flex flex-col gap-8">
                <div className="flex items-center gap-4 border-b border-border-dim/30 pb-6">
                    <BarChart3 size={28} className="text-accent" />
                    <h2 className="text-2xl font-bold tracking-tight">Analysis & Intelligence</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Activity Density Card */}
                    <div className="card-base xl:col-span-12 flex flex-col gap-6 p-6 shadow-sm bg-surface/30 backdrop-blur-md border-border-dim/20">
                        <div className="flex items-center justify-between border-b border-border-dim/30 pb-4">
                            <div className="flex items-center gap-3">
                                <Activity size={24} className="text-accent" />
                                <h3 className="text-xl font-bold tracking-tight">Activity Density</h3>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-success/5 border border-success/20 rounded-xl">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                                <span className="text-success text-[10px] font-black uppercase tracking-tighter">Live Scan</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <span className={clsx("text-4xl font-black leading-none tracking-tighter transition-colors duration-1000 shadow-none", getActivityColor(analysis?.level || ''))}>
                                    {analysis?.level || "SCANNING..."}
                                </span>
                                <p className="text-sm font-bold text-text-muted opacity-60 max-w-lg mt-1 uppercase tracking-widest leading-relaxed">
                                    Current conversation volume across target discussion hubs.
                                </p>
                            </div>

                            <div className="h-4 w-full bg-page/60 rounded-full overflow-hidden border border-border-dim/30 p-1 animate-pulse-slow">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: analysis?.level === 'High Activity' ? '100%' : analysis?.level === 'Active' ? '65%' : '25%' }}
                                    className={clsx("h-full rounded-full transition-all duration-1000 shadow-[0_0_30px_-5px]",
                                        analysis?.level === 'High Activity' ? 'bg-success shadow-success/40' : 'bg-accent shadow-accent/40'
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border-dim/30 mt-4">
                            <div className="flex flex-col gap-4 p-6 bg-page/20 rounded-3xl border border-border-dim/20">
                                <span className="text-[12px] text-text-muted font-bold uppercase tracking-widest opacity-50">Pulse Volume</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl text-text-primary font-black tracking-tighter">{analysis?.count?.toLocaleString() || 0}</span>
                                    <span className="text-sm text-accent font-bold">Units</span>
                                </div>
                                <span className="text-sm text-text-muted font-medium opacity-60">Verified in last 7 days.</span>
                            </div>
                            <div className="flex flex-col gap-4 p-6 bg-page/20 rounded-3xl border border-border-dim/20">
                                <span className="text-[12px] text-text-muted font-bold uppercase tracking-widest opacity-50">Scan Window</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl text-text-primary font-black tracking-tighter">7</span>
                                    <span className="text-sm text-accent font-bold">Days</span>
                                </div>
                                <span className="text-sm text-text-muted font-medium opacity-60">Rolling perspective.</span>
                            </div>
                        </div>
                    </div>

                    {/* Audience Intent Card */}
                    <div className="card-base xl:col-span-12 bg-surface/30 border-border-dim/20 flex flex-col gap-6 p-6 shadow-sm relative overflow-hidden backdrop-blur-md">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -mr-16 -mt-16" />

                        <div className="flex items-center gap-3 border-b border-border-dim/20 pb-4 relative z-10">
                            <Target size={24} className="text-accent" />
                            <h3 className="text-xl font-bold tracking-tight">Audience Pain Points</h3>
                        </div>

                        <div className="bg-page/40 rounded-3xl p-6 border border-border-dim/10 relative overflow-hidden flex-1 shadow-none group flex items-center justify-center min-h-[200px]">
                            <Info size={32} className="absolute top-6 right-6 text-accent/5 group-hover:text-accent/20 transition-all duration-700" />
                            <div className="text-text-secondary text-lg leading-relaxed italic whitespace-pre-line font-medium text-center px-4 relative z-10">
                                {fetchingHistory ? (
                                    <div className="flex flex-col items-center justify-center gap-6">
                                        <div className="relative">
                                            <Loader2 className="animate-spin text-accent" size={40} />
                                            <div className="absolute inset-0 bg-accent/30 blur-2xl scale-125 animate-pulse" />
                                        </div>
                                        <span className="text-xs not-italic opacity-80 font-black uppercase tracking-[0.2em] text-accent animate-pulse">Extracting Intent...</span>
                                    </div>
                                ) : (
                                    analysis?.classification || "Mapping human sentiment and identifying high-intent friction points..."
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-border-dim/10 relative z-10">
                            <div className="flex items-center justify-between text-[10px] font-black text-text-muted uppercase tracking-widest">
                                <span>AI Confidence</span>
                                <span className="text-accent bg-accent/10 px-3 py-1 rounded-xl border border-accent/20 font-black">94% Precision</span>
                            </div>
                            <div className="h-2 w-full bg-page/50 rounded-full overflow-hidden p-0.5 shadow-none">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "94%" }}
                                    className="h-full bg-accent/80 rounded-full"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: REWARD & ACTION (Bottom Bar) */}
            <section className="pt-2">
                <div className="flex flex-col lg:flex-row justify-between items-center bg-surface/40 border border-border-dim/20 rounded-3xl p-8 gap-10 shadow-sm relative overflow-hidden group backdrop-blur-md">
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                        <div className="w-14 h-14 rounded-2xl bg-brand-tint border border-accent/10 flex items-center justify-center shadow-none group-hover:scale-105 transition-all duration-700">
                            <Share2 size={24} className="text-accent" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-black text-text-primary tracking-tight">Market Intelligence Ready</h3>
                            <p className="text-base text-text-muted opacity-60 max-w-xl font-medium">Ready to transition from analysis to action. Locate the high-value conversations now.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full lg:w-auto">
                        <button
                            onClick={() => router.push("/radar")}
                            className="w-full sm:w-auto px-8 h-14 rounded-2xl border border-border-dim text-text-secondary hover:bg-surface-lighter hover:text-text-primary hover:border-accent/40 transition-all text-base font-black tracking-tight shadow-none whitespace-nowrap"
                        >
                            Back to Variations
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={loading || !analysis}
                            className="w-full sm:w-auto btn-primary min-w-[260px] h-14 rounded-2xl text-lg font-black tracking-tight shadow-md hover:-translate-y-0.5 transition-all duration-500"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <Loader2 className="animate-spin" size={24} />
                                    <span className="uppercase text-sm tracking-widest">Harvesting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <span className="uppercase text-sm tracking-widest">Locate Discussions</span>
                                    <ArrowRight size={24} />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
