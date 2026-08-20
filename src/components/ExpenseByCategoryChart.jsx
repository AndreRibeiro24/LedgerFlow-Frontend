import{
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"; 

export default function ExpensesByCategoryChart({data}){
    const COLORS = [
    "#0f172a",
    "#334155",
    "#64748b",
    "#94a3b8",
    "#cbd5e1",
    ];

if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Expenses by Category
        </h2>

        <p className="text-slate-500">
          No expense data available.
        </p>
      </div>
    );
  }

  const chartData = data.map((expense) => ({
    name: expense._id,
    value: expense.totalAmount,
  }));


  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        Expenses by Category
      </h2>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value.toFixed(2)} €`, "Expenses"]}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}