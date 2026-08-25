import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";

const emptyForm = {
  description: "",
  amount: "",
  date: "",
  category: "",
  paymentMethod: "",
  notes: "",
};

export default function Expenses() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

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

  useEffect(() => {
    document.body.style.overflow = formOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [formOpen]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingExpense(null);
    setError("");
  };

  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingExpense) {
        await api.put(
          `/expenses/${editingExpense._id}`,
          formData
        );
      } else {
        await api.post("/expenses", formData);
      }

      closeForm();

      await getExpenses();
    } catch (error) {
      console.error("Save expense error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save expense."
      );
    } finally {
      setSaving(false);
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
      paymentMethod:
        expense.paymentMethod || "",
      notes: expense.notes || "",
    });

    setError("");
    setFormOpen(true);
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(Number(value) || 0);
  };

  const formatDate = (value) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat("pt-PT").format(
      new Date(value)
    );
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2563EB] dark:text-[#60A5FA]">
            Spending
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Expenses
          </h1>

          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Record and manage your business expenses.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
        >
          + New Expense
        </button>
      </div>

      {error && !formOpen && (
        <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-[#7F1D1D] dark:bg-[#450A0A]/40 dark:text-[#FCA5A5]">
          {error}
        </div>
      )}

      {/* Expense List */}
      <section className="overflow-hidden border border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]">
        <div className="border-b border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-6">
          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            Expense List
          </p>

          <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
            {expenses.length} expense
            {expenses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              No expenses yet
            </p>

            <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Record your first expense to start tracking
              business spending.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
            >
              Add Expense
            </button>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A]">
                  <tr className="border-b border-[#E2E8F0] dark:border-[#243044]">
                    <TableHeader>
                      Expense
                    </TableHeader>

                    <TableHeader>
                      Category
                    </TableHeader>

                    <TableHeader>
                      Date
                    </TableHeader>

                    <TableHeader align="right">
                      Amount
                    </TableHeader>

                    <TableHeader align="right">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="border-b border-[#F1F5F9] transition last:border-b-0 hover:bg-[#F8FAFC] dark:border-[#243044] dark:hover:bg-[#172033]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                          {expense.description}
                        </p>

                        {expense.paymentMethod && (
                          <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
                            {expense.paymentMethod}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <CategoryBadge>
                          {expense.category}
                        </CategoryBadge>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B] dark:text-[#CBD5E1]">
                        {formatDate(expense.date)}
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        {formatCurrency(
                          expense.amount
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <ActionButton
                            onClick={() =>
                              navigate(
                                `/expenses/${expense._id}`
                              )
                            }
                          >
                            View
                          </ActionButton>

                          <ActionButton
                            onClick={() =>
                              handleEdit(expense)
                            }
                          >
                            Edit
                          </ActionButton>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                expense._id
                              )
                            }
                            className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] dark:text-[#F87171] dark:hover:bg-[#450A0A]/40"
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

            {/* Mobile */}
            <div className="divide-y divide-[#E2E8F0] dark:divide-[#243044] sm:hidden">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        {expense.description}
                      </p>

                      <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
                        {formatDate(expense.date)}
                      </p>
                    </div>

                    <p className="whitespace-nowrap font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      {formatCurrency(
                        expense.amount
                      )}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <CategoryBadge>
                      {expense.category}
                    </CategoryBadge>

                    {expense.paymentMethod && (
                      <span className="text-xs text-[#94A3B8] dark:text-[#64748B]">
                        {expense.paymentMethod}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionButton
                      onClick={() =>
                        navigate(
                          `/expenses/${expense._id}`
                        )
                      }
                    >
                      View
                    </ActionButton>

                    <ActionButton
                      onClick={() =>
                        handleEdit(expense)
                      }
                    >
                      Edit
                    </ActionButton>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(expense._id)
                      }
                      className="rounded-md bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#DC2626] dark:bg-[#450A0A]/40 dark:text-[#F87171]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
          <button
            type="button"
            aria-label="Close expense form"
            onClick={closeForm}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] dark:bg-black/60"
          />

          <div className="relative flex max-h-full w-full flex-col bg-white shadow-2xl transition-colors duration-200 dark:bg-[#111827] sm:max-w-2xl sm:rounded-xl">
            <header className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-7">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                  {editingExpense
                    ? "Edit expense"
                    : "New expense"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {editingExpense
                    ? editingExpense.description
                    : "Add Expense"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-[#64748B] transition hover:bg-[#F1F5F9] dark:text-[#94A3B8] dark:hover:bg-[#172033] dark:hover:text-[#F8FAFC]"
              >
                ×
              </button>
            </header>

            <form
              id="expense-form"
              onSubmit={handleSubmit}
              className="overflow-y-auto"
            >
              <div className="p-5 sm:p-7">
                {error && (
                  <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-[#7F1D1D] dark:bg-[#450A0A]/40 dark:text-[#FCA5A5]">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <InputField
                      label="Description"
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                      placeholder="What was this expense for?"
                      required
                    />
                  </div>

                  <InputField
                    label="Amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />

                  <InputField
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />

                  <InputField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Software, Office, Travel..."
                    required
                  />

                  <InputField
                    label="Payment Method"
                    name="paymentMethod"
                    value={
                      formData.paymentMethod
                    }
                    onChange={handleChange}
                    placeholder="Card, Transfer, Cash..."
                  />

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      Notes
                    </label>

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Optional notes about this expense..."
                      className="w-full resize-none rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B] dark:focus:border-[#3B82F6] dark:focus:ring-blue-950"
                    />
                  </div>
                </div>
              </div>
            </form>

            <footer className="flex justify-end gap-3 border-t border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-7">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:text-[#CBD5E1] dark:hover:bg-[#172033]"
              >
                Cancel
              </button>

              <button
                form="expense-form"
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#94A3B8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
              >
                {saving
                  ? "Saving..."
                  : editingExpense
                    ? "Save Changes"
                    : "Create Expense"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  );
}

function InputField({
  label,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
        {label}
      </label>

      <input
        type={type}
        {...props}
        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B] dark:focus:border-[#3B82F6] dark:focus:ring-blue-950"
      />
    </div>
  );
}

function TableHeader({
  children,
  align = "left",
}) {
  const alignment =
    align === "right"
      ? "text-right"
      : "text-left";

  return (
    <th
      className={`px-6 py-3 ${alignment} text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8] dark:text-[#64748B]`}
    >
      {children}
    </th>
  );
}

function ActionButton({ children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#CBD5E1] dark:hover:border-[#475569] dark:hover:bg-[#172033] dark:hover:text-[#F8FAFC]"
    >
      {children}
    </button>
  );
}

function CategoryBadge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#172554] dark:text-[#60A5FA]">
      {children}
    </span>
  );
}