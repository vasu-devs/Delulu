"use client";

import { AnalysisResult, Transaction } from "../types";
import {
    MoreHorizontal, ListFilter,
    ChevronDown, ArrowDownLeft, Trash2, Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface SpendingBreakdownProps {
    analysis: AnalysisResult;
}

const CATEGORY_ASSETS: Record<string, string> = {
    Food: "/assets/rupee-roast/dumpster_fire.png", // Creative roast: Spicy food / Burned money
    Travel: "/assets/rupee-roast/rocket.png",
    Shopping: "/assets/rupee-roast/sticker_crying_wallet.png",
    Other: "/assets/rupee-roast/logo.png", // Fallback to Piggy
};

export default function SpendingBreakdown({ analysis }: SpendingBreakdownProps) {
    const [showAllTransactions, setShowAllTransactions] = useState(false);

    const debits = analysis.transactions.filter(t => t.transaction_type === "DEBIT");
    const credits = analysis.transactions.filter(t => t.transaction_type === "CREDIT");

    const totalSpent = debits.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalReceived = credits.reduce((sum, t) => sum + (t.amount || 0), 0);

    const grouped = debits.reduce((acc, t) => {
        const cat = t.category;
        if (!acc[cat]) acc[cat] = { transactions: [], total: 0 };
        acc[cat].transactions.push(t);
        acc[cat].total += (t.amount || 0);
        return acc;
    }, {} as Record<string, { transactions: Transaction[]; total: number }>);

    const sortedCategories = Object.entries(grouped).sort((a, b) => b[1].total - a[1].total);

    return (
        <div className="space-y-12">
            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 brutalist-card p-8 flex flex-col justify-between border-2 shadow-brutalist bg-white">
                    <div>
                        <span className="font-mono font-bold text-[10px] block mb-4 text-black/40 tracking-widest uppercase">Total Damage</span>
                        <div className="flex items-baseline gap-4 tabular font-black text-5xl md:text-6xl text-black tracking-tight">
                            <span>₹{totalSpent.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="mt-8">
                        <p className="font-mono font-bold text-[9px] text-black/30 mb-2 uppercase tracking-widest">Chaos Level</p>
                        <div className="h-4 w-full bg-black/5 border border-black rounded-none overflow-hidden p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "92%" }}
                                className="h-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-end px-2"
                            >
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="pink-card p-6 flex flex-col justify-between border-2 shadow-brutalist">
                    <span className="font-mono font-bold text-[10px] block mb-4 tracking-widest uppercase opacity-80">Inflow (Lucky)</span>
                    <p className="text-3xl font-black tabular">₹{totalReceived.toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-2">
                        <ArrowDownLeft className="w-4 h-4" />
                        <span className="font-mono font-bold text-[9px] uppercase">Bailout</span>
                    </div>
                </div>

                <div className="indigo-card !bg-black p-6 flex flex-col justify-between border-2 border-primary shadow-neon-lime">
                    <span className="font-mono font-bold text-[10px] block mb-4 text-primary tracking-widest uppercase opacity-80">Session Logs</span>
                    <p className="text-4xl font-black tabular text-primary">{analysis.transactions.length}</p>
                    <p className="font-mono font-bold text-[9px] text-primary/40 uppercase mt-2">Entries Audited</p>
                </div>
            </div>

            {/* Category HUD */}
            {sortedCategories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sortedCategories.slice(0, 3).map(([name, group], idx) => {
                        const iconPath = CATEGORY_ASSETS[name] || CATEGORY_ASSETS.Other;
                        return (
                            <motion.div
                                key={name}
                                whileHover={{ y: -4, scale: 1.01 }}
                                className="brutalist-card bg-zinc-50 p-6 flex border-2 shadow-brutalist relative overflow-hidden group"
                            >
                                <div className="flex-1 relative z-10">
                                    <div className="w-12 h-12 mb-6 opacity-80 grayscale group-hover:grayscale-0 transition-all">
                                        <Image
                                            src={iconPath}
                                            alt={name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-contain pixel-antialiased"
                                        />
                                    </div>
                                    <h4 className="font-mono font-bold text-[10px] text-black/40 mb-2 uppercase tracking-widest">{name}</h4>
                                    <p className="text-2xl font-black tabular">₹{group.total.toLocaleString()}</p>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="font-arcade text-4xl text-black">#{idx + 1}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Receipt of Shame */}
            <div className="bg-white brutalist-card !p-0 overflow-hidden border-2 shadow-brutalist">
                <div className="p-8 border-b-2 border-black bg-white flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black shadow-sm">
                            <ListFilter className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-arcade text-sm tracking-tight mb-1">RECEIPT OF SHAME</h3>
                            <span className="font-mono font-bold text-[9px] text-black/40 uppercase tracking-widest">Date: {new Date().toLocaleDateString()} {"// P-885"}</span>
                        </div>
                    </div>
                </div>

                <div className="receipt-edge h-4 w-full opacity-10" />

                <div className="p-6 space-y-2 relative bg-white">
                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-white" />

                    {analysis.transactions.map((t, i) => {
                        const iconPath = CATEGORY_ASSETS[t.category] || CATEGORY_ASSETS.Other;
                        const isCredit = t.transaction_type === "CREDIT";

                        return (
                            <div key={i} className="group/row relative">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="flex items-center justify-between p-4 border-b border-dashed border-black/10 hover:bg-zinc-50 transition-colors cursor-help"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-colors ${isCredit ? 'bg-primary' : 'bg-white group-hover/row:bg-white'}`}>
                                            <Image
                                                src={iconPath}
                                                alt={t.category}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 pixel-antialiased"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-mono font-bold text-sm tracking-tight text-black">{t.merchant.toUpperCase()}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="font-mono font-bold text-[9px] text-black/40 tracking-widest uppercase">{t.category}</span>
                                                <span className={`font-mono font-bold text-[9px] uppercase ${isCredit ? 'text-green-600' : 'text-secondary'}`}>[{t.transaction_type}]</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold tabular ${isCredit ? 'text-green-600' : 'text-black'}`}>
                                            {isCredit ? '+' : '-'}₹{t.amount?.toLocaleString()}
                                        </p>
                                        {t.is_impulsive && (
                                            <span className="font-mono font-bold text-[8px] bg-red-100 text-red-600 px-2 py-0.5 mt-1 inline-block rounded-sm">IMPULSIVE</span>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                <div className="receipt-edge h-4 w-full opacity-10 rotate-180" />

                <div className="p-8 bg-zinc-50 border-t-2 border-black text-center">
                    <p className="font-mono font-bold text-[10px] mb-4 text-black/30 uppercase tracking-[0.2em]">End of Transcript</p>
                    <div className="h-10 bg-black flex items-center justify-center border-2 shadow-brutalist mx-auto max-w-xs">
                        <p className="font-arcade text-white text-[10px] tracking-[0.2em] uppercase">Regret: ₹{Math.round(totalSpent * 0.3).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
