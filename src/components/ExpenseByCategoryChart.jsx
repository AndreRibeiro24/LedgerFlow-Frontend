import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ExpensesByCategoryChart({
  expensesByCategory,
}) {
  const COLORS = [
    "#2563EB",
    "#16A34A",
    "#D97706",
    "#7C3AED",
    "#0891B2",
    "#DC2626",
  ];

  if (
    !expensesByCategory ||
    expensesByCategory.length === 0
  ) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-[#94A3B8]">
          No expense data available.
        </p>
      </div>
    );
  }

  const chartData = expensesByCategory.map(
    (expense) => ({
      name: expense._id,
      value: Number(expense.totalAmount),
    })
  );

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
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={
                  COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [
              `${Number(value).toFixed(2)} €`,
              "Expenses",
            ]}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}