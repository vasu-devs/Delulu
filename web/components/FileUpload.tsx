"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, File as FileIcon } from "lucide-react";
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
        relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-8 transition-all duration-300
        ${isDragging ? "border-red-500 bg-red-50/50 scale-[1.02]" : "border-gray-200 hover:border-red-400 hover:bg-gray-50"}
      `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                accept="application/pdf"
            />

            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="bg-gray-100 p-4 rounded-3xl mb-4 group-hover:scale-110 group-hover:bg-red-100 group-hover:text-red-600 transition-all">
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-red-500" />
                        </div>
                        <p className="text-gray-600 font-bold">Drop your PDF bank statement here</p>
                        <p className="text-gray-400 text-sm mt-1">or click to browse files</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="bg-red-50 p-3 rounded-xl">
                            <FileIcon className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-bold truncate">{file.name}</p>
                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
