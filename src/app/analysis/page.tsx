"use client";

import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, ArrowRight, BarChart3, Target, Info, Share2, History, Loader2 } from "lucide-react";
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

    const toggleExpandKeyword = async (h: string) => {
        if (expandedKeyword === h) {
            setExpandedKeyword(null);
            return;
        }

        setExpandedKeyword(h);
        setLoadingVariations(true);
        try {
            const resp = await fetch("/api/radar", {
                method: "POST",
                body: JSON.stringify({ keyword: h })
            });
            const data = await resp.json();
            if (resp.ok) {
                setActiveVariations(data.variations || []);
            }
        } catch (e) {
            console.error("Failed to fetch variations for history:", e);
        } finally {
            setLoadingVariations(false);
        }
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

            {/* SECTION 1: SEARCH HISTORY (Standalone Section) */}
            <section className="flex flex-col gap-8">
                <div className="flex items-center gap-4 border-b border-border-dim/30 pb-6">
                    <History size={28} className="text-accent" />
                    <h2 className="text-2xl font-bold tracking-tight">Recent Search History</h2>
                    <span className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold opacity-50 ml-auto hidden md:block">Click keywords to expand variations</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {history.length > 0 ? history.map((h, i) => {
                        const isExpanded = expandedKeyword === h;
                        return (
                            <div key={i} className="flex flex-col gap-4 group">
                                <button
                                    onClick={() => toggleExpandKeyword(h)}
                                    className={clsx(
                                        "flex flex-col justify-between p-8 rounded-3xl border transition-all text-left relative overflow-hidden h-[140px]",
                                        isExpanded
                                            ? "bg-accent/10 border-accent/60 shadow-xl shadow-gold/10"
                                            : "bg-surface/40 border-border-dim/50 hover:border-accent/40 hover:bg-surface/60 shadow-sm"
                                    )}
                                >
                                    {isExpanded && <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl -mr-12 -mt-12" />}

                                    <div className="flex flex-col gap-1 z-10">
                                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60">Keyword</span>
                                        <span className={clsx(
                                            "text-xl font-black truncate transition-colors",
                                            isExpanded ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                                        )}>{h}</span>
                                    </div>

                                    <div className="flex items-center justify-between w-full mt-auto z-10">
                                        <span className="text-[10px] font-bold text-accent px-3 py-1 bg-accent/5 rounded-full border border-accent/10 uppercase tracking-widest">Global Scan</span>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-page/40 group-hover:bg-accent/10 transition-colors">
                                            {isExpanded ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                                            ) : (
                                                <ArrowRight size={18} className="text-text-muted opacity-50 group-hover:text-accent transition-all" />
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="flex flex-col gap-3 p-6 bg-sidebar/40 rounded-[2rem] border border-accent/20 shadow-inner"
                                    >
                                        <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 px-1 opacity-80">Niche Variations</h4>
                                        {loadingVariations ? (
                                            <div className="flex items-center gap-4 p-4 bg-page/30 rounded-2xl animate-pulse">
                                                <Loader2 size={16} className="animate-spin text-accent" />
                                                <span className="text-sm text-text-muted font-bold tracking-tight">Syncing threads...</span>
                                            </div>
                                        ) : activeVariations.length > 0 ? (
                                            <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                                {activeVariations.map((v, idx) => {
                                                    const isSelected = selectedKeyword === v;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => fetchAnalysisForVariation(v, h)}
                                                            disabled={fetchingHistory !== null}
                                                            className={clsx(
                                                                "text-left p-5 rounded-2xl text-sm transition-all border flex items-center justify-between group/v",
                                                                isSelected
                                                                    ? "bg-accent text-black border-accent font-black shadow-lg shadow-gold/20"
                                                                    : "bg-surface/50 border-border-dim/20 text-text-secondary hover:text-text-primary hover:border-accent/40"
                                                            )}
                                                        >
                                                            <span className="truncate">{v}</span>
                                                            {fetchingHistory === v ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : isSelected ? (
                                                                <div className="w-2 h-2 rounded-full bg-black/30" />
                                                            ) : (
                                                                <ArrowRight size={14} className="opacity-0 group-hover/v:opacity-100 transition-opacity text-accent" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-text-muted p-8 bg-page/20 rounded-[1.5rem] text-center italic border border-dashed border-border-dim/30">
                                                No variations found.
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        );
                    }) : (
                        <div className="col-span-full card-base bg-page/20 border-dashed border-2 py-20 flex flex-col items-center justify-center gap-6 opacity-60">
                            <div className="w-16 h-16 rounded-3xl bg-surface flex items-center justify-center border border-border-dim/50">
                                <History size={32} className="text-text-muted/40" />
                            </div>
                            <p className="text-xl text-text-muted font-medium italic">History is clear. Start your first search to fill this space.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION 2: INTEL & ANALYSIS (Activity + Core Needs) */}
            <section className="flex flex-col gap-8">
                <div className="flex items-center gap-4 border-b border-border-dim/30 pb-6">
                    <BarChart3 size={28} className="text-accent" />
                    <h2 className="text-2xl font-bold tracking-tight">Analysis & Intelligence</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Activity Density Card */}
                    <div className="card-base xl:col-span-7 flex flex-col gap-10 p-12 shadow-2xl bg-surface/30 backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-border-dim/30 pb-8">
                            <div className="flex items-center gap-4">
                                <Activity size={28} className="text-accent" />
                                <h3 className="text-2xl font-black tracking-tight">Activity Density</h3>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-success/5 border border-success/20 rounded-2xl">
                                <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                                <span className="text-success text-[12px] font-black uppercase tracking-tighter">Live Scan</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-3">
                                <span className={clsx("text-8xl font-black leading-none tracking-tighter transition-colors duration-1000", getActivityColor(analysis?.level || ''))}>
                                    {analysis?.level || "SCANNING..."}
                                </span>
                                <p className="text-base font-bold text-text-muted opacity-60 max-w-lg mt-2 uppercase tracking-widest leading-relaxed">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border-dim/30 mt-4">
                            <div className="flex flex-col gap-4 p-8 bg-page/20 rounded-3xl border border-border-dim/20">
                                <span className="text-[12px] text-text-muted font-bold uppercase tracking-widest opacity-50">Pulse Volume</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl text-text-primary font-black tracking-tighter">{analysis?.count?.toLocaleString() || 0}</span>
                                    <span className="text-sm text-accent font-bold">Units</span>
                                </div>
                                <span className="text-sm text-text-muted font-medium opacity-60">Verified in the last 7 day window.</span>
                            </div>
                            <div className="flex flex-col gap-4 p-8 bg-page/20 rounded-3xl border border-border-dim/20">
                                <span className="text-[12px] text-text-muted font-bold uppercase tracking-widest opacity-50">Scan Window</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl text-text-primary font-black tracking-tighter">7</span>
                                    <span className="text-sm text-accent font-bold">Days</span>
                                </div>
                                <span className="text-sm text-text-muted font-medium opacity-60">Rolling chronological perspective.</span>
                            </div>
                        </div>
                    </div>

                    {/* Audience Intent Card */}
                    <div className="card-base xl:col-span-5 bg-brand-tint/10 border-accent/20 flex flex-col gap-10 p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -mr-32 -mt-32" />

                        <div className="flex items-center gap-4 border-b border-accent/20 pb-8 relative z-10">
                            <Target size={28} className="text-accent" />
                            <h3 className="text-2xl font-black tracking-tight">Audience Pain Points</h3>
                        </div>

                        <div className="bg-page/40 rounded-[2.5rem] p-12 border border-accent/10 relative overflow-hidden flex-1 shadow-inner group flex items-center justify-center min-h-[400px]">
                            <Info size={48} className="absolute top-10 right-10 text-accent/5 group-hover:text-accent/20 transition-all duration-700" />
                            <div className="text-text-secondary text-2xl leading-[1.6] italic whitespace-pre-line font-medium text-center px-6 relative z-10">
                                {fetchingHistory ? (
                                    <div className="flex flex-col items-center justify-center gap-10">
                                        <div className="relative">
                                            <Loader2 className="animate-spin text-accent" size={80} />
                                            <div className="absolute inset-0 bg-accent/30 blur-3xl scale-150 animate-pulse" />
                                        </div>
                                        <span className="text-lg not-italic opacity-80 font-black uppercase tracking-[0.3em] text-accent animate-pulse">Extracting Intent...</span>
                                    </div>
                                ) : (
                                    analysis?.classification || "Mapping human sentiment and identifying high-intent friction points..."
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mt-auto pt-10 border-t border-accent/10 relative z-10">
                            <div className="flex items-center justify-between text-[11px] font-black text-text-muted uppercase tracking-widest">
                                <span>AI Decoding Confidence</span>
                                <span className="text-accent bg-accent/10 px-5 py-2 rounded-2xl border border-accent/20 shadow-sm font-black">94% Precision</span>
                            </div>
                            <div className="h-3 w-full bg-page/50 rounded-full overflow-hidden p-0.5 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "94%" }}
                                    className="h-full bg-accent/80 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: REWARD & ACTION (Bottom Bar) */}
            <section className="pt-12">
                <div className="flex flex-col lg:flex-row justify-between items-center bg-surface/60 border-2 border-accent/10 rounded-[3rem] p-16 gap-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden group backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent pointer-events-none" />
                    <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute -top-48 -right-48 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors duration-1000" />

                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 text-center md:text-left">
                        <div className="w-24 h-24 rounded-[2rem] bg-brand-tint border-2 border-accent/20 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                            <Share2 size={40} className="text-accent" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="text-3xl font-black text-text-primary tracking-tighter">Market Intelligence Ready</h3>
                            <p className="text-xl text-text-muted opacity-70 max-w-xl font-medium">Ready to transition from analysis to action. Locate the high-value conversations now.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 w-full lg:w-auto">
                        <button
                            onClick={() => router.push("/radar")}
                            className="w-full sm:w-auto px-12 h-20 rounded-[1.5rem] border-2 border-border-dim text-text-secondary hover:bg-surface-lighter hover:text-text-primary hover:border-accent/40 transition-all text-xl font-black tracking-tight shadow-lg"
                        >
                            Back to Variations
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={loading || !analysis}
                            className="w-full sm:w-auto btn-primary min-w-[340px] h-24 rounded-[1.75rem] text-2xl font-black tracking-tight shadow-[0_25px_60px_-10px_rgba(234,179,8,0.5)] hover:shadow-[0_35px_80px_-10px_rgba(234,179,8,0.7)] hover:-translate-y-2 transition-all duration-500"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-5">
                                    <Loader2 className="animate-spin" size={32} />
                                    <span>Harvesting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-5">
                                    <span>Locate Discussions</span>
                                    <ArrowRight size={32} />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
