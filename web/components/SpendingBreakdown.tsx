"use client";

import { AnalysisResult, Transaction } from "../types";
import { Utensils, CreditCard, ShoppingBag, Zap, MoreHorizontal, IndianRupee, Ghost, Flame, ListFilter, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

interface SpendingBreakdownProps {
    analysis: AnalysisResult;
}

export default function SpendingBreakdown({ analysis }: SpendingBreakdownProps) {
    const categories = {
        Food: { icon: Utensils, color: "text-emerald-500", bg: "bg-[#F0FDF4]", border: "border-emerald-100", label: "Mint Nutrition" },
        Subscription: { icon: CreditCard, color: "text-indigo-500", bg: "bg-[#F5F3FF]", border: "border-indigo-100", label: "Lavender Access" },
        Shopping: { icon: ShoppingBag, color: "text-rose-500", bg: "bg-[#FFF1F2]", border: "border-rose-100", label: "Rose Desires" },
        Bills: { icon: Zap, color: "text-amber-500", bg: "bg-[#FEFCE8]", border: "border-amber-100", label: "Lemon Utility" },
        Travel: { icon: Ghost, color: "text-sky-500", bg: "bg-[#F0F9FF]", border: "border-sky-100", label: "Sky Escape" },
        Vice: { icon: Flame, color: "text-orange-500", bg: "bg-[#FFF7ED]", border: "border-orange-100", label: "Peach Chaos" },
        Other: { icon: MoreHorizontal, color: "text-slate-500", bg: "bg-[#F8FAFC]", border: "border-slate-200", label: "Grey Area" },
    };

    const grouped = analysis.transactions.reduce((acc, t) => {
        const cat = t.category as keyof typeof categories;
        if (!acc[cat]) acc[cat] = { transactions: [], total: 0 };
        acc[cat].transactions.push(t);
        acc[cat].total += t.amount;
        return acc;
    }, {} as Record<string, { transactions: Transaction[]; total: number }>);

    return (
        <div className="space-y-20 mt-24">
            {/* Stationery Grid */}
            <div>
                <div className="flex items-center gap-4 mb-12 px-2">
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                        <ListFilter className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">Post-it Inventory</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Categorized indescressions</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {Object.entries(categories).map(([name, config], index) => {
                        const group = grouped[name] || { transactions: [], total: 0 };
                        if (group.transactions.length === 0 && name !== "Food") return null;

                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`${config.bg} border-2 ${config.border} rounded-[3.5rem] p-10 group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-700 relative overflow-hidden`}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`bg-white p-4 rounded-2xl shadow-sm border ${config.border} group-hover:rotate-12 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${config.color}`} />
                                    </div>
                                    <div className="bg-white/60 backdrop-blur-sm px-5 py-2 rounded-full border border-white text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                                        {group.transactions.length} Hits
                                    </div>
                                </div>

                                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${config.color} opacity-60`}>{config.label}</h4>
                                <div className="text-4xl font-black text-slate-900 flex items-baseline gap-2 mb-8">
                                    <span className="text-slate-200 text-xl font-bold">₹</span>
                                    {group.total.toLocaleString()}
                                </div>

                                <div className="space-y-4 max-h-[180px] overflow-y-auto pr-3 custom-scrollbar">
                                    {group.transactions.map((t, i) => (
                                        <div key={i} className="flex justify-between items-center text-[11px] border-b border-black/5 pb-4 last:border-0 hover:bg-white/40 rounded-xl px-3 -mx-3 transition-colors">
                                            <span className="text-slate-600 font-bold truncate max-w-[140px] uppercase tracking-tight">{t.merchant}</span>
                                            <span className="text-slate-900 font-black tabular-nums">₹{t.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* The Daily Journal Table */}
            <div className="bg-white border border-slate-100 rounded-[5rem] p-10 md:p-20 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
                    <div className="flex items-center gap-5">
                        <div className="bg-slate-900 p-4 rounded-[1.5rem] shadow-2xl rotate-3">
                            <ArrowDownRight className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-1">Stationery Journal</h3>
                            <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.6em]">The unedited manuscript</p>
                        </div>
                    </div>
                    <div className="bg-[#FAF9F6] px-10 py-6 rounded-[2.5rem] border border-slate-100 inline-flex items-center shadow-inner">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{analysis.transactions.length}</span>
                        <span className="text-slate-300 text-[10px] font-black uppercase ml-5 tracking-[0.4em]">Indexed Logs</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-5">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
                                <th className="px-10 pb-5">Memo Details</th>
                                <th className="px-10 pb-5">Tag</th>
                                <th className="px-10 pb-5 text-right">Debit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysis.transactions.map((t, i) => (
                                <tr key={i} className="group transition-all hover:scale-[1.01]">
                                    <td className="bg-[#FAF9F6]/80 backdrop-blur-sm px-10 py-8 rounded-l-[2rem] border-2 border-slate-50 border-r-0 shadow-sm">
                                        <span className="text-slate-900 font-black text-lg block mb-1 uppercase tracking-tight">{t.merchant}</span>
                                        <span className="text-slate-400 text-[11px] font-bold block truncate max-w-[380px] italic">"{t.original_text}"</span>
                                    </td>
                                    <td className="bg-[#FAF9F6]/80 backdrop-blur-sm px-10 py-8 border-2 border-slate-50 border-x-0 shadow-sm text-center">
                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black border-2 uppercase tracking-[0.2em] shadow-sm ${t.category === 'Vice' ? 'bg-orange-50 text-orange-400 border-orange-100' :
                                                t.category === 'Food' ? 'bg-emerald-50 text-emerald-400 border-emerald-100' :
                                                    t.category === 'Shopping' ? 'bg-rose-50 text-rose-400 border-rose-100' :
                                                        'bg-indigo-50 text-indigo-400 border-indigo-100'
                                            }`}>
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="bg-[#FAF9F6]/80 backdrop-blur-sm px-10 py-8 rounded-r-[2rem] border-2 border-slate-50 border-l-0 text-right shadow-sm">
                                        <span className="text-slate-950 font-black tabular-nums text-xl">₹{t.amount.toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
