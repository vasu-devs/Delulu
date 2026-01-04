"use client";

import { motion } from "framer-motion";
import { Flame, Quote } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface RoastCardProps {
    roast: string;
}

export default function RoastCard({ roast }: RoastCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                <Flame className="w-48 h-48 text-red-500" />
            </div>

            <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500/10 p-2 rounded-lg">
                    <Flame className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">The Psycho-Analyzer</span>
            </div>

            <div className="relative z-10">
                <Quote className="w-8 h-8 text-zinc-800 absolute -top-4 -left-4 -z-10" />
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <p className="text-xl md:text-2xl font-black italic tracking-tight leading-relaxed text-white mb-4">{children}</p>,
                            ul: ({ children }) => <ul className="space-y-2 mb-6 ml-4 list-disc text-zinc-400 font-medium">{children}</ul>,
                            li: ({ children }) => <li className="text-sm border-l-2 border-red-500/30 pl-4">{children}</li>,
                            strong: ({ children }) => <strong className="text-red-500 font-black">{children}</strong>,
                            h3: ({ children }) => <h3 className="text-lg font-black uppercase tracking-widest text-zinc-500 mt-8 mb-4 border-b border-zinc-800 pb-2">{children}</h3>
                        }}
                    >
                        {roast}
                    </ReactMarkdown>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700 bg-black/50 px-4 py-2 rounded-full border border-zinc-800">
                    Emotional Damage Level: CRITICAL
                </div>
            </div>
        </motion.div>
    );
}
