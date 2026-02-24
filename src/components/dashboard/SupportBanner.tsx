"use client";

import { motion } from "framer-motion";
import { Headphones } from "lucide-react";

export function SupportBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-4 rounded-[14px] border border-white/5 bg-[#090b0f] transition-all duration-300 w-full mt-8 shrink-0"
        >
            <div className="flex items-center gap-5">
                <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 border border-[#00e5ff]/30 bg-[#00e5ff]/5">
                    <Headphones size={24} strokeWidth={1.5} className="text-[#00e5ff]" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-[17px] font-bold text-white tracking-tight">Need Help?</h3>
                    <p className="text-[#848795] text-[14px]">
                        Our support team is here to assist you 24/7
                    </p>
                </div>
            </div>

            <button className="bg-[#00e5ff] hover:bg-[#00cfec] transition-colors rounded-full h-[42px] px-7 whitespace-nowrap text-black font-bold text-[14px]">
                Contact Support
            </button>
        </motion.div>
    );
}
