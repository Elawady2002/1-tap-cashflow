"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.push("/dashboard");
            }
        };
        checkSession();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            console.log("Attempting login for:", email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login error:", error);
                setError(error.message);
                setLoading(false);
            } else if (data.user) {
                // Use window.location.href for a hard redirect to ensure middleware picks up cookies
                window.location.href = "/dashboard";
            } else {
                setLoading(false);
            }
        } catch (err: any) {
            console.error("Unexpected login failure:", err);
            setError("An unexpected system error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-10 flex flex-col gap-8 border-[#141414] shadow-2xl">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-[#D4AF37] flex items-center justify-center rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                            <span className="font-bold text-black text-3xl brand-font">1</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="brand-font text-[28px] text-white leading-tight">1-Tap Cashflow</h1>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-black mt-1">Terminal Authentication</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 p-4 rounded-sm flex items-center gap-3 text-red-400 text-sm"
                            >
                                <ShieldAlert size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#475569] ml-1">Email Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="operator@onetapcashflow.ai"
                                    className="w-full bg-[#0A0A0A] border border-[#141414] focus:border-[#D4AF37]/40 py-4 pl-12 pr-4 text-white text-sm outline-hidden transition-all placeholder:text-[#2A2A2A]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#475569] ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569] group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-[#0A0A0A] border border-[#141414] focus:border-[#D4AF37]/40 py-4 pl-12 pr-12 text-white text-sm outline-hidden transition-all placeholder:text-[#2A2A2A]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#D4AF37] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="elite-btn w-full mt-2 group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? "Authorizing..." : (
                                    <>
                                        Log In
                                        <LogIn size={18} />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="flex flex-col items-center gap-4 border-t border-[#141414] pt-8">
                        <p className="text-[#475569] text-xs">New operator?</p>
                        <Link
                            href="/signup"
                            className="text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[9px] text-[#2A2A2A] uppercase tracking-[0.5em] font-black">
                        Encrypted Data Stream // 256-Bit SSL Active
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
