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
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-20 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center lg:justify-start gap-4 mb-6"
          >
            <div className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700 shadow-xl">
              <Ghost className="w-8 h-8 text-white" />
            </div>
            <span className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
              Project Delulu v1.0
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent italic">
            Financial <span className="text-red-500 underline decoration-red-900/50">Reality</span> Check.
          </h1>
          <p className="text-xl text-zinc-500 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Stop being <span className="text-zinc-300 font-bold italic">Delulu</span>. Let AI analyze your messy bank statements and remind you that you're not the next Ambani. Yet.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <ShieldAlert className="w-64 h-64" />
              </div>

              <div className="flex bg-black p-1.5 rounded-2xl mb-8 border border-zinc-800">
                <button
                  onClick={() => setActiveTab("pdf")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "pdf" ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  <Upload className="w-4 h-4" /> Statement
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "text" ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-600 hover:text-zinc-400"}`}
                >
                  <FileText className="w-4 h-4" /> Text
                </button>
              </div>

              <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                  {activeTab === "pdf" ? (
                    <motion.div
                      key="pdf-input"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <div className="bg-zinc-950 p-1 rounded-[2rem] border border-zinc-800/50">
                        <FileUpload onFileSelect={(f: File | null) => setFile(f)} />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text-input"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <textarea
                        placeholder="Paste raw bank statement text here..."
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        className="w-full h-64 p-6 rounded-[2rem] bg-zinc-950 border border-zinc-800 text-zinc-300 placeholder:text-zinc-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all outline-none resize-none font-mono text-sm leading-relaxed"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-8 bg-white hover:bg-zinc-200 text-black font-black py-5 rounded-[1.5rem] transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>Extract Reality 🔥</>
                )}
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-red-500 text-xs font-bold leading-relaxed">{error}</p>
                </motion.div>
              )}
            </section>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10"
                >
                  <RoastCard roast={roast} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2 text-zinc-500">
                        <Wallet className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Wasted on 'Treats'</span>
                      </div>
                      <div className="text-4xl font-black text-white flex items-baseline gap-2">
                        <span className="text-zinc-500 text-xl font-normal tracking-tight">₹</span>
                        {analysis.transactions.filter(t => t.is_impulsive).reduce((s, t) => s + t.amount, 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2 text-zinc-500">
                        <IndianRupee className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Financial Health</span>
                      </div>
                      <div className="text-4xl font-black text-emerald-500">
                        {analysis.financial_health_score}<span className="text-zinc-700 text-lg">/100</span>
                      </div>
                    </div>
                  </div>

                  <SpendingBreakdown analysis={analysis} />

                  <WealthChart data={wealthData} />

                  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem]">
                    <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tight text-[12px]">
                      Statement Breakdown
                    </h3>
                    <TransactionTable analysis={analysis} />
                  </div>

                  <DebugPanel raw={rawDump} cleaned={cleanedDump} />

                  <button
                    onClick={clear}
                    className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors mx-auto font-black uppercase text-[10px] tracking-[0.3em] py-8"
                  >
                    <Trash2 className="w-4 h-4" /> Reset Analysis
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/20"
                >
                  <div className="bg-zinc-900/50 p-8 rounded-full mb-8 border border-zinc-800">
                    <Flame className="w-12 h-12 text-zinc-700" />
                  </div>
                  <h3 className="text-3xl font-black text-zinc-600 uppercase tracking-tighter italic">Ready to analyze?</h3>
                  <p className="text-zinc-500 mt-4 max-w-xs font-medium leading-relaxed">
                    Upload your PDF and reveal the opportunity cost of your coffee addiction.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
