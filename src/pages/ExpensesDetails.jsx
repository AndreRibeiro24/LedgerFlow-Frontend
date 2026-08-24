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
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DBEAFE] border-t-[#2563EB]" />

            <p className="text-sm text-[#64748B]">
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
        <div className="border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-700">
            Unable to load expense
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/expenses")
            }
            className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
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
        <div className="border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="font-semibold text-[#0F172A]">
            Expense not found
          </p>

          <p className="mt-2 text-sm text-[#64748B]">
            This expense may no longer exist.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/expenses")
            }
            className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Back to Expenses
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/expenses")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition hover:text-[#2563EB]"
      >
        <span>←</span>
        Back to Expenses
      </button>

      {/* Page Header */}
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2563EB]">
            Expense record
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A]">
            {expense.description}
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Complete information for this
            business expense.
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
            Amount
          </p>

          <p className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A]">
            {formatCurrency(expense.amount)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main Expense Information */}
        <section className="border border-[#E2E8F0] bg-white xl:col-span-2">
          <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
            <p className="font-semibold text-[#0F172A]">
              Expense Information
            </p>

            <p className="mt-1 text-xs text-[#94A3B8]">
              Transaction and classification
              details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <DetailItem
              label="Description"
              value={expense.description}
            />

            <DetailItem
              label="Amount"
              value={formatCurrency(
                expense.amount
              )}
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
                value={
                  expense.paymentMethod || "—"
                }
                last
              />
            </div>
          </div>
        </section>

        {/* Expense Summary */}
        <aside className="border border-[#E2E8F0] bg-white">
          <div className="border-b border-[#E2E8F0] px-5 py-4">
            <p className="font-semibold text-[#0F172A]">
              Expense Summary
            </p>

            <p className="mt-1 text-xs text-[#94A3B8]">
              Quick reference.
            </p>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                Total
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A]">
                {formatCurrency(
                  expense.amount
                )}
              </p>
            </div>

            <div className="border-t border-[#F1F5F9] pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                Category
              </p>

              <div className="mt-2">
                <CategoryBadge>
                  {expense.category}
                </CategoryBadge>
              </div>
            </div>

            <div className="border-t border-[#F1F5F9] pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                Date
              </p>

              <p className="mt-2 text-sm font-medium text-[#0F172A]">
                {formatDate(expense.date)}
              </p>
            </div>

            <div className="border-t border-[#F1F5F9] pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                Payment
              </p>

              <p className="mt-2 text-sm font-medium text-[#0F172A]">
                {expense.paymentMethod || "—"}
              </p>
            </div>
          </div>
        </aside>

        {/* Notes */}
        <section className="border border-[#E2E8F0] bg-white xl:col-span-3">
          <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
            <p className="font-semibold text-[#0F172A]">
              Notes
            </p>

            <p className="mt-1 text-xs text-[#94A3B8]">
              Additional information about this
              expense.
            </p>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {expense.notes ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#475569]">
                {expense.notes}
              </p>
            ) : (
              <p className="text-sm text-[#94A3B8]">
                No notes have been added for this
                expense.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

/* ================================================= */
/* Local components                                  */
/* ================================================= */

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
          : "border-b border-[#F1F5F9] sm:border-r"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
        {label}
      </p>

      <div className="mt-2 break-words text-sm font-medium text-[#0F172A]">
        {value || "—"}
      </div>
    </div>
  );
}

function CategoryBadge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
      {children || "Uncategorized"}
    </span>
  );
}