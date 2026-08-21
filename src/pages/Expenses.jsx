import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";


export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    paymentMethod: "",
    notes: "",
  });

  const getExpenses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/expenses");

      setExpenses(response.data);
    } catch (error) {
      console.error("Get expenses error:", error);
      setError("Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      date: "",
      category: "",
      paymentMethod: "",
      notes: "",
    });

    setEditingExpense(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (editingExpense) {
        await api.put(
          `/expenses/${editingExpense._id}`,
          formData
        );
      } else {
        await api.post("/expenses", formData);
      }

      resetForm();
      await getExpenses();
    } catch (error) {
      console.error("Save expense error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save expense."
      );
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);

    setFormData({
      description: expense.description || "",
      amount: expense.amount || "",
      date: expense.date
        ? expense.date.split("T")[0]
        : "",
      category: expense.category || "",
      paymentMethod: expense.paymentMethod || "",
      notes: expense.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/expenses/${expenseId}`);

      setExpenses((currentExpenses) =>
        currentExpenses.filter(
          (expense) => expense._id !== expenseId
        )
      );
    } catch (error) {
      console.error("Delete expense error:", error);
      setError("Unable to delete expense.");
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Expenses
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your business expenses
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Expense Form */}
        <section className="xl:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingExpense
                ? "Edit Expense"
                : "Add Expense"}
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Payment Method
                </label>

                <input
                  type="text"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800 transition"
                >
                  {editingExpense
                    ? "Update Expense"
                    : "Create Expense"}
                </button>

                {editingExpense && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Expenses List */}
        <section className="xl:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Expense List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {expenses.length} expense
                {expenses.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <p className="p-6 text-slate-500">
                Loading expenses...
              </p>
            ) : expenses.length === 0 ? (
              <p className="p-6 text-slate-500">
                No expenses available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                        Description
                      </th>

                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                        Category
                      </th>

                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                        Date
                      </th>

                      <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">
                        Amount
                      </th>

                      <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {expenses.map((expense) => (
                      <tr
                        key={expense._id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {expense.description}
                          </p>

                          {expense.paymentMethod && (
                            <p className="text-sm text-slate-500">
                              {expense.paymentMethod}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {expense.category}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {new Date(
                            expense.date
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right font-medium text-slate-900">
                          {Number(
                            expense.amount
                          ).toFixed(2)}{" "}
                          €
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/expenses/${expense._id}`)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                            >
                            View
                            </button>
                            <button
                              onClick={() =>
                                handleEdit(expense)
                              }
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(expense._id)
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                            >
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}