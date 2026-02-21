"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Hash, Link as LinkIcon, MessageSquare, Target, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";

export default function JackpotsPage() {
    const { results, selectedPosts, setSelectedPosts, selectedKeyword, affiliateLink, setAffiliateLink, setReplies } = useSearch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const togglePost = (post: any) => {
        if (selectedPosts.find(p => p.id === post.id)) {
            setSelectedPosts(selectedPosts.filter(p => p.id !== post.id));
        } else {
            setSelectedPosts([...selectedPosts, post]);
        }
    };

    const handleSelectAll = () => {
        if (selectedPosts.length === results.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts([...results]);
        }
    };

    const handleContinue = async () => {
        if (selectedPosts.length === 0) return;
        setLoading(true);
        try {
            const resp = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({
                    results: selectedPosts,
                    affiliateLink
                })
            });
            const data = await resp.json();
            setReplies(data.replies || []);
            router.push("/generate");
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
                    <h1 className="text-4xl text-text-primary">Targeted Discussions</h1>
                    <p className="subtitle">
                        Identified <span className="text-text-primary font-bold">{results.length} high-value threads</span> for <span className="text-text-primary font-bold">"{selectedKeyword}"</span>.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Affiliate Link Config */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="card-base bg-brand-tint border-accent/10 flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <Target size={18} className="text-accent" />
                            <h3 className="text-lg font-bold text-text-primary">Engagement Link</h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            This link will be naturally woven into the generated responses where appropriate.
                        </p>
                        <div className="relative group">
                            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent" />
                            <input
                                type="text"
                                placeholder="https://your-link.com"
                                className="input-base w-full pl-10 text-sm"
                                value={affiliateLink}
                                onChange={(e) => setAffiliateLink(e.target.value)}
                            />
                        </div>
                        {affiliateLink && (
                            <div className="flex items-center gap-2 text-success text-[10px] font-bold uppercase tracking-wider">
                                <CheckCircle2 size={12} />
                                <span>Link Configured</span>
                            </div>
                        )}
                    </div>

                    <div className="card-base flex flex-col gap-4 border-dashed border-border-dim">
                        <div className="flex items-center gap-2 text-text-muted">
                            <AlertCircle size={16} />
                            <h4 className="text-sm font-bold">Selection Rule</h4>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                            Select at least 1 discussion to proceed. Focus on threads that align with your product's unique selling points.
                        </p>
                    </div>
                </div>

                {/* Discussions Table */}
                <div className="lg:col-span-3 card-base overflow-hidden p-0!">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface border-b border-border-dim/50">
                                    <th className="px-6 py-4 w-12">
                                        <button
                                            onClick={handleSelectAll}
                                            className={clsx(
                                                "w-5 h-5 rounded border flex items-center justify-center transition-all",
                                                selectedPosts.length === results.length && results.length > 0
                                                    ? "bg-accent border-accent text-black"
                                                    : "bg-page border-border-dim hover:border-accent/50"
                                            )}
                                        >
                                            {selectedPosts.length === results.length && results.length > 0 && <CheckCircle2 size={14} className="fill-current" />}
                                        </button>
                                    </th>
                                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Platform</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Discussion Content</th>
                                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest w-32">Index</th>
                                    <th className="px-6 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-dim/30">
                                {results.length > 0 ? results.map((r) => {
                                    const isSelected = !!selectedPosts.find(p => p.id === r.id);
                                    return (
                                        <tr
                                            key={r.id}
                                            className={clsx(
                                                "hover:bg-brand-tint/30 transition-colors cursor-pointer group",
                                                isSelected && "bg-brand-tint/50"
                                            )}
                                            onClick={() => togglePost(r)}
                                        >
                                            <td className="px-6 py-4">
                                                <div
                                                    className={clsx(
                                                        "w-5 h-5 rounded border flex items-center justify-center transition-all",
                                                        isSelected
                                                            ? "bg-accent border-accent text-black"
                                                            : "bg-surface border-border-dim group-hover:border-accent/50"
                                                    )}
                                                >
                                                    {isSelected && <CheckCircle2 size={14} className="fill-current" />}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className={clsx(
                                                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border",
                                                    r.platform === 'Reddit' ? "text-orange-400 border-orange-400/20 bg-orange-400/5" : "text-red-500 border-red-500/20 bg-red-500/5"
                                                )}>
                                                    {r.platform}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-medium">
                                                <p className="text-text-primary text-[15px] leading-relaxed line-clamp-2">{r.text || r.title}</p>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-xs text-text-muted font-mono">#{r.id}</span>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <a
                                                    href={r.url}
                                                    target="_blank"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <p className="text-text-muted">No discussions found. Please try a different keyword expansion.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center bg-surface border border-border-dim rounded-2xl p-8 gap-6 shadow-gold">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Active Selections</span>
                    <span className="text-text-primary font-bold text-xl">{selectedPosts.length} Threads Ready</span>
                </div>
                <button
                    onClick={handleContinue}
                    disabled={loading || selectedPosts.length === 0}
                    className="btn-primary min-w-[320px] h-14"
                >
                    {loading ? "Generating Replies..." : "Generate AI Responses"}
                    <ArrowRight size={20} />
                </button>
            </div>
        </motion.div>
    );
}
