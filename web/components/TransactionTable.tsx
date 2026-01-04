import { AnalysisResult } from "../types";
import { motion } from "framer-motion";

export default function TransactionTable({ analysis }: { analysis: AnalysisResult }) {
    return (
        <div className="overflow-x-auto rounded-[1.5rem] border border-zinc-800 bg-black/40 backdrop-blur-md">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-zinc-800">
                        <th className="p-5 font-black text-zinc-500 uppercase tracking-widest text-[10px]">Merchant</th>
                        <th className="p-5 font-black text-zinc-500 uppercase tracking-widest text-[10px]">Category</th>
                        <th className="p-5 font-black text-zinc-500 uppercase tracking-widest text-[10px]">Amount</th>
                        <th className="p-5 font-black text-zinc-500 uppercase tracking-widest text-[10px] text-center">Impulsive</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                    {analysis.transactions.map((t, i) => (
                        <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={i}
                            className="hover:bg-zinc-800/30 transition-colors group"
                        >
                            <td className="p-5 text-zinc-300 font-medium group-hover:text-white transition-colors">
                                {t.merchant}
                            </td>
                            <td className="p-5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${t.category === 'Vice' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        t.category === 'Food' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                            'bg-zinc-800 text-zinc-400 border-zinc-700'
                                    }`}>
                                    {t.category}
                                </span>
                            </td>
                            <td className="p-5 text-zinc-100 font-bold tabular-nums">
                                ₹{t.amount.toLocaleString()}
                            </td>
                            <td className="p-5 text-center">
                                {t.is_impulsive ? (
                                    <span className="text-red-500 group-hover:animate-bounce inline-block">🔥</span>
                                ) : (
                                    <span className="text-emerald-500 opacity-30">✓</span>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
