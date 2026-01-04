"use client";

import { motion } from "framer-motion";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface DebugPanelProps {
    raw: string;
    cleaned: string;
}

export default function DebugPanel({ raw, cleaned }: DebugPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-12">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-slate-300 hover:text-slate-500 transition-colors mx-auto uppercase text-[10px] font-black tracking-widest bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm"
            >
                <Terminal className="w-3 h-3" />
                {isOpen ? "Stow Sensitive Data" : "Inspect Raw Records"}
                {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 overflow-hidden"
                >
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Original Transmission</h4>
                        <pre className="bg-slate-50 p-8 rounded-[2rem] text-[10px] font-medium text-slate-400 overflow-auto max-h-[400px] border border-slate-100 custom-scrollbar leading-relaxed">
                            {raw}
                        </pre>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-4">Sanitized Records</h4>
                        <pre className="bg-white p-8 rounded-[2rem] text-[10px] font-medium text-indigo-600/60 overflow-auto max-h-[400px] border border-slate-100 shadow-inner custom-scrollbar leading-relaxed">
                            {cleaned}
                        </pre>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
