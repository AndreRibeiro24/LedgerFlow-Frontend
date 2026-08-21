import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

export default function ExpenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getExpense = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/expenses/${id}`);
        setExpense(response.data);
      } catch (error) {
        console.error("Get expense details error:", error);
        setError("Unable to load expense details.");
      } finally {
        setLoading(false);
      }
    };

    getExpense();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="text-slate-500">Loading expense...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="text-red-600">{error}</p>
      </Layout>
    );
  }

  if (!expense) {
    return (
      <Layout>
        <p className="text-slate-500">Expense not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <button
          onClick={() => navigate("/expenses")}
          className="mb-4 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Expenses
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Expense Details
        </h1>

        <p className="mt-1 text-slate-500">
          Full information for {expense.description}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-slate-500">Description</p>
            <p className="font-medium text-slate-900 mt-1">
              {expense.description}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Amount</p>
            <p className="font-medium text-slate-900 mt-1">
              {Number(expense.amount).toFixed(2)} €
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Category</p>
            <p className="font-medium text-slate-900 mt-1">
              {expense.category}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Date</p>
            <p className="font-medium text-slate-900 mt-1">
              {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Payment Method</p>
            <p className="font-medium text-slate-900 mt-1">
              {expense.paymentMethod || "Not provided"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Notes</p>
            <p className="font-medium text-slate-900 mt-1 whitespace-pre-wrap">
              {expense.notes || "No notes available."}
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
}