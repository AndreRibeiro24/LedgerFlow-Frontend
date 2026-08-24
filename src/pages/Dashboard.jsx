import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import ExpensesByCategoryChart from "../components/ExpenseByCategoryChart";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [invoiceStatus, setInvoiceStatus] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSummary = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Get dashboard summary error:", error);
      }
    };

    const getInvoiceStatus = async () => {
      try {
        const response = await api.get(
          "/dashboard/invoice-status"
        );

        setInvoiceStatus(response.data);
      } catch (error) {
        console.error(
          "Get invoice status error:",
          error
        );
      }
    };

    const getRecentInvoices = async () => {
      try {
        const response = await api.get(
          "/dashboard/recent-invoices"
        );

        setRecentInvoices(response.data);
      } catch (error) {
        console.error(
          "Get recent invoices error:",
          error
        );
      }
    };

    const getRecentExpenses = async () => {
      try {
        const response = await api.get(
          "/dashboard/recent-expenses"
        );

        setRecentExpenses(response.data);
      } catch (error) {
        console.error(
          "Get recent expenses error:",
          error
        );
      }
    };

    const getExpensesByCategory = async () => {
      try {
        const response = await api.get(
          "/dashboard/expenses-by-category"
        );

        setExpensesByCategory(response.data);
      } catch (error) {
        console.error(
          "Get expenses by category error:",
          error
        );
      }
    };

    const loadDashboard = async () => {
      setLoading(true);

      await Promise.allSettled([
        getSummary(),
        getInvoiceStatus(),
        getRecentInvoices(),
        getRecentExpenses(),
        getExpensesByCategory(),
      ]);

      setLoading(false);
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

  if (loading && !summary) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DBEAFE] border-t-[#2563EB]" />

            <p className="text-sm text-[#64748B]">
              Loading your financial overview...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!summary) {
    return (
      <Layout>
        <div className="border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="font-semibold text-[#0F172A]">
            Dashboard unavailable
          </p>

          <p className="mt-2 text-sm text-[#64748B]">
            We couldn't load your financial summary.
          </p>
        </div>
      </Layout>
    );
  }

  const cards = [
    {
      label: "Revenue",
      value: formatCurrency(summary.totalRevenue),
      description: "Paid invoices",
      accent: true,
    },
    {
      label: "Profit",
      value: formatCurrency(summary.profit),
      description: "Revenue minus expenses",
    },
    {
      label: "Expenses",
      value: formatCurrency(
        summary.totalExpensesAmount
      ),
      description: `${summary.totalExpenses} recorded`,
    },
    {
      label: "Invoices",
      value: summary.totalInvoices,
      description: `${summary.totalClients} clients`,
    },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-7">
        <p className="text-sm font-semibold text-[#2563EB]">
          Overview
        </p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              A quick view of your business performance.
            </p>
          </div>

          <p className="text-xs text-[#94A3B8]">
            Revenue includes paid invoices only.
          </p>
        </div>
      </div>

      {/* KPI Metrics */}
      <section className="grid grid-cols-2 border-y border-[#E2E8F0] bg-white lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className={`
              relative px-5 py-5 sm:px-6
              ${
                index % 2 === 0
                  ? "border-r border-[#E2E8F0]"
                  : ""
              }
              ${
                index < 2
                  ? "border-b border-[#E2E8F0] lg:border-b-0"
                  : ""
              }
              ${
                index !== cards.length - 1
                  ? "lg:border-r lg:border-[#E2E8F0]"
                  : ""
              }
            `}
          >
            {card.accent && (
              <span className="absolute left-0 top-5 h-8 w-1 bg-[#2563EB]" />
            )}

            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
              {card.label}
            </p>

            <p
              className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl ${
                card.accent
                  ? "text-[#2563EB]"
                  : "text-[#0F172A]"
              }`}
            >
              {card.value}
            </p>

            <p className="mt-2 text-xs text-[#64748B]">
              {card.description}
            </p>
          </div>
        ))}
      </section>

      {/* Middle Section */}
      <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Expenses Chart */}
        <div className="xl:col-span-3">
          <div className="h-full border border-[#E2E8F0] bg-white p-5 sm:p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#0F172A]">
                Expenses by Category
              </p>

              <p className="mt-1 text-xs text-[#94A3B8]">
                How your business spending is distributed.
              </p>
            </div>

            <ExpensesByCategoryChart
              expensesByCategory={
                expensesByCategory
              }
            />
          </div>
        </div>

        {/* Invoice Status */}
        <div className="xl:col-span-2">
          <div className="h-full border border-[#E2E8F0] bg-white">
            <div className="border-b border-[#E2E8F0] px-5 py-5 sm:px-6">
              <p className="text-sm font-semibold text-[#0F172A]">
                Invoice Status
              </p>

              <p className="mt-1 text-xs text-[#94A3B8]">
                Current invoice distribution.
              </p>
            </div>

            {invoiceStatus ? (
              <div>
                <StatusRow
                  label="Paid"
                  value={invoiceStatus.paid}
                  type="paid"
                />

                <StatusRow
                  label="Pending"
                  value={invoiceStatus.pending}
                  type="pending"
                />

                <StatusRow
                  label="Draft"
                  value={invoiceStatus.draft}
                  type="draft"
                />

                <StatusRow
                  label="Overdue"
                  value={invoiceStatus.overdue}
                  type="overdue"
                />

                <StatusRow
                  label="Cancelled"
                  value={invoiceStatus.cancelled}
                  type="cancelled"
                  last
                />
              </div>
            ) : (
              <p className="p-6 text-sm text-[#94A3B8]">
                No invoice status data available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Invoices */}
        <ActivityPanel
          title="Recent Invoices"
          subtitle="Latest invoices issued"
        >
          {recentInvoices.length === 0 ? (
            <EmptyState text="No recent invoices." />
          ) : (
            recentInvoices.map((invoice) => (
              <div
                key={invoice._id}
                className="flex items-center gap-4 border-b border-[#F1F5F9] px-5 py-4 last:border-b-0 sm:px-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">
                    {invoice.invoiceNumber}
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {formatDate(invoice.issueDate)}
                  </p>
                </div>

                <StatusBadge
                  status={invoice.status}
                />

                <p className="w-24 text-right text-sm font-semibold text-[#0F172A]">
                  {formatCurrency(invoice.total)}
                </p>
              </div>
            ))
          )}
        </ActivityPanel>

        {/* Recent Expenses */}
        <ActivityPanel
          title="Recent Expenses"
          subtitle="Latest business spending"
        >
          {recentExpenses.length === 0 ? (
            <EmptyState text="No recent expenses." />
          ) : (
            recentExpenses.map((expense) => (
              <div
                key={expense._id}
                className="flex items-center gap-4 border-b border-[#F1F5F9] px-5 py-4 last:border-b-0 sm:px-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">
                    {expense.description}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#94A3B8]">
                    {expense.category} ·{" "}
                    {formatDate(expense.date)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-[#0F172A]">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            ))
          )}
        </ActivityPanel>
      </section>
    </Layout>
  );
}

/* ------------------------------------------------ */
/* Small Dashboard Components                       */
/* ------------------------------------------------ */

function ActivityPanel({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="overflow-hidden border border-[#E2E8F0] bg-white">
      <div className="border-b border-[#E2E8F0] px-5 py-5 sm:px-6">
        <p className="text-sm font-semibold text-[#0F172A]">
          {title}
        </p>

        <p className="mt-1 text-xs text-[#94A3B8]">
          {subtitle}
        </p>
      </div>

      <div>{children}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="text-sm text-[#94A3B8]">
        {text}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  type,
  last,
}) {
  const styles = {
    paid: {
      dot: "bg-[#16A34A]",
      text: "text-[#16A34A]",
    },

    pending: {
      dot: "bg-[#2563EB]",
      text: "text-[#2563EB]",
    },

    draft: {
      dot: "bg-[#94A3B8]",
      text: "text-[#64748B]",
    },

    overdue: {
      dot: "bg-[#D97706]",
      text: "text-[#D97706]",
    },

    cancelled: {
      dot: "bg-[#DC2626]",
      text: "text-[#DC2626]",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`flex items-center justify-between px-5 py-4 sm:px-6 ${
        last
          ? ""
          : "border-b border-[#F1F5F9]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
        />

        <span className="text-sm font-medium text-[#475569]">
          {label}
        </span>
      </div>

      <span
        className={`text-sm font-bold ${style.text}`}
      >
        {value ?? 0}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid:
      "bg-[#F0FDF4] text-[#15803D]",
    pending:
      "bg-[#EFF6FF] text-[#2563EB]",
    draft:
      "bg-[#F1F5F9] text-[#64748B]",
    overdue:
      "bg-[#FFFBEB] text-[#B45309]",
    cancelled:
      "bg-[#FEF2F2] text-[#DC2626]",
  };

  return (
    <span
      className={`hidden rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize sm:inline ${
        styles[status] ||
        "bg-[#F1F5F9] text-[#64748B]"
      }`}
    >
      {status}
    </span>
  );
}