"use server";

import { extractTransactions, generateSavageRoast } from "@/lib/groq";
import { AnalysisResult } from "@/types";

const API_KEY = process.env.GROQ_API_KEY;

export async function processFinancialDataAction(text: string) {
    if (!API_KEY) {
        throw new Error("GROQ_API_KEY is not configured on the server.");
    }

    try {
        const analysis = await extractTransactions(API_KEY, text);
        const roast = await generateSavageRoast(API_KEY, analysis.transactions, analysis.financial_health_score);
        return { analysis, roast };
    } catch (error: any) {
        console.error("Error in server action:", error);
        throw new Error(error.message || "Failed to process financial data.");
    }
}
