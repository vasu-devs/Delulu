"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface WealthChartProps {
    data: any[];
}

export default function WealthChart({ data }: WealthChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-[400px] mt-8"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#FFF",
                            borderRadius: "20px",
                            border: "1px solid #F1F5F9",
                            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
                            fontSize: "12px",
                            fontWeight: "900",
                            color: "#1E293B"
                        }}
                        itemStyle={{ color: "#6366F1" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#6366F1"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        name="Invested"
                    />
                    <Area
                        type="monotone"
                        dataKey="lost"
                        stroke="#F43F5E"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorLost)"
                        name="Impulse Waste"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
