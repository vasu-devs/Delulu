"use client";

import { AnalysisResult, Transaction } from "../types";
import { Utensils, CreditCard, ShoppingBag, Zap, MoreHorizontal, IndianRupee, Ghost, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface SpendingBreakdownProps {
    analysis: AnalysisResult;
}

export default function SpendingBreakdown({ analysis }: SpendingBreakdownProps) {
    const categories = {
        Food: { icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
        Subscription: { icon: CreditCard, color: "text-blue-500", bg: "bg-blue-500/10" },
        Shopping: { icon: ShoppingBag, color: "text-pink-500", bg: "bg-pink-500/10" },
        Bills: { icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        Travel: { icon: Ghost, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        Vice: { icon: Flame, color: "text-red-500", bg: "bg-red-500/10" },
        Other: { icon: MoreHorizontal, color: "text-zinc-500", bg: "bg-zinc-500/10" },
    };

    const grouped = analysis.transactions.reduce((acc, t) => {
        const cat = t.category as keyof typeof categories;
        if (!acc[cat]) acc[cat] = { transactions: [], total: 0 };
        acc[cat].transactions.push(t);
        acc[cat].total += t.amount;
        return acc;
    }, {} as Record<string, { transactions: Transaction[]; total: number }>);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {Object.entries(categories).map(([name, config], index) => {
                const group = grouped[name] || { transactions: [], total: 0 };
                if (group.transactions.length === 0 && name !== "Food") return null;

                const Icon = config.icon;

                return (
                    <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-zinc-700 transition-colors"
                    >
                        <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700`}>
                            <Icon className="w-32 h-32" />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className={`${config.bg} p-3 rounded-2xl`}>
                                <Icon className={`w-6 h-6 ${config.color}`} />
                            </div>
                            <div>
                                <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{name} Empire</h4>
                                <div className="text-2xl font-black text-white flex items-baseline gap-1">
                                    <span className="text-zinc-500 text-sm font-normal">₹</span>
                                    {group.total.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {group.transactions.slice(0, 3).map((t, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-400 font-medium truncate max-w-[150px]">{t.merchant}</span>
                                    <span className="text-zinc-100 font-bold tabular-nums">₹{t.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            {group.transactions.length > 3 && (
                                <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pt-2">
                                    + {group.transactions.length - 3} more places ruining you
                                </div>
                            )}
                            {group.transactions.length === 0 && (
                                <div className="text-xs text-zinc-600 italic">No spending detected? Sus.</div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
