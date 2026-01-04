import Groq from "groq-sdk";
import { AnalysisResult } from "../types";

const schema = {
    type: "object",
    properties: {
        transactions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    merchant: { type: "string" },
                    amount: { type: "number" },
                    category: {
                        type: "string",
                        enum: ["Food", "Travel", "Shopping", "Bills", "UPI-Transfer", "Vice", "Other"]
                    },
                    is_impulsive: { type: "boolean" },
                    original_text: { type: "string" },
                },
                required: ["merchant", "amount", "category", "is_impulsive", "original_text"],
            },
        },
        financial_health_score: { type: "number" },
    },
    required: ["transactions", "financial_health_score"],
};

// Client-side Groq instance helper
const getGroqClient = (apiKey: string) => new Groq({ apiKey, dangerouslyAllowBrowser: true });

export async function extractTransactions(apiKey: string, cleanText: string): Promise<AnalysisResult> {
    const groq = getGroqClient(apiKey);

    // Safety truncate to prevent context overflow or rate limits
    const truncatedText = cleanText.slice(0, 15000);

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a strict Data Extractor. Extract transactions from the provided clean bank text.
                - Ignore 'Cashback' or 'Failed' payments.
                - Assign categories accurately.
                - Mark 'Food', 'Shopping', or 'Vice' as is_impulsive: true.
                - Return ONLY JSON. NO preambles.
                - Schema: ${JSON.stringify(schema)}`
            },
            {
                role: "user",
                content: truncatedText
            },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No data from extraction engine.");
    return JSON.parse(content);
}

export async function generateSavageRoast(apiKey: string, transactions: any[], score: number): Promise<string> {
    const groq = getGroqClient(apiKey);

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a savage Indian financial advisor. Roast the user based on these specific merchants they spent on.
                - Use brutal sarcasm.
                - Reference specific merchants found in the list.
                - Mention their low health score of ${score}/100 if applicable.
                - Be brief, brutal, and use mild Indian slang.`
            },
            {
                role: "user",
                content: `Merchants spent on: ${transactions.map(t => t.merchant).join(", ")}`
            },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "You spend so much I'm physically hurt.";
}

/**
 * local calculation for Opportunity Cost (The Ambani Index)
 * Projected Growth @ 15% CAGR over 10 years
 */
export function calculateWealthProjection(impulsiveTotal: number) {
    const years = 10;
    const rate = 0.15;
    const data = [];

    for (let t = 0; t <= years; t++) {
        // Compound Interest Formula: A = P(1 + r)^t
        // We assume this amount is invested ONCE for the sake of simplicity in the chart
        // Or we could do a monthly SIP model. Let's do a simple lump sum of 'current monthly waste' 
        // projected forward to show what THAT specific month's waste would be worth.
        const wastedValue = impulsiveTotal;
        const investedValue = impulsiveTotal * Math.pow(1 + rate, t);

        data.push({
            year: `Year ${t}`,
            wasted: Math.round(wastedValue),
            invested: Math.round(investedValue),
        });
    }
    return data;
}
