import { useContext } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { ThemeContext } from "../context/ThemeContext";

export default function ExpensesByCategoryChart({
  expensesByCategory,
}) {
  const { theme } = useContext(ThemeContext);

  const COLORS = [
    "#2563EB",
    "#16A34A",
    "#D97706",
    "#7C3AED",
    "#0891B2",
    "#DC2626",
  ];

  const chartData = (
    expensesByCategory || []
  ).map((expense) => ({
    name:
      expense._id || "Uncategorized",

    value:
      Number(expense.totalAmount) || 0,
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(Number(value) || 0);
  };

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-[#94A3B8] dark:text-[#64748B]">
          No expense data available.
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            stroke={
              theme === "dark"
                ? "#111827"
                : "#FFFFFF"
            }
            strokeWidth={3}
          >
            {chartData.map(
              (entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip
            formatter={(value) => [
              formatCurrency(value),
              "Expenses",
            ]}
            contentStyle={{
              backgroundColor:
                theme === "dark"
                  ? "#111827"
                  : "#FFFFFF",

              border:
                theme === "dark"
                  ? "1px solid #334155"
                  : "1px solid #E2E8F0",

              borderRadius: "8px",

              boxShadow:
                theme === "dark"
                  ? "0 10px 30px rgba(0,0,0,0.35)"
                  : "0 10px 30px rgba(15,23,42,0.08)",

              color:
                theme === "dark"
                  ? "#F8FAFC"
                  : "#0F172A",
            }}
            itemStyle={{
              color:
                theme === "dark"
                  ? "#F8FAFC"
                  : "#0F172A",
            }}
            labelStyle={{
              color:
                theme === "dark"
                  ? "#CBD5E1"
                  : "#475569",

              fontWeight: 600,
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              color:
                theme === "dark"
                  ? "#CBD5E1"
                  : "#475569",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}