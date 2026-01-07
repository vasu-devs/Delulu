"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Terminal, AlertTriangle, ShieldAlert, Activity, Fingerprint, Wallet } from "lucide-react";
import Image from "next/image";

interface RoastCardProps {
    roast: string;
}

export default function RoastCard({ roast }: RoastCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="brutalist-card !bg-[#FFFBEB] p-8 md:p-14 relative group overflow-hidden border-2 border-black shadow-brutalist w-full"
        >
            {/* Tactical Decal */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Fingerprint className="w-48 h-48 text-black" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0 flex flex-col items-center">
                    <div className="w-20 h-20 bg-secondary/10 rounded-full border-2 border-black flex items-center justify-center shadow-brutalist relative">
                        <ShieldAlert className="w-10 h-10 text-secondary" />
                    </div>
                    <div className="mt-8 text-center space-y-4">
                        <div className="flex flex-col items-center gap-1">
                            <span className="block font-mono font-bold text-[9px] text-zinc-400 uppercase tracking-[0.2em]">Forensic Audit</span>
                            <span className="block font-mono font-black text-[10px] text-black/20">#LOG_8829_PX</span>
                        </div>
                        <div className="px-5 py-2.5 bg-black border-2 border-black flex items-center gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full shadow-[0_0_8px_#EA580C]" />
                            <span className="font-mono font-black text-[10px] text-white uppercase tracking-widest">ACTIVE_SCAN</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-none text-zinc-900 overflow-hidden font-mono">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <p className="text-lg font-medium leading-loose text-zinc-800 mb-6 tracking-normal">{children}</p>,
                            strong: ({ children }) => <strong className="text-secondary font-bold underline decoration-2 underline-offset-4">{children}</strong>,
                            li: ({ children }) => (
                                <motion.li
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="text-base text-zinc-600 font-medium mb-3 flex gap-4 items-start before:content-['>'] before:text-primary before:font-black before:text-xs before:mt-1.5"
                                >
                                    {children}
                                </motion.li>
                            ),
                            ul: ({ children }) => <ul className="list-none p-0 my-6 space-y-2">{children}</ul>,
                            h2: ({ children }) => <h2 className="font-arcade text-sm text-secondary mt-8 mb-4 border-b border-zinc-200 pb-2 tracking-wide uppercase">{children}</h2>
                        }}
                    >
                        {roast}
                    </ReactMarkdown>
                </div>
            </div>

            <div className="mt-12 pt-6 border-t-2 border-black/5 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-[9px] text-black/30">ID: RUPEE_ROAST_S3</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-6 h-1.5 bg-primary/20" />
                    <div className="w-3 h-1.5 bg-primary/40" />
                    <div className="w-1.5 h-1.5 bg-primary" />
                </div>
            </div>

            {/* Visual Asset Integration */}
            <Image
                src="/assets/rupee-roast/sticker_crying_wallet.png"
                alt="Regret"
                width={100}
                height={100}
                className="w-24 h-24 -rotate-12"
            />
        </motion.div>
    );
}
