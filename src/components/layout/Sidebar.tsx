"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Radar, Activity, Trophy, MessageSquare, ShieldCheck, LogOut, ChevronRight, GraduationCap, Briefcase, Zap, Cpu, Target } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const STEPS = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { path: "/radar", label: "Ad Radar", icon: Radar },
    { path: "/analysis", label: "Ad Analysis", icon: Activity },
    { path: "/jackpots", label: "Find Jackpots", icon: Trophy },
    { path: "/generate", label: "Generate Replies", icon: MessageSquare },
    { path: "/training", label: "Training", icon: GraduationCap },
];

const UPGRADES = [
    { path: "/dfy", label: "Done-For-You", icon: Briefcase },
    { path: "/instant", label: "Instant Income", icon: Zap },
    { path: "/autopilot", label: "Autopilot", icon: Cpu },
];

export function Sidebar() {
    const pathname = usePathname();
    const { resetSession } = useSearch();
    const currentIndex = STEPS.findIndex(s => s.path === pathname);
    const progress = ((currentIndex + 1) / STEPS.length) * 100;

    return (
        <aside className="w-72 bg-[#050505] border-r border-[#141414] flex flex-col relative shrink-0 h-screen overflow-hidden">
            {/* Dynamic Progress Line */}
            <div className="absolute left-0 top-0 w-0.5 h-full bg-[#141414] z-0">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${progress}%` }}
                    className="w-full bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    transition={{ duration: 1, ease: "circOut" }}
                />
            </div>

            <div className="flex flex-col p-6 gap-10 relative z-10 h-full">
                <Link href="/dashboard" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-accent flex items-center justify-center rounded-lg shadow-gold">
                        <Target size={22} className="text-black" />
                    </div>
                    <div className="flex flex-col">
                        <span className="brand-font text-[22px] text-text-primary tracking-tight leading-none">1-Tap Cashflow</span>
                        <span className="text-[10px] font-bold text-text-muted mt-1">Platform Identity</span>
                    </div>
                </Link>

                {/* Command Navigation */}
                <nav className="flex flex-col gap-2 w-full flex-1 overflow-y-auto no-scrollbar pb-10">
                    <div className="flex flex-col gap-2 mb-10">
                        <span className="text-[10px] font-black tracking-[0.3em] text-[#475569] uppercase px-5 mb-2">Core Hub</span>
                        {STEPS.map((step, index) => {
                            const isActive = pathname === step.path;
                            const Icon = step.icon;

                            return (
                                <Link
                                    key={step.path}
                                    href={step.path}
                                    className={clsx(
                                        "command-nav-link group py-4 whitespace-nowrap",
                                        isActive && "active"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <Icon size={18} className={clsx(isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary")} />
                                        <span className="brand-font tracking-wide text-sm font-medium">{step.label}</span>
                                    </div>
                                    {isActive && <ChevronRight size={14} className="text-accent ml-auto" />}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold tracking-widest text-[#475569] uppercase px-5 mb-2">Premium Tools</span>
                        {UPGRADES.map((step, index) => {
                            const isActive = pathname === step.path;
                            const Icon = step.icon;

                            return (
                                <Link
                                    key={step.path}
                                    href={step.path}
                                    className={clsx(
                                        "command-nav-link group py-4 transition-all duration-300 whitespace-nowrap",
                                        isActive ? "text-accent bg-accent/5" : "text-text-muted hover:bg-accent/5"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <Icon size={18} className={clsx(isActive ? "text-accent" : "text-text-muted group-hover:text-accent")} />
                                        <span className={clsx("brand-font tracking-wide text-sm transition-colors font-medium", isActive ? "text-accent" : "group-hover:text-accent")}>{step.label}</span>
                                    </div>
                                    {isActive && <ChevronRight size={14} className="text-accent ml-auto" />}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex flex-col gap-2 mt-auto pt-10">
                        <button
                            onClick={resetSession}
                            className="command-nav-link group py-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 mt-auto transition-all duration-300 whitespace-nowrap"
                        >
                            <div className="flex items-center gap-4">
                                <LogOut size={18} />
                                <span className="brand-font tracking-wide text-sm font-medium">Logout</span>
                            </div>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
