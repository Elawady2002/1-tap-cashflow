import React from 'react';
import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export function GlobalPromotionBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full pt-4 pb-4 -mt-4 group mb-6"
        >
            <div className="relative overflow-hidden rounded-xl bg-[#0cbda0] p-6 lg:p-7 shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10 w-full max-w-5xl">
                    {/* Icon section */}
                    <div className="hidden md:flex relative shrink-0">
                        <Smartphone size={56} className="text-white" strokeWidth={1.5} />
                        <div className="absolute -right-2 top-2 bg-[#0cbda0] rounded-full p-0.5">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFBA00" stroke="#FFBA00" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v8" stroke="black" fill="none"></path>
                                <path d="M14.5 9.5a2.5 2.5 0 0 0-5 0c0 4 5 1 5 5a2.5 2.5 0 0 1-5 0" stroke="black" fill="none"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col gap-3 flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Want To Multiply Your Earnings To $1,000 - $5,000 A Day?
                        </h2>
                        <div className="text-white/95 text-[15px] space-y-1.5 leading-relaxed font-medium">
                            <p>
                                1-Tap Cashflow is powerful, but if you want to scale to truly life-changing income, you need to watch this training which shows how to automate your entire workflow. And guess what?
                            </p>
                            <p>
                                This training is free for all 1-Tap Cashflow members. So, if you want to unlock your full potential, just tap the yellow button below.
                            </p>
                        </div>

                        <div className="mt-2">
                            <button
                                onClick={() => window.open("https://freedomescapexcelerator.com/5k-per-day", "_blank")}
                                className="bg-[#FFBA00] hover:bg-[#e6a800] transition-colors text-black font-bold whitespace-nowrap px-6 py-2.5 rounded-md shadow-sm text-sm sm:text-[15px]"
                            >
                                Click Here To Learn How
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
