"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, History, ArrowRight, Activity, Globe, Info } from "lucide-react";
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-12"
        >
            {/* Search Section */}
            <section className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl text-text-primary">Market Hub</h1>
                    <p className="subtitle">Identify high-value discussions and track buying intent in real-time.</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 relative group">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="e.g., 'Air Fryer' or 'Digital Marketing Tools'..."
                            className="input-base w-full pl-12 h-14 text-lg"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button
                        onClick={() => handleSearch()}
                        disabled={loading || !keyword}
                        className="btn-primary min-w-[200px] h-14 shadow-gold"
                    >
                        {loading ? "Analyzing..." : "Start New Search"}
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* History & Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Searches */}
                <div className="card-base col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-border-dim/50 pb-4">
                        <div className="flex items-center gap-2">
                            <History size={18} className="text-accent" />
                            <h3 className="text-lg">Recent Searches</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {history.length > 0 ? history.map((h, i) => (
                            <button
                                key={i}
                                onClick={() => handleSearch(h)}
                                className="flex items-center justify-between p-4 bg-page/50 border border-border-dim rounded-lg hover:border-accent/40 hover:bg-surface transition-all group group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Globe size={14} className="text-text-muted group-hover:text-accent" />
                                    <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">{h}</span>
                                </div>
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-accent" />
                            </button>
                        )) : (
                            <div className="col-span-2 py-10 text-center border border-dashed border-border-dim rounded-lg">
                                <p className="text-text-muted text-sm">No previous searches found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pro Tip Card */}
                <div className="card-base bg-brand-tint border-accent/10 flex flex-col gap-6">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Activity size={24} className="text-accent" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xl font-bold">Pro Analysis</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Start with a broad keyword, then use the expansion tool to find specific user pain points and conversion opportunities.
                        </p>
                    </div>
                    <div className="mt-auto flex items-center gap-2 text-accent text-sm font-semibold">
                        <Info size={14} />
                        <span>Ready to assist 24/7</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
