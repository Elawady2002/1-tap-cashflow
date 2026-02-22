"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, ArrowLeft, Copy, RefreshCcw, Check, Sparkles, Send, LayoutGrid, Quote } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

export default function GeneratePage() {
    const { selectedPosts, affiliateLink, resetSession, replies, setReplies } = useSearch();
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [currentPosts, setCurrentPosts] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        // If we already have replies from the Jackpots page, don't re-generate
        if (replies && replies.length > 0) {
            setCurrentPosts(selectedPosts);
            return;
        }

        let targetPosts: any[] = selectedPosts;
        let targetLink = affiliateLink;

        // Demo Fallback
        if (selectedPosts.length === 0) {
            targetPosts = [
                { id: "demo-1", platform: "Reddit", text: "What really separates the top 1% of SaaS founders from the rest?", engagement: "450 Upvotes", url: "#" },
                { id: "demo-2", platform: "YouTube", text: "The unspoken truth about scaling your agency to $50k/mo.", engagement: "12K Views", url: "#" }
            ];
            targetLink = "https://adradar.ai";
        }

        setCurrentPosts(targetPosts);
        generate(targetPosts, targetLink);
    }, []);

    const generate = async (posts: any[], link: string) => {
        setLoading(true);
        try {
            const resp = await fetch("/api/replies", {
                method: "POST",
                body: JSON.stringify({ posts, affiliateLink: link })
            });
            const data = await resp.json();
            setReplies(data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = () => {
        generate(currentPosts, affiliateLink || "https://adradar.ai");
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleFinish = () => {
        resetSession();
        router.push("/dashboard");
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-10"
        >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-dim/50 pb-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl text-text-primary">Personalised Replies</h1>
                        <p className="subtitle">AI-generated responses tailored to identified user pain points and conversation context.</p>
                    </div>
                </div>

                <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="btn-secondary h-12"
                >
                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                    <span>Regenerate All</span>
                </button>
            </header>

            <div className="flex flex-col gap-10">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="py-32 card-base border-dashed flex flex-col items-center justify-center gap-6"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border-2 border-border-dim border-t-accent rounded-full animate-spin" />
                                <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" />
                            </div>
                            <div className="text-center flex flex-col gap-2">
                                <p className="text-lg font-bold text-text-primary uppercase tracking-[0.2em]">Writing responses...</p>
                                <p className="text-sm text-text-secondary">Analyzing intent and crafting high-conversion replies.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-12">
                            {replies.map((item, idx) => (
                                <motion.div
                                    key={item.id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="card-base p-0! overflow-hidden shadow-lg"
                                >
                                    <div className="p-8 bg-surface border-b border-border-dim/50 flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-text-muted">
                                            <Quote size={16} className="text-accent" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Original Discussion</span>
                                        </div>
                                        <p className="text-text-primary text-lg font-medium leading-relaxed italic border-l-2 border-accent pl-6">
                                            "{item.text}"
                                        </p>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-page">
                                        {item.replies.map((reply: string, rIdx: number) => {
                                            const uniqueId = `${item.id || idx}-${rIdx}`;
                                            const titles = ["Direct Action", "Value First", "Curiosity Based"];
                                            return (
                                                <div key={rIdx} className="flex flex-col card-base bg-surface/50 p-6 hover:border-accent/30 transition-all group">
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-dim/30">
                                                        <span className="text-[11px] font-bold text-accent uppercase tracking-widest">{titles[rIdx]}</span>
                                                        <span className="text-[10px] text-text-muted font-medium">Variant {rIdx + 1}</span>
                                                    </div>

                                                    <p className="text-[15px] text-text-secondary group-hover:text-text-primary leading-relaxed mb-8 flex-1 transition-colors">
                                                        {reply}
                                                    </p>

                                                    <button
                                                        onClick={() => handleCopy(reply, uniqueId)}
                                                        className={clsx(
                                                            "w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                                                            copiedId === uniqueId
                                                                ? "bg-success text-black"
                                                                : "bg-surface border border-border-dim text-accent hover:bg-accent hover:text-black hover:border-accent"
                                                        )}
                                                    >
                                                        {copiedId === uniqueId ? <Check size={14} /> : <Copy size={14} />}
                                                        {copiedId === uniqueId ? "Copied" : "Copy to Clipboard"}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-12 pt-12 border-t border-border-dim/50 flex flex-col items-center gap-8">
                <div className="flex items-center gap-3 text-text-secondary">
                    <CheckCircle2 size={18} className="text-success" />
                    <span className="text-sm font-medium">All responses are successfully generated and ready for use.</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="btn-secondary min-w-[200px]"
                    >
                        <LayoutGrid size={18} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        onClick={handleFinish}
                        className="btn-primary min-w-[280px]"
                    >
                        <span>Reset Pipeline</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

import { CheckCircle2 } from "lucide-react";
