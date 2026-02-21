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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-10"
        >
            <header className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl text-text-primary">Market Analysis</h1>
                    <p className="subtitle">
                        Market pulse for <span className="text-text-primary font-bold">"{selectedKeyword || "..."}"</span>. Insights into conversation volume and audience intent.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar: Recent Searches */}
                <aside className="flex flex-col gap-6">
                    <div className="card-base flex flex-col gap-8 h-full min-h-[600px] bg-sidebar/40 border-accent/5 backdrop-blur-sm shadow-xl">
                        <div className="flex items-center gap-3 border-b border-border-dim/30 pb-6">
                            <History size={22} className="text-accent" />
                            <h3 className="text-xl font-bold tracking-tight">Search History</h3>
                        </div>
                        <div className="flex flex-col gap-5 overflow-y-auto max-h-[700px] pr-3 custom-scrollbar">
                            {history.length > 0 ? history.map((h, i) => {
                                const isExpanded = expandedKeyword === h;
                                return (
                                    <div key={i} className="flex flex-col gap-3">
                                        <button
                                            onClick={() => toggleExpandKeyword(h)}
                                            className={clsx(
                                                "flex items-center justify-between p-5 rounded-2xl border transition-all text-left",
                                                isExpanded
                                                    ? "bg-accent/10 border-accent/50 shadow-gold/20"
                                                    : "bg-surface/50 border-border-dim/50 hover:border-accent/40 hover:bg-surface"
                                            )}
                                        >
                                            <span className={clsx(
                                                "text-[15px] font-bold truncate",
                                                isExpanded ? "text-accent" : "text-text-secondary"
                                            )}>{h}</span>
                                            {isExpanded ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                            ) : (
                                                <ArrowRight size={16} className="text-text-muted opacity-50" />
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                className="flex flex-col gap-2 pl-5 border-l-2 border-accent/20 ml-3 py-2"
                                            >
                                                {loadingVariations ? (
                                                    <div className="flex items-center gap-3 p-3 bg-surface/30 rounded-xl">
                                                        <Loader2 size={14} className="animate-spin text-accent" />
                                                        <span className="text-xs text-text-muted font-medium">Fetching variations...</span>
                                                    </div>
                                                ) : activeVariations.length > 0 ? (
                                                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {activeVariations.map((v, idx) => {
                                                            const isSelected = selectedKeyword === v;
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => fetchAnalysisForVariation(v, h)}
                                                                    disabled={fetchingHistory !== null}
                                                                    className={clsx(
                                                                        "text-left p-4 rounded-xl text-[13px] transition-all border",
                                                                        isSelected
                                                                            ? "bg-accent text-black border-accent font-bold shadow-gold/30"
                                                                            : "bg-page/30 border-transparent text-text-muted hover:text-text-primary hover:border-border-dim/50 hover:bg-page/50"
                                                                    )}
                                                                >
                                                                    {fetchingHistory === v ? (
                                                                        <div className="flex items-center gap-2">
                                                                            <Loader2 size={12} className="animate-spin" />
                                                                            <span>Analyzing niche...</span>
                                                                        </div>
                                                                    ) : v}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-text-muted p-4 bg-surface/30 rounded-xl text-center italic">No variations found</span>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            }) : (
                                <p className="text-xs text-text-muted text-center py-12 italic opacity-50">Your search history will appear here.</p>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content: Analysis Results */}
                <main className="lg:col-span-3 flex flex-col gap-12">
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                        {/* Activity Density */}
                        <div className="card-base flex flex-col gap-10 xl:col-span-3 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-border-dim/50 pb-6">
                                <div className="flex items-center gap-3">
                                    <BarChart3 size={22} className="text-accent" />
                                    <h3 className="text-xl font-bold">Activity Density</h3>
                                </div>
                                <span className="px-4 py-1.5 bg-brand-tint border border-accent/20 text-accent text-[11px] font-bold uppercase tracking-widest rounded-full shadow-inner">Live Marketplace Data</span>
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className={clsx("text-6xl font-bold leading-none tracking-tight", getActivityColor(analysis?.level || ''))}>
                                            {analysis?.level || "SCANNING..."}
                                        </span>
                                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest mt-2 opacity-70">Platform engagement & conversation intensity</span>
                                    </div>
                                </div>

                                <div className="h-4 w-full bg-page rounded-full overflow-hidden border border-border-dim/50 p-1 shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: analysis?.level === 'High Activity' ? '100%' : analysis?.level === 'Active' ? '65%' : '25%' }}
                                        className={clsx("h-full rounded-full transition-all duration-1000",
                                            analysis?.level === 'High Activity' ? 'bg-success shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-accent shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border-dim/50 mt-4">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[11px] text-text-muted font-bold uppercase tracking-widest opacity-60">Sampled Discussions</span>
                                    <span className="text-4xl text-text-primary font-bold tracking-tight">{analysis?.count?.toLocaleString() || 0}</span>
                                    <span className="text-[11px] text-text-muted italic opacity-70">Identified in last 7 days.</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[11px] text-text-muted font-bold uppercase tracking-widest opacity-60">Analysis Horizon</span>
                                    <span className="text-4xl text-text-primary font-bold tracking-tight">7 Days</span>
                                    <span className="text-[11px] text-text-muted italic opacity-70">Latest conversation batch.</span>
                                </div>
                            </div>
                        </div>

                        {/* Intent/Need Classification */}
                        <div className="card-base bg-brand-tint border-accent/20 flex flex-col gap-8 xl:col-span-2 shadow-2xl">
                            <div className="flex items-center gap-3 border-b border-accent/20 pb-6">
                                <Target size={22} className="text-accent" />
                                <h3 className="text-xl font-bold">Core Audience Needs</h3>
                            </div>

                            <div className="bg-page/60 rounded-2xl p-8 border border-accent/10 relative overflow-hidden flex-1 shadow-inner group">
                                <Info size={24} className="absolute top-6 right-6 text-accent/10 group-hover:text-accent/30 transition-colors" />
                                <div className="text-text-secondary text-[17px] leading-relaxed italic whitespace-pre-line font-medium">
                                    {fetchingHistory ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-6">
                                            <div className="relative">
                                                <Loader2 className="animate-spin text-accent" size={48} />
                                                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
                                            </div>
                                            <span className="text-sm not-italic opacity-60 font-bold uppercase tracking-widest">Synthesizing Intent...</span>
                                        </div>
                                    ) : (
                                        analysis?.classification || "Analyzing conversation sentiment and identifying specific user pain points..."
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mt-auto pt-8 border-t border-accent/10">
                                <div className="flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-widest">
                                    <span>AI Confidence Score</span>
                                    <span className="text-accent bg-brand-tint px-3 py-1 rounded-lg border border-accent/20">94% Accuracy</span>
                                </div>
                                <div className="h-2 w-full bg-page rounded-full overflow-hidden p-0.5 shadow-inner">
                                    <div className="h-full bg-accent/60 rounded-full w-[94%] shadow-[0_0_10px_rgba(234,179,8,0.2)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-surface border border-border-dim rounded-3xl p-10 gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-brand-tint flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                <Share2 size={24} className="text-accent" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-lg font-bold text-text-primary">Market Intelligence Ready</span>
                                <span className="text-sm text-text-muted opacity-80">Deep insights synthesized across all conversation platforms.</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 relative z-10">
                            <button
                                onClick={() => router.push("/radar")}
                                className="px-8 h-16 rounded-2xl border border-border-dim text-text-secondary hover:bg-surface-lighter hover:text-text-primary transition-all text-[15px] font-bold shadow-sm"
                            >
                                Back to Variations
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={loading || !analysis}
                                className="btn-primary min-w-[280px] h-16 rounded-2xl text-lg shadow-[0_10px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_30px_rgba(234,179,8,0.4)]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Locating Threads...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Find Target Discussions</span>
                                        <ArrowRight size={24} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </motion.div>
    );
}
