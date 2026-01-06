"use client";

import { useState, useRef } from "react";
import { Upload, X, FileCheck, Shield, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile);
            onFileSelect(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            onFileSelect(selectedFile);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        onFileSelect(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                relative group cursor-pointer overflow-hidden p-10 transition-all duration-200 border-2 border-dashed
                ${isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-black/20 bg-zinc-50 hover:bg-white hover:border-black/40 hover:shadow-sm"
                }
            `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                accept="application/pdf"
            />

            <div className="relative z-10 flex flex-col items-center text-center gap-6">
                <div className={`w-14 h-14 border-2 border-black shadow-brutalist flex items-center justify-center transition-colors duration-200 ${isDragging || file ? 'bg-black text-primary' : 'bg-primary text-black'}`}>
                    {isDragging ? (
                        <Shield className="w-6 h-6 animate-bounce" />
                    ) : file ? (
                        <FileCheck className="w-6 h-6" />
                    ) : (
                        <Upload className="w-6 h-6" />
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2"
                        >
                            <h3 className="font-mono font-bold text-sm text-black uppercase tracking-wide">
                                {isDragging ? "Release to Ingest" : "Click to Upload PDF"}
                            </h3>
                            <p className="font-mono text-[10px] font-medium text-black/40 uppercase tracking-widest">
                                Secure Enclave • Local Processing
                            </p>
                            <div className="pt-2 flex items-center justify-center gap-4">
                                <div className="w-4 h-[1px] bg-black/10" />
                                <Lock className="w-3 h-3 text-secondary/50" />
                                <div className="w-4 h-[1px] bg-black/10" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="px-3 py-1 bg-black text-primary font-mono font-bold text-[9px] shadow-sm inline-block rounded-sm">
                                READY_TO_SCAN
                            </div>
                            <h3 className="font-mono font-bold text-sm text-black tracking-tight truncate max-w-[200px] mx-auto">
                                {file.name}
                            </h3>
                            <button
                                onClick={clearFile}
                                className="font-mono text-[10px] font-bold text-red-500 hover:text-red-600 hover:underline tracking-wide uppercase"
                            >
                                [ Remove ]
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
