"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, ArrowLeft, Copy, RefreshCcw, Check, Sparkles, Send, BrainCircuit } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

export default function GeneratePage() {
    const { selectedPosts, affiliateLink, resetSession } = useSearch();
    const [replies, setReplies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [currentPosts, setCurrentPosts] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        let targetPosts: any[] = selectedPosts;
        let targetLink = affiliateLink;

        // Elite Demo Mode: Automatic fallback
        if (selectedPosts.length === 0) {
            targetPosts = [
                { id: "demo-1", platform: "Reddit", text: "What really separates the top 1% of SaaS founders from the rest?", engagement: "450 Upvotes", score: 95, url: "#" },
                { id: "demo-2", platform: "YouTube", text: "The unspoken truth about scaling your agency to $50k/mo.", engagement: "12K Views", score: 98, url: "#" }
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
        generate(currentPosts, affiliateLink || "https://onetapcashflow.ai");
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
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-16 py-10"
        >
            <header className="flex items-end justify-between border-b border-[#141414] pb-10">
                <div className="flex flex-col gap-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[#475569] hover:text-[#D4AF37] transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        <ArrowLeft size={14} /> Pipeline Review
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center rounded-sm">
                            <BrainCircuit size={32} className="text-[#D4AF37]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[48px] text-white leading-tight">Neural Hub</h1>
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#D4AF37]">Tactical Writing Output</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#475569]">Context Consistency: 98%</span>
                    <button
                        onClick={handleRegenerate}
                        disabled={loading}
                        className="elite-btn-outline"
                    >
                        <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                        Regenerate Pipeline
                    </button>
                </div>
            </header>

            <div className="flex flex-col gap-12">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-40 text-center flex flex-col items-center gap-8 glass-card border-dashed border-[#141414]"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 border-2 border-[#141414] border-t-[#D4AF37] rounded-full animate-spin"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Sparkles size={24} className="text-[#D4AF37]" /></div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[#D4AF37] text-[12px] uppercase tracking-[0.4em] font-black glow-text">Synthesizing Human Intent</p>
                                <p className="text-[#475569] text-[11px] font-medium tracking-widest uppercase">Analyzing conversation dynamics...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-16">
                            {replies.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="glass-card p-0! overflow-hidden border-[#141414]"
                                >
                                    <div className="p-10 bg-black/40 border-b border-[#141414] relative">
                                        <div className="absolute top-0 right-0 p-8 opacity-10"><MessageSquare size={64} /></div>
                                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#475569] mb-6 block">Sourced Discussion Content</span>
                                        <p className="text-[#FFFFFF] text-[18px] leading-relaxed font-medium italic border-l-4 border-[#D4AF37] pl-8 max-w-4xl">
                                            "{item.text}"
                                        </p>
                                    </div>

                                    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#070707]">
                                        {item.replies.map((reply: string, rIdx: number) => {
                                            const uniqueId = `${item.id}-${rIdx}`;
                                            const labels = ["Concise Direct", "Strategic Value", "Curiosity Drive"];
                                            return (
                                                <div key={rIdx} className="flex flex-col bg-black border border-[#141414] p-8 hover:border-[#D4AF37]/30 transition-all group relative">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">{labels[rIdx]}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black text-[#475569] uppercase tracking-tighter">Variant 0{rIdx + 1}</span>
                                                    </div>

                                                    <p className="text-[15px] text-[#94A3B8] group-hover:text-white leading-relaxed mb-10 flex-1 transition-all">
                                                        {reply}
                                                    </p>

                                                    <button
                                                        onClick={() => handleCopy(reply, uniqueId)}
                                                        className={clsx(
                                                            "flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                                            copiedId === uniqueId
                                                                ? "bg-[#10B981] text-black"
                                                                : "bg-[#0A0A0A] border border-[#141414] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                                                        )}
                                                    >
                                                        {copiedId === uniqueId ? <Check size={14} /> : <Copy size={14} />}
                                                        {copiedId === uniqueId ? "Vector Copied" : "Copy Payload"}
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

            <div className="border-t border-[#141414] pt-20 flex flex-col items-center gap-8">
                <div className="flex items-center gap-3 text-[#475569] text-[12px] font-medium">
                    <Send size={16} />
                    <span>Mission accomplished. All responses generated with Elite precision.</span>
                </div>
                <button
                    onClick={handleFinish}
                    className="elite-btn min-w-[360px]"
                >
                    Flush Session & Reset Pipeline
                </button>
            </div>
        </motion.div>
    );
}
