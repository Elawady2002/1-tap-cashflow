"use client";

import { motion } from "framer-motion";
import { Play, Clock, ChevronRight, GraduationCap, Sparkles, Youtube, BookOpen } from "lucide-react";

const VIDEOS = [
    {
        id: "v1",
        title: "Mastering the Neural Hub",
        description: "Learn how to use tactical writing output to maximize engagement and conversion rates.",
        duration: "03:45",
        category: "Basics",
        thumbnail: "https://images.unsplash.com/photo-1639322537228-ad7155463fb2?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "v2",
        title: "Keyword Vector Analysis",
        description: "A deep dive into using Ad Analysis to find the most profitable social discussion vectors.",
        duration: "05:20",
        category: "Strategy",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda546697a?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "v3",
        title: "Closing the Discovery Loop",
        description: "How to automate your workflow from niche discovery to lead generation using 1-Tap Cashflow.",
        duration: "04:15",
        category: "Advanced",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "v4",
        title: "Winning the Jackpots",
        description: "Identifying high-intent discussions on Reddit and YouTube that are ready for pitching.",
        duration: "02:50",
        category: "Winning",
        thumbnail: "https://images.unsplash.com/photo-1611974714652-320d368d18b4?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "v5",
        title: "Elite Pipeline Integration",
        description: "Best practices for integrating 1-Tap Cashflow AI outputs into your existing CRM and sales flow.",
        duration: "06:10",
        category: "Enterprise",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "v6",
        title: "Social Arbitrage Secret",
        description: "Advanced tactical guide on finding low-competition, high-value discussion threads.",
        duration: "04:30",
        category: "Strategy",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop"
    }
];

export default function TrainingPage() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-16 py-10"
        >
            <header className="flex items-end justify-between border-b border-[#141414] pb-10">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center rounded-sm">
                            <GraduationCap size={32} className="text-[#D4AF37]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[48px] text-white leading-tight">Academy</h1>
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#D4AF37]">Tactical Training Center</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 bg-(--gold-tint-10) px-3 py-1 border border-(--gold-primary)/20 rounded-sm">
                        <Sparkles size={12} className="text-[#D4AF37]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Premium Access</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {VIDEOS.map((video, idx) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-0! overflow-hidden group border-[#141414] hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                    >
                        {/* Video Thumbnail Area */}
                        <div className="relative aspect-video overflow-hidden border-b border-[#141414]">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all"
                                >
                                    <Play size={20} className="text-white fill-white ml-1 group-hover:text-black group-hover:fill-black transition-colors" />
                                </motion.div>
                            </div>

                            {/* Info Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-black/60 backdrop-blur-md px-2 py-1 text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                                    {video.category}
                                </span>
                            </div>

                            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-2 py-1 rounded-xs flex items-center gap-1.5 border border-white/5">
                                <Clock size={10} className="text-[#D4AF37]" />
                                <span className="text-[10px] font-bold text-white">{video.duration}</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex flex-col gap-4">
                            <h3 className="text-[18px] font-bold text-white group-hover:text-[#D4AF37] transition-colors">{video.title}</h3>
                            <p className="text-[13px] text-[#94A3B8] leading-relaxed line-clamp-2">
                                {video.description}
                            </p>

                            <div className="mt-4 pt-6 border-t border-[#141414] flex items-center justify-between group-hover:border-[#D4AF37]/10 transition-colors">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569] group-hover:text-[#D4AF37] transition-colors">Tactical Overview</span>
                                <ChevronRight size={14} className="text-[#475569] group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Support/Extra Section */}
            <div className="glass-card p-12 bg-linear-to-r from-[#0D0D0D] to-[#050505] border-[#141414] mt-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                            <BookOpen size={32} className="text-[#D4AF37]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[24px] font-bold text-white tracking-tight">Need specific guidance?</h2>
                            <p className="text-[#94A3B8] text-[15px] max-w-lg leading-relaxed">
                                Our tactical documentation library covers every feature in detail. Read the official 1-Tap Cashflow playbook.
                            </p>
                        </div>
                    </div>
                    <button className="elite-btn-outline whitespace-nowrap px-10">
                        Access Documentation
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
