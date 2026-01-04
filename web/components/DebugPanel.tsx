"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DebugPanelProps {
    raw: string;
    cleaned: string;
}

export default function DebugPanel({ raw, cleaned }: DebugPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-zinc-800 rounded-2xl overflow-hidden mt-12 bg-zinc-950">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900 transition-colors"
            >
                <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-widest font-bold">
                    <Terminal className="w-4 h-4" />
                    <span>Data Engineering Logs (Raw vs Cleaned)</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t border-zinc-800">
                            <div>
                                <span className="text-[10px] text-zinc-600 font-black uppercase mb-2 block">Raw PDF Dump</span>
                                <pre className="bg-black/50 p-4 rounded-xl text-[10px] text-zinc-500 font-mono h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed outline-none">
                                    {raw || "No raw data available"}
                                </pre>
                            </div>
                            <div>
                                <span className="text-[10px] text-emerald-900 font-black uppercase mb-2 block">Cleaned Extraction</span>
                                <pre className="bg-emerald-950/20 p-4 rounded-xl text-[10px] text-emerald-600 font-mono h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-emerald-900/10">
                                    {cleaned || "No cleaned data available"}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
