import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState(null); 

  //useEffect
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
      const response = await api.get("/dashboard/invoice-status");
      setInvoiceStatus(response.data);
    } catch (error) {
      console.error("Get invoice status error:", error);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);

    await Promise.allSettled([
      getSummary(),
      getInvoiceStatus(),
    ]);

    setLoading(false);
  };

  loadDashboard();
}, []);

  if (loading) {
    return <h1>Loading dashboard...</h1>;
  }

  if (!summary) {
    return <h1>No summary available</h1>;
  }




//created cards for visual UI 
  const cards = [
    {
      title: "Total Clients",
      value: summary.totalClients,
    },
    {
      title: "Total Invoices",
      value: summary.totalInvoices,
    },
    {
      title: "Total Expenses",
      value: summary.totalExpenses,
    },
    {
      title: "Revenue",
      value: `${summary.totalRevenue.toFixed(2)} €`,
    },
    {
      title: "Expenses Amount",
      value: `${summary.totalExpensesAmount.toFixed(2)} €`,
    },
    {
      title: "Profit",
      value: `${summary.profit.toFixed(2)} €`,
    },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Overview of your business finances
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {card.title}
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-3">
              {card.value}
            </p>
          </div>
        ))}
      </section>
      {invoiceStatus && (
  <section className="mt-8">
    <h2 className="text-xl font-bold text-slate-900 mb-4">
      Invoice Status
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Draft</p>
        <p className="text-2xl font-bold">{invoiceStatus.draft}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Pending</p>
        <p className="text-2xl font-bold">{invoiceStatus.pending}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Paid</p>
        <p className="text-2xl font-bold">{invoiceStatus.paid}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Overdue</p>
        <p className="text-2xl font-bold">{invoiceStatus.overdue}</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Cancelled</p>
        <p className="text-2xl font-bold">{invoiceStatus.cancelled}</p>
      </div>
    </div>
  </section>
)}
    </Layout>
  );
}