import { useEffect, useState } from "react";

import api from "../services/api";
import Layout from "../components/Layout";
import ExpensesByCategoryChart from "../components/ExpensesByCategoryChart";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [invoiceStatus, setInvoiceStatus] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSummary = async () => {
      const response = await api.get("/dashboard/summary");
      setSummary(response.data);
    };

    const getInvoiceStatus = async () => {
      const response = await api.get("/dashboard/invoice-status");
      setInvoiceStatus(response.data);
    };

    const getRecentInvoices = async () => {
      const response = await api.get("/dashboard/recent-invoices");
      setRecentInvoices(response.data);
    };

    const getRecentExpenses = async () => {
      const response = await api.get("/dashboard/recent-expenses");
      setRecentExpenses(response.data);
    };

    const getExpensesByCategory = async () => {
      const response = await api.get("/dashboard/expenses-by-category");
      setExpensesByCategory(response.data);
    };

    const loadDashboard = async () => {
      try {
        setLoading(true);

        await Promise.allSettled([
          getSummary(),
          getInvoiceStatus(),
          getRecentInvoices(),
          getRecentExpenses(),
          getExpensesByCategory(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(Number(value) || 0);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("pt-PT").format(
      new Date(date)
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[55vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DBEAFE] border-t-[#2563EB] dark:border-[#1E3A8A] dark:border-t-[#60A5FA]" />

            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
              Loading dashboard...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!summary) {
    return (
      <Layout>
        <div className="border border-[#E2E8F0] bg-white p-8 text-center dark:border-[#243044] dark:bg-[#111827]">
          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            Dashboard unavailable
          </p>

          <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
            We couldn't load the dashboard information.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2563EB] dark:text-[#60A5FA]">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            A quick view of your business performance.
          </p>
        </div>

        <p className="text-xs text-[#94A3B8] dark:text-[#64748B]">
          Revenue includes paid invoices only.
        </p>
      </div>

      {/* KPI Strip */}
      <section className="mb-7 grid grid-cols-2 border-y border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827] lg:grid-cols-4">
        <KpiItem
          label="Profit"
          value={formatCurrency(summary.profit)}
          description="Revenue minus expenses"
          accent
          negative={Number(summary.profit) < 0}
        />

        <KpiItem
          label="Revenue"
          value={formatCurrency(summary.totalRevenue)}
          description="Paid invoices"
        />

        <KpiItem
          label="Expenses"
          value={formatCurrency(summary.totalExpensesAmount)}
          description={`${summary.totalExpenses || 0} recorded`}
        />

        <KpiItem
          label="Invoices"
          value={summary.totalInvoices || 0}
          description={`${summary.totalClients || 0} clients`}
          last
        />
      </section>

      {/* Chart + Status */}
      <div className="mb-7 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="border border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827] xl:col-span-3">
          <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6 dark:border-[#243044]">
            <h2 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Expenses by Category
            </h2>

            <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
              How your business spending is distributed.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <ExpensesByCategoryChart
              expensesByCategory={expensesByCategory}
            />
          </div>
        </section>

        <section className="border border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827] xl:col-span-2">
          <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6 dark:border-[#243044]">
            <h2 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Invoice Status
            </h2>

            <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
              Current invoice distribution.
            </p>
          </div>

          <div>
            <StatusRow
              label="Paid"
              value={invoiceStatus?.paid || 0}
              dotClass="bg-[#16A34A]"
              valueClass="text-[#16A34A] dark:text-[#4ADE80]"
            />

            <StatusRow
              label="Pending"
              value={invoiceStatus?.pending || 0}
              dotClass="bg-[#2563EB]"
              valueClass="text-[#2563EB] dark:text-[#60A5FA]"
            />

            <StatusRow
              label="Draft"
              value={invoiceStatus?.draft || 0}
              dotClass="bg-[#94A3B8]"
              valueClass="text-[#64748B] dark:text-[#94A3B8]"
            />

            <StatusRow
              label="Overdue"
              value={invoiceStatus?.overdue || 0}
              dotClass="bg-[#D97706]"
              valueClass="text-[#D97706] dark:text-[#FBBF24]"
            />

            <StatusRow
              label="Cancelled"
              value={invoiceStatus?.cancelled || 0}
              dotClass="bg-[#DC2626]"
              valueClass="text-[#DC2626] dark:text-[#F87171]"
              last
            />
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ActivityPanel
          title="Recent Invoices"
          subtitle="Latest invoices issued"
        >
          {recentInvoices.length === 0 ? (
            <EmptyState message="No recent invoices." />
          ) : (
            <div>
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] px-5 py-4 transition last:border-b-0 hover:bg-[#F8FAFC] dark:border-[#243044] dark:hover:bg-[#172033] sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      {invoice.invoiceNumber}
                    </p>

                    <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
                      {formatDate(invoice.issueDate)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <div className="hidden sm:block">
                      <StatusBadge status={invoice.status} />
                    </div>

                    <p className="whitespace-nowrap text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      {formatCurrency(invoice.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ActivityPanel>

        <ActivityPanel
          title="Recent Expenses"
          subtitle="Latest business spending"
        >
          {recentExpenses.length === 0 ? (
            <EmptyState message="No recent expenses." />
          ) : (
            <div>
              {recentExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] px-5 py-4 transition last:border-b-0 hover:bg-[#F8FAFC] dark:border-[#243044] dark:hover:bg-[#172033] sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      {expense.description}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                        {expense.category || "Uncategorized"}
                      </span>

                      <span className="text-xs text-[#CBD5E1] dark:text-[#475569]">
                        •
                      </span>

                      <span className="text-xs text-[#94A3B8] dark:text-[#64748B]">
                        {formatDate(expense.date)}
                      </span>
                    </div>
                  </div>

                  <p className="shrink-0 whitespace-nowrap text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ActivityPanel>
      </div>
    </Layout>
  );
}

function KpiItem({
  label,
  value,
  description,
  accent = false,
  negative = false,
  last = false,
}) {
  return (
    <div
      className={`
        relative px-5 py-6 sm:px-6
        ${
          !last
            ? "border-r border-[#E2E8F0] dark:border-[#243044]"
            : ""
        }
        border-b border-[#E2E8F0] dark:border-[#243044]
        lg:border-b-0
      `}
    >
      {accent && (
        <span
          className={`absolute left-0 top-5 h-8 w-1 ${
            negative
              ? "bg-[#DC2626] dark:bg-[#F87171]"
              : "bg-[#2563EB] dark:bg-[#3B82F6]"
          }`}
        />
      )}

      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-[#64748B]">
        {label}
      </p>

      <p
        className={`mt-4 text-2xl font-bold tracking-tight sm:text-3xl ${
          negative
            ? "text-[#DC2626] dark:text-[#F87171]"
            : accent
              ? "text-[#2563EB] dark:text-[#60A5FA]"
              : "text-[#0F172A] dark:text-[#F8FAFC]"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
        {description}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  dotClass,
  valueClass,
  last = false,
}) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 sm:px-6 ${
        last
          ? ""
          : "border-b border-[#F1F5F9] dark:border-[#243044]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
        />

        <span className="text-sm font-medium text-[#475569] dark:text-[#CBD5E1]">
          {label}
        </span>
      </div>

      <span
        className={`text-sm font-bold ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function ActivityPanel({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="overflow-hidden border border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]">
      <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6 dark:border-[#243044]">
        <h2 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
          {title}
        </h2>

        <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-40 items-center justify-center p-6">
      <p className="text-sm text-[#94A3B8] dark:text-[#64748B]">
        {message}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid:
      "bg-[#F0FDF4] text-[#15803D] dark:bg-[#052E16] dark:text-[#4ADE80]",

    pending:
      "bg-[#EFF6FF] text-[#2563EB] dark:bg-[#172554] dark:text-[#60A5FA]",

    draft:
      "bg-[#F1F5F9] text-[#64748B] dark:bg-[#1E293B] dark:text-[#94A3B8]",

    overdue:
      "bg-[#FFFBEB] text-[#B45309] dark:bg-[#451A03] dark:text-[#FBBF24]",

    cancelled:
      "bg-[#FEF2F2] text-[#DC2626] dark:bg-[#450A0A] dark:text-[#F87171]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        styles[status] ||
        "bg-[#F1F5F9] text-[#64748B] dark:bg-[#1E293B] dark:text-[#94A3B8]"
      }`}
    >
      {status}
    </span>
  );
}