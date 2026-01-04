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
            className="bg-[#F5F3FF] border border-[#E0E7FF] p-12 md:p-16 rounded-[4rem] shadow-[0_20px_80px_-20px_rgba(99,102,241,0.08)] relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-12 opacity-[0.08] -rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">
                <Flame className="w-56 h-56 text-indigo-400" />
            </div>

            <div className="flex items-center justify-between mb-12 font-sans">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-indigo-100">
                        <Flame className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-indigo-300 block mb-1">Stationery Memo</span>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">The Psycho-Analysis</span>
                    </div>
                </div>
                <div className="hidden md:block bg-indigo-100/30 px-6 py-3 rounded-2xl border border-indigo-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">Class: Highly Urgent</span>
                </div>
            </div>

            <div className="relative z-10">
                <Quote className="w-12 h-12 text-indigo-100/50 absolute -top-8 -left-8 -z-10" />
                <div className="prose prose-slate prose-xl max-w-none">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <p className="text-3xl md:text-5xl font-black font-serif leading-[1.05] text-slate-900 mb-8 tracking-tighter">{children}</p>,
                            ul: ({ children }) => <ul className="space-y-6 mb-10 ml-2 text-slate-600 font-bold font-sans">{children}</ul>,
                            li: ({ children }) => <li className="text-lg border-l-[4px] border-indigo-100 pl-8 py-2 leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="text-indigo-500 font-black px-2 py-1 bg-white rounded-lg shadow-sm font-sans">{children}</strong>,
                            h3: ({ children }) => <h3 className="text-xl font-extrabold uppercase tracking-[0.2em] text-slate-400 mt-16 mb-8 border-b-2 border-slate-100 pb-4 font-sans">{children}</h3>
                        }}
                    >
                        {roast}
                    </ReactMarkdown>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-indigo-100/50 flex items-center justify-between">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">
                    Internal Document: 00-DEL-99
                </div>
                <div className="bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(99,102,241,0.3)]">
                    Audit: Critical
                </div>
            </div>
        </motion.div>
    );
}
