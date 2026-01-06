"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface WealthChartProps {
    data: { year: string; type: string; value: number }[];
}

export default function WealthChart({ data }: WealthChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-[320px] font-mono font-bold">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                    <XAxis
                        dataKey="year"
                        axisLine={{ stroke: '#000', strokeWidth: 4 }}
                        tickLine={{ stroke: '#000', strokeWidth: 2 }}
                        tick={{ fill: '#000', fontSize: 10, fontWeight: 900 }}
                        dy={15}
                    />
                    <YAxis
                        axisLine={{ stroke: '#000', strokeWidth: 4 }}
                        tickLine={{ stroke: '#000', strokeWidth: 2 }}
                        tick={{ fill: '#000', fontSize: 10, fontWeight: 900 }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                        width={70}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{
                            backgroundColor: "#FFF",
                            border: "4px solid #000",
                            boxShadow: "8px 8px 0px 0px #000",
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "16px",
                            borderRadius: "0",
                        }}
                        itemStyle={{ color: "#000" }}
                        labelStyle={{ color: "#FF00FF", marginBottom: "8px", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}
                        formatter={(value) => [`₹${(value ?? 0).toLocaleString()}`, '']}
                    />
                    <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.type === 'invested' ? '#D4FF00' : '#FF00FF'}
                                stroke="#000"
                                strokeWidth={3}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
