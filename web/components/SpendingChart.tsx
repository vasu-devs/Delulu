"use client";

import dynamic from 'next/dynamic';
import { AnalysisResult } from '../types';

// Plotly needs to be client-side only
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface SpendingChartProps {
    analysis: AnalysisResult;
}

export default function SpendingChart({ analysis }: SpendingChartProps) {
    const categoryData: Record<string, number> = {};

    analysis.transactions.forEach(t => {
        categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    });

    const values = Object.values(categoryData);
    const labels = Object.keys(categoryData);

    return (
        <div className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl w-full h-[400px] flex items-center justify-center">
            <Plot
                data={[
                    {
                        values: values,
                        labels: labels,
                        type: 'pie',
                        hole: 0.4,
                        marker: {
                            colors: [
                                '#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7', '#FF9F1C', '#2EC4B6'
                            ]
                        }
                    }
                ]}
                layout={{
                    title: {
                        text: 'Spending by Category',
                        font: { family: 'inherit', size: 18, color: '#1f2937' }
                    },
                    autosize: true,
                    margin: { t: 40, b: 0, l: 0, r: 0 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    showlegend: true,
                    legend: { orientation: 'h', y: -0.1 }
                }}
                useResizeHandler={true}
                className="w-full h-full"
            />
        </div>
    );
}
