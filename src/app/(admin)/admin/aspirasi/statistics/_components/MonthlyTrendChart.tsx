"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlyTrendChartProps = {
  data: {
    month: string;
    count: number;
  }[];
};

export default function MonthlyTrendChart({
  data,
}: Readonly<MonthlyTrendChartProps>) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No Data</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" name="Jumlah Aspirasi" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
