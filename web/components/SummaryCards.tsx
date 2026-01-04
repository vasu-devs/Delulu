import { AnalysisResult } from "../types";

export default function SummaryCards({ analysis }: { analysis: AnalysisResult }) {
    const totalSpent = analysis.transactions.reduce((acc, t) => acc + t.amount, 0);
    const impulsiveCount = analysis.transactions.filter(t => t.is_impulsive).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-6 rounded-3xl text-white shadow-lg">
                <p className="text-sm font-medium opacity-80">Health Score</p>
                <h3 className="text-4xl font-bold mt-1">{analysis.financial_health_score}/100</h3>
            </div>
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-lg">
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <h3 className="text-4xl font-bold mt-1 text-gray-800">{analysis.transactions.length}</h3>
            </div>
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-lg">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <h3 className="text-4xl font-bold mt-1 text-gray-800">₹{totalSpent.toLocaleString()}</h3>
            </div>
        </div>
    );
}
