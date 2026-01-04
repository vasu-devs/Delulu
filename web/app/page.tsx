"use client";

import { useState } from "react";
import { Flame, AlertTriangle, Trash2, FileText, Upload, Wallet, IndianRupee, Ghost, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { cleanTransactionText } from "@/lib/cleaner";
import { calculateWealthProjection } from "@/lib/groq";
import { AnalysisResult } from "@/types";
import { processFinancialDataAction } from "./actions";

import FileUpload from "@/components/FileUpload";
import WealthChart from "@/components/WealthChart";
import RoastCard from "@/components/RoastCard";
import DebugPanel from "@/components/DebugPanel";
import TransactionTable from "@/components/TransactionTable";
import SpendingBreakdown from "@/components/SpendingBreakdown";

import { analyzeStatementAPI } from "@/lib/api";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [roast, setRoast] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"pdf" | "text">("pdf");

  // Debug states
  const [rawDump, setRawDump] = useState("");
  const [cleanedDump, setCleanedDump] = useState("");
  const [wealthData, setWealthData] = useState<any[]>([]);

  const handleAnalyze = async () => {
    if (activeTab === "pdf" && !file) return setError("Upload a statement first.");
    if (activeTab === "text" && !rawText.trim()) return setError("Input some data first.");

    setError("");
    setLoading(true);
    setAnalysis(null);
    setRoast("");

    try {
      let sourceText = "";

      if (activeTab === "pdf" && file) {
        sourceText = await extractTextFromPDF(file);
        setRawDump(sourceText);
        if (!sourceText.trim()) throw new Error("Could not read PDF.");
      } else {
        sourceText = rawText;
        setRawDump(sourceText);
      }

      // Step 2: Call FastAPI Backend (Production Architecture)
      // This now handles Cleaning, Extraction, and Roasting in one secure call
      const { analysis, roast, cleaned_text } = await analyzeStatementAPI(sourceText);

      setCleanedDump(cleaned_text);
      setAnalysis(analysis);
      setRoast(roast);

      // Step 3: Local Calculations for Wealth Projection
      const impulsiveTotal = analysis.transactions
        .filter((t: any) => t.is_impulsive)
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      const projection = calculateWealthProjection(impulsiveTotal);
      setWealthData(projection);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Backend sync failed. Connect the server!");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setAnalysis(null);
    setRoast("");
    setRawText("");
    setFile(null);
    setRawDump("");
    setCleanedDump("");
    setWealthData([]);
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Background Decor - Stationery Pastels */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-rose-50/40 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-20 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center lg:justify-start gap-4 mb-8"
          >
            <div className="bg-white p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-center">
              <Ghost className="w-8 h-8 text-indigo-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-extrabold uppercase tracking-[0.4em] text-[10px] leading-tight mb-1">
                Project Delulu
              </span>
              <span className="text-indigo-300 font-bold text-[10px] uppercase tracking-widest">Stationery Edition v1.5</span>
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900 font-serif">
            Financial <span className="text-indigo-400 underline decoration-indigo-100 decoration-8 underline-offset-8">Reality</span>.
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-semibold max-w-2xl leading-relaxed mx-auto lg:mx-0 tracking-tight">
            A gentle, paper-thin journal of your <span className="text-rose-400 font-black font-serif">Delulu</span> spending habits. 💌
          </p>
        </header>

        <div className="space-y-16">
          {/* Input Panel - The Memo Board */}
          <section className="bg-white border border-slate-100 p-8 md:p-14 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] relative overflow-hidden group max-w-4xl mx-auto w-full">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">
              <ShieldAlert className="w-80 h-80 text-indigo-200" />
            </div>

            <div className="flex bg-slate-50/80 p-2 rounded-[2rem] mb-12 border border-slate-100 max-w-sm mx-auto shadow-inner">
              <button
                onClick={() => setActiveTab("pdf")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-extrabold text-xs uppercase tracking-widest transition-all ${activeTab === "pdf" ? "bg-white text-indigo-500 shadow-md border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Upload className="w-4 h-4" /> Memo
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-extrabold text-xs uppercase tracking-widest transition-all ${activeTab === "text" ? "bg-white text-indigo-500 shadow-md border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
              >
                <FileText className="w-4 h-4" /> Script
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "pdf" ? (
                <motion.div
                  key="pdf-input"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#FAF9F6] p-1.5 rounded-[3rem] border border-slate-100 shadow-inner"
                >
                  <FileUpload onFileSelect={(f: File | null) => setFile(f)} />
                </motion.div>
              ) : (
                <motion.div
                  key="text-input"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <textarea
                    placeholder="Softly record your financial indiscretions here..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full h-80 p-10 rounded-[3rem] bg-[#FAF9F6] border border-slate-100 text-slate-700 placeholder:text-slate-300 focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-100 transition-all outline-none resize-none font-bold text-lg leading-relaxed shadow-inner"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-12 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-7 rounded-[2.5rem] transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(99,102,241,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(99,102,241,0.4)]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Drafting Reality...</span>
                </>
              ) : (
                <>Analyze Memo ✨</>
              )}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-8 rounded-[2rem] bg-rose-50/50 border border-rose-100 flex items-center gap-5 shadow-sm"
              >
                <AlertTriangle className="w-8 h-8 text-rose-300 shrink-0" />
                <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.1em] leading-loose">{error}</p>
              </motion.div>
            )}
          </section>

          {/* Results Panel - The Published Report */}
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-16"
              >
                {/* The Mindful Memo */}
                <div className="max-w-4xl mx-auto">
                  <RoastCard roast={roast} />
                </div>

                {/* Growth Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white border border-slate-100 p-12 rounded-[3.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.04] text-indigo-500 group-hover:scale-110 transition-transform duration-700">
                      <Wallet className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-slate-400">
                      <Wallet className="w-5 h-5 text-indigo-200" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Joy Investment</span>
                    </div>
                    <div className="text-6xl font-black text-slate-900 flex items-baseline gap-2">
                      <span className="text-indigo-100 text-3xl font-bold tracking-tighter">₹</span>
                      {analysis.transactions.filter(t => t.is_impulsive).reduce((s, t) => s + t.amount, 0).toLocaleString()}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white border border-slate-100 p-12 rounded-[3.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.04] text-[#5EC299] group-hover:scale-110 transition-transform duration-700">
                      <IndianRupee className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-slate-400">
                      <IndianRupee className="w-5 h-5 text-[#A7F3D0]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Mindfulness Score</span>
                    </div>
                    <div className="text-6xl font-black text-[#5EC299] tracking-tighter">
                      {analysis.financial_health_score}<span className="text-slate-200 text-2xl font-bold ml-1">/100</span>
                    </div>
                  </motion.div>
                </div>

                <SpendingBreakdown analysis={analysis} />

                {/* Strategic Vision */}
                <div className="space-y-10 pt-16 border-t border-slate-100">
                  <div className="text-center md:text-left px-4">
                    <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Strategic Vision</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mt-3">The soft path of intentional growth</p>
                  </div>
                  <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.02)]">
                    <WealthChart data={wealthData} />
                  </div>
                </div>

                <div className="pt-16 border-t border-slate-100">
                  <DebugPanel raw={rawDump} cleaned={cleanedDump} />
                </div>

                <button
                  onClick={clear}
                  className="flex items-center gap-3 text-slate-200 hover:text-indigo-300 transition-all hover:tracking-[0.8em] duration-500 mx-auto font-black uppercase text-[10px] tracking-[0.6em] py-16"
                >
                  <Trash2 className="w-4 h-4" /> Shred These Pages
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[550px] flex flex-col items-center justify-center text-center p-16 border-[4px] border-dashed border-[#F1F5F9]/80 rounded-[5rem] bg-white/40"
              >
                <div className="bg-white p-12 rounded-[2.5rem] mb-10 shadow-sm border border-slate-100">
                  <Flame className="w-20 h-20 text-rose-50 animate-pulse" />
                </div>
                <h3 className="text-5xl font-black text-[#E2E8F0] uppercase tracking-tighter italic leading-none">Mindful Entry</h3>
                <p className="text-slate-300 mt-8 max-w-sm font-black uppercase tracking-[0.3em] text-[10px] leading-[2.5]">
                  Place your statement on the desk and let us begin the soft deconstruction...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
