"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Shield, FileText, Upload,
  TrendingUp, ArrowRight, Search,
  Lock, PiggyBank, Flame, Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { AnalysisResult, Transaction } from "@/types";

import FileUpload from "@/components/FileUpload";
import WealthChart from "@/components/WealthChart";
import DebugPanel from "@/components/DebugPanel";
import SpendingBreakdown from "@/components/SpendingBreakdown";

import { analyzeStatementAPI } from "@/lib/api";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [roast, setRoast] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pdf" | "text">("pdf");
  const [balance, setBalance] = useState(0);

  // For the Chart
  const [wealthData, setWealthData] = useState<{ year: string; value: number; type: string }[]>([]);
  const [rawDump, setRawDump] = useState<unknown>(null);
  const [cleanedDump, setCleanedDump] = useState<unknown>(null);

  useEffect(() => {
    if (analysis) {
      const total = analysis.transactions
        .filter(t => t.transaction_type === "DEBIT")
        .reduce((s, t) => s + t.amount, 0);
      setBalance(total);
    }
  }, [analysis]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (activeTab === "pdf") {
        if (!file) throw new Error("Please select a statement first.");
        const text = await extractTextFromPDF(file);
        if (!text || text.trim().length < 50) {
          throw new Error("Could not extract enough text from PDF.");
        }
        data = await analyzeStatementAPI(text);
      } else {
        if (!rawText.trim()) throw new Error("Please paste some transactions first.");
        data = await analyzeStatementAPI(rawText);
      }

      setAnalysis(data.analysis);
      setRoast(data.roast);
      setRawDump(data.raw_data || "No raw signal captured.");
      setCleanedDump(data.analysis);

      // Regret Calculation: 1.3x multiplier for invested fantasy
      const monthlyWaste = data.analysis.transactions
        .filter((t: Transaction) => t.is_impulsive)
        .reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0);

      setWealthData([
        { year: 'Reality', value: monthlyWaste * 12, type: 'spent' },
        { year: 'Fantasy', value: Math.round(monthlyWaste * 12 * 1.3), type: 'invested' }
      ]);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setAnalysis(null);
    setRoast("");
    setFile(null);
    setRawText("");
    setWealthData([]);
  };

  return (
    <main className="min-h-screen bg-transparent grid-lines custom-scrollbar overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-secondary/10 rounded-full blur-[150px] animate-pulse" />
      </div>

      <nav className="border-b-[4px] border-black bg-white p-6 sticky top-0 z-[100] shadow-brutalist">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="bg-white p-2 border-2 border-black shadow-brutalist hover:scale-110 transition-transform cursor-pointer flex items-center justify-center">
                <Image
                  src="/assets/rupee-roast/logo.png"
                  alt="Piggy Stash"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-3xl text-black font-arcade tracking-tighter leading-none">
                RUPEE<br /><span className="text-primary drop-shadow-[2px_2px_0px_#000]">ROAST</span>
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {['UPLOAD', 'ROASTS', 'HALL OF SHAME'].map((item) => (
              <button key={item} className="arcade-btn !py-4 !px-8 border-2">
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="yellow-card px-6 py-2 font-arcade text-[10px] border-2 shadow-brutalist-sm">
              CREDITS: 99
            </div>
            <div className="w-12 h-12 bg-black rounded-none border-2 border-primary flex items-center justify-center">
              <div className="w-4 h-4 bg-primary animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full bg-primary overflow-hidden border-b-2 border-black py-2">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="whitespace-nowrap flex gap-8 items-center"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="font-arcade text-black text-xl">FINANCIAL_ROAST_PROTOCOL</span>
              <span className="font-mono font-bold text-black/50">///</span>
              <span className="font-arcade text-black text-xl">NO_MERCY</span>
              <span className="font-mono font-bold text-black/50">///</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {!analysis ? (
          /* STATE A: LANDING (INGESTION) */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-12 text-center"
          >
            <div className="space-y-6 mb-16 relative z-10">
              <div className="inline-block px-4 py-2 bg-primary text-black font-arcade text-xs transform -rotate-2 border-2 border-black shadow-[4px_4px_0px_#000]">
                FINANCIAL_HUMILIATION_PROTOCOL_V1.0
              </div>

              <div className="relative">
                {/* Floating 3D Assets - Left */}
                <motion.div
                  className="absolute -left-32 top-0 hidden lg:block"
                  animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/assets/rupee-roast/dumpster_fire.png"
                    alt="Dumpster Fire"
                    width={200}
                    height={200}
                    className="w-48 h-48 drop-shadow-2xl"
                  />
                </motion.div>

                {/* Floating 3D Assets - Right */}
                <motion.div
                  className="absolute -right-32 top-10 hidden lg:block"
                  animate={{ y: [0, 20, 0], rotate: [5, -5, 5] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/assets/rupee-roast/rocket.png"
                    alt="Rocket"
                    width={200}
                    height={200}
                    className="w-48 h-48 drop-shadow-2xl"
                  />
                </motion.div>

                <h2 className="text-4xl md:text-7xl text-white font-arcade leading-tight tracking-tight relative z-20">
                  ARE YOU <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient drop-shadow-[4px_4px_0px_#000] stroke-black" style={{ WebkitTextStroke: '2px black' }}>COOKED?</span>
                </h2>
              </div>

              <p className="text-black/60 font-mono text-lg max-w-lg mx-auto leading-relaxed bg-white/50 backdrop-blur-sm p-4 rounded-lg border-2 border-dashed border-black/10">
                Upload your bank statement. Our AI will analyze your poor life choices and roast you into financial solvency.
              </p>
            </div>

            {/* INGESTION MODULE (Centered & Expanded) */}
            <div className="brutalist-card p-8 md:p-14 text-left relative overflow-hidden group">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Upload className="w-64 h-64 text-black" />
              </div>

              <div className="flex items-center gap-6 mb-12 relative z-10">
                <div className="w-8 h-8 bg-black border-2 border-primary shadow-brutalist-sm animate-pulse" />
                <span className="font-arcade text-[12px] tracking-widest text-black/60">INGESTION_MODULE_ACTIVE</span>
              </div>

              {/* Decorative Sticker */}
              <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 transform rotate-12 z-20 pointer-events-none">
                <Image
                  src="/assets/rupee-roast/sticker_crying_wallet.png"
                  alt="Crying Wallet"
                  width={120}
                  height={120}
                  className="w-24 h-24 md:w-32 md:h-32 drop-shadow-xl opacity-90"
                />
              </div>

              <div className="flex bg-black p-1 mb-12 border-2 border-black text-white relative z-10 shadow-sm">
                <button
                  onClick={() => setActiveTab("pdf")}
                  className={`flex-1 flex items-center justify-center gap-4 py-4 font-mono font-bold text-xs transition-all ${activeTab === "pdf"
                    ? "bg-primary text-black"
                    : "text-white/60 hover:text-white"
                    }`}
                >
                  <Upload className="w-4 h-4" /> STATEMENT_PDF
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 flex items-center justify-center gap-4 py-4 font-mono font-bold text-xs transition-all ${activeTab === "text"
                    ? "bg-secondary text-white"
                    : "text-white/60 hover:text-white"
                    }`}
                >
                  <FileText className="w-4 h-4" /> RAW_TEXT_LOGS
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "pdf" ? (
                  <motion.div key="pdf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                    <FileUpload onFileSelect={(f) => setFile(f)} />
                  </motion.div>
                ) : (
                  <motion.div key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                    <textarea
                      placeholder="PASTE YOUR TRANSACTIONS HERE... FORMAT: Date | Description | Amount"
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      className="w-full h-80 p-6 bg-zinc-50 border-2 border-black text-black placeholder:text-black/30 focus:border-primary transition-all outline-none resize-none font-mono text-sm custom-scrollbar shadow-inner"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-12 arcade-btn flex items-center justify-center gap-6 group relative z-10 hover:brightness-105 active:scale-[0.99] transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin" />
                    <span>ANALYZING...</span>
                  </div>
                ) : (
                  <>
                    <span>INITIATE ROAST</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {error && (
                <div className="mt-10 p-10 pink-card text-xs font-arcade leading-relaxed border-[4px] shadow-neon-pink relative z-10">
                  ERROR: SYSTEM_FAILED ( {error} )
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto opacity-50">
              <div className="flex items-center justify-center gap-4 text-white/40 font-arcade text-[10px]">
                <Shield className="w-4 h-4" /> LOCAL_PROCESSING
              </div>
              <div className="flex items-center justify-center gap-4 text-white/40 font-arcade text-[10px]">
                <Lock className="w-4 h-4" /> NO_DATA_STORED
              </div>
            </div>
          </motion.div>
        ) : (
          /* STATE B: REPORT (VERDICT + DATA) */
          <div className="space-y-24">

            {/* 1. VERDICT HERO */}
            <section className="relative">
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="indigo-card !bg-black p-8 md:p-12 overflow-hidden crt-overlay border-2 shadow-brutalist"
              >
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-12 mb-8 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                      <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                      <span className="font-mono font-bold text-xs text-primary/80 tracking-widest uppercase">Analysis Complete</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl text-white font-arcade leading-tight tracking-tighter mix-blend-screen">
                      VERDICT: <span className="text-secondary drop-shadow-[2px_2px_0px_#000]">FATAL</span>
                    </h2>
                  </div>

                  <div className="lg:col-span-8 relative">
                    <div className="comic-bubble text-black font-mono font-bold text-xl leading-relaxed p-10 mt-8 mb-12 shadow-brutalist border-2 bg-white">
                      <div className="absolute -top-12 -right-12 hidden md:block">
                        <Image
                          src="/assets/rupee-roast/sticker_crying_wallet.png"
                          alt="Crying Wallet"
                          width={140}
                          height={140}
                          className="w-36 h-36 rotate-12 drop-shadow-xl"
                        />
                      </div>
                      {roast}
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-center">
                    <motion.div
                      animate={{ rotate: [2, -2, 2] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="yellow-card p-10 rotate-2 shadow-brutalist border-2 bg-accent text-black text-center w-full max-w-sm"
                    >
                      <p className="font-mono font-bold text-xs uppercase tracking-widest mb-6 border-b-2 border-black pb-2 mx-auto w-1/2">Shame Score</p>
                      <p className="text-8xl font-black tabular leading-none">
                        {analysis.financial_health_score}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 2. REGRET ENGINE */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-black shadow-brutalist overflow-hidden group bg-black">
              <div className="bg-[#050510] p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-black relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <Image
                    src="/assets/rupee-roast/dumpster_fire.png"
                    alt="Dumpster Fire"
                    width={300}
                    height={300}
                    className="w-[300px] h-[300px]"
                  />
                </div>
                <div className="relative z-10 space-y-8">
                  <h3 className="font-arcade text-secondary text-2xl drop-shadow-[2px_2px_0px_#000]">THE REALITY<br /><span className="text-white/60 font-mono font-normal text-xs uppercase tracking-widest">(Capital Burned)</span></h3>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Burn Status: CRITICAL</p>
                    <p className="text-6xl md:text-7xl font-black text-white tabular drop-shadow-lg">₹{balance.toLocaleString()}</p>
                  </div>
                  <div className="pink-card !p-6 font-mono font-bold text-lg border-2 shadow-brutalist inline-block transform -rotate-1">
                    &quot;MOSTLY SPENT ON: VIBES.&quot;
                  </div>
                </div>
              </div>

              <div className="bg-white p-12 relative overflow-hidden text-black transition-all duration-500 group-hover:bg-[#F0FF00]">
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-700">
                  <Image
                    src="/assets/rupee-roast/rocket.png"
                    alt="Rocket"
                    width={300}
                    height={300}
                    className="w-[300px] h-[300px]"
                  />
                </div>
                <div className="relative z-10 space-y-8">
                  <h3 className="font-arcade text-primary drop-shadow-[2px_2px_0px_#000] text-2xl">THE FANTASY<br /><span className="text-black/60 font-mono font-normal text-xs uppercase tracking-widest">(If Invested)</span></h3>
                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] font-mono font-bold text-black/50 uppercase tracking-widest mb-2">Projected Net Worth</p>
                      <p className="text-6xl md:text-7xl font-black text-black tabular">₹{Math.round(balance * 1.3).toLocaleString()}</p>
                    </div>
                    <button className="lime-card !p-6 font-mono font-bold text-sm uppercase tracking-wide w-full mt-4 border-2 shadow-brutalist hover:shadow-brutalist-lg hover:-translate-y-1 transition-all text-center">
                      STOP THE BLEEDING. START INVESTING.
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. DATA DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left: Receipt */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-2 h-10 bg-primary shadow-brutalist-sm" />
                  <h3 className="font-arcade text-white text-xl tracking-tight">RECEIPT OF SHAME</h3>
                </div>
                <SpendingBreakdown analysis={analysis} />
              </div>

              {/* Right: Charts & Debug */}
              <div className="lg:col-span-5 space-y-12">
                <div className="brutalist-card p-8 md:p-10 bg-white border-2 shadow-brutalist relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <TrendingUp className="w-64 h-64 text-black" />
                  </div>
                  <div className="mb-10 relative z-10 border-b-2 border-black pb-6">
                    <h4 className="font-arcade text-lg mb-2 text-black tracking-tight">WEALTH TRAJECTORY</h4>
                    <p className="font-mono text-xs text-black/60 font-bold uppercase tracking-widest">FORENSIC PROJECTION</p>
                  </div>
                  <div className="h-[350px] relative z-10">
                    <WealthChart data={wealthData} />
                  </div>
                </div>

                <DebugPanel raw={rawDump} cleaned={cleanedDump} />
              </div>
            </div>

            {/* RESET ACTION */}
            <div className="text-center pb-24 border-t-2 border-dashed border-white/10 pt-24">
              <button
                onClick={clear}
                className="group inline-flex items-center gap-4 px-8 py-4 border-2 border-red-500/30 text-red-400 font-mono font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95 rounded-sm"
              >
                <span className="group-hover:animate-pulse">[ EMERGENCY_RESET ]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t-[4px] border-black bg-primary">
        <div className="bg-white py-24 px-8 font-arcade text-[10px] text-black border-b-4 border-black">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 text-center md:text-left">
              <p className="text-black font-bold text-lg">RUPEE ROAST V1.2 - BUILD: HIGH_VOLTAGE_99</p>
              <p className="opacity-60 text-xs">© 2026 ELITE CAPITAL FORENSICS. ALL REGRETS RESERVED.</p>
            </div>
            <div className="flex gap-16 underline decoration-2 underline-offset-8">
              <a href="#" className="hover:text-primary transition-all">TERMINAL</a>
              <a href="#" className="hover:text-secondary transition-all">PRIVACY</a>
              <a href="#" className="hover:text-accent transition-all">SHELL</a>
            </div>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <h1 className="text-[13vw] leading-[0.8] font-black text-black text-center tracking-tighter select-none -mb-1 md:-mb-3">
            RUPEE ROAS
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_bottom,transparent_40%,black_80%),linear-gradient(180deg,#EA580C_0%,#DC2626_30%,#000000_60%,#EA580C_100%)] bg-[length:100%_100%,100%_200%] animate-lava-slow drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              T
            </span>
          </h1>
        </div>
      </footer>
    </main>
  );
}
