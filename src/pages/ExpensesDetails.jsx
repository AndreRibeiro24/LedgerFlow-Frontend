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
      try {
        setLoading(true);

        const response = await api.get(
          `/expenses/${id}`
        );

        setExpense(response.data);
      } catch (error) {
        console.error(
          "Get expense details error:",
          error
        );

        setError(
          "Unable to load expense details."
        );
      } finally {
        setLoading(false);
      }
    };

    getExpense();
  }, [id]);

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

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DBEAFE] border-t-[#2563EB] dark:border-[#1E3A8A] dark:border-t-[#60A5FA]" />

            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
              Loading expense information...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="border border-red-200 bg-red-50 p-6 dark:border-[#7F1D1D] dark:bg-[#450A0A]/40">
          <p className="font-semibold text-red-700 dark:text-[#FCA5A5]">
            Unable to load expense
          </p>

          <p className="mt-2 text-sm text-red-600 dark:text-[#F87171]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
          >
            Back to Expenses
          </button>
        </div>
      </Layout>
    );
  }

  if (!expense) {
    return (
      <Layout>
        <div className="border border-[#E2E8F0] bg-white p-8 text-center dark:border-[#243044] dark:bg-[#111827]">
          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            Expense not found
          </p>

          <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
            This expense may no longer exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
          >
            Back to Expenses
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button
        type="button"
        onClick={() => navigate("/expenses")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-[#60A5FA]"
      >
        <span>←</span>
        Back to Expenses
      </button>

      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2563EB] dark:text-[#60A5FA]">
            Expense record
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            {expense.description}
          </h1>

          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Complete information for this business expense.
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-[#64748B]">
            Amount
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            {formatCurrency(expense.amount)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="border border-[#E2E8F0] bg-white transition-colors dark:border-[#243044] dark:bg-[#111827] xl:col-span-2">
          <div className="border-b border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-6">
            <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Expense Information
            </p>

            <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
              Transaction and classification details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <DetailItem
              label="Description"
              value={expense.description}
            />

            <DetailItem
              label="Amount"
              value={formatCurrency(expense.amount)}
            />

            <DetailItem
              label="Category"
              value={
                <CategoryBadge>
                  {expense.category}
                </CategoryBadge>
              }
            />

            <DetailItem
              label="Date"
              value={formatDate(expense.date)}
            />

            <div className="sm:col-span-2">
              <DetailItem
                label="Payment Method"
                value={expense.paymentMethod || "—"}
                last
              />
            </div>
          </div>
        </section>

        <aside className="border border-[#E2E8F0] bg-white transition-colors dark:border-[#243044] dark:bg-[#111827]">
          <div className="border-b border-[#E2E8F0] px-5 py-4 dark:border-[#243044]">
            <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Expense Summary
            </p>

            <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
              Quick reference.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-[#64748B]">
                Total
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                {formatCurrency(expense.amount)}
              </p>
            </div>

            <SummaryDivider />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-[#64748B]">
                Category
              </p>

              <div className="mt-2">
                <CategoryBadge>
                  {expense.category}
                </CategoryBadge>
              </div>
            </div>

            <SummaryDivider />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-[#64748B]">
                Date
              </p>

              <p className="mt-2 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                {formatDate(expense.date)}
              </p>
            </div>

            <SummaryDivider />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-[#64748B]">
                Payment
              </p>

              <p className="mt-2 text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                {expense.paymentMethod || "—"}
              </p>
            </div>
          </div>
        </aside>

        <section className="border border-[#E2E8F0] bg-white transition-colors dark:border-[#243044] dark:bg-[#111827] xl:col-span-3">
          <div className="border-b border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-6">
            <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Notes
            </p>

            <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
              Additional information about this expense.
            </p>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {expense.notes ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#475569] dark:text-[#CBD5E1]">
                {expense.notes}
              </p>
            ) : (
              <p className="text-sm text-[#94A3B8] dark:text-[#64748B]">
                No notes have been added for this expense.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function DetailItem({
  label,
  value,
  last = false,
}) {
  return (
    <div
      className={`px-5 py-5 sm:px-6 ${
        last
          ? ""
          : "border-b border-[#F1F5F9] dark:border-[#243044] sm:border-r"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8] dark:text-[#64748B]">
        {label}
      </p>

      <div className="mt-2 break-words text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">
        {value || "—"}
      </div>
    </div>
  );
}

function CategoryBadge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#172554] dark:text-[#60A5FA]">
      {children || "Uncategorized"}
    </span>
  );
}

function SummaryDivider() {
  return (
    <div className="border-t border-[#F1F5F9] dark:border-[#243044]" />
  );
}