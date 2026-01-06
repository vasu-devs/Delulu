"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronDown } from "lucide-react";
import { useState } from "react";

interface DebugPanelProps {
    raw: unknown;
    cleaned: unknown;
}

export default function DebugPanel({ raw, cleaned }: DebugPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    const formatData = (data: unknown) => {
        if (typeof data === 'string') return data;
        if (!data) return "No data";
        return JSON.stringify(data, null, 2);
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-700">Debug Panel</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                            <div>
                                <h4 className="text-xs font-medium text-zinc-400 mb-2">Raw Input</h4>
                                <pre className="bg-zinc-50 p-3 rounded-lg text-xs text-zinc-500 overflow-auto max-h-[250px] border border-zinc-100">
                                    {formatData(raw)}
                                </pre>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-emerald-500 mb-2">Cleaned Output</h4>
                                <pre className="bg-emerald-50 p-3 rounded-lg text-xs text-emerald-600 overflow-auto max-h-[250px] border border-emerald-100">
                                    {formatData(cleaned)}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
