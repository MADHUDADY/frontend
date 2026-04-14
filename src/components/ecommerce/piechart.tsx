import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Sale", value: 123450 },
  { name: "Purchase", value: 80000 },
  { name: "Expense", value: 45000 },
  { name: "Income", value: 150000 },
];

const COLORS = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"];

export default function DashboardPieChart() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 w-full h-full">
      <h3 className="text-lg font-semibold text-gray-800">
        Monthly Purchase
      </h3>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}