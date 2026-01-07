"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CategoryPieChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#D4FF00', '#FF00FF', '#00FFFF', '#FFA500', '#EF4444', '#8b5cf6'];

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-[300px] font-mono font-bold">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="#000"
                        strokeWidth={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#FFF",
                            border: "2px solid #000",
                            boxShadow: "4px 4px 0px 0px #000",
                            fontSize: "12px",
                            fontWeight: "bold",
                            borderRadius: "0",
                        }}
                        itemStyle={{ color: "#000" }}
                        formatter={(value) => [`₹${(value as number).toLocaleString()}`, '']}
                    />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ fontSize: "10px", textTransform: "uppercase" }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
