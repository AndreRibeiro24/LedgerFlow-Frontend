import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import ExpensesByCategoryChart from "../components/ExpenseByCategoryChart";


export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState([]); 
  const [recentInvoices, setRecentInvoiceStatus] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
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
  
  const getRecentInvoices = async()=>{
    try{
      const response = await api.get("/dashboard/recent-invoices")
      setRecentInvoiceStatus(response.data)
    } catch(error){
      console.error("Get recent invoices error:", error)
    }
  }

  const getRecentExpenses = async()=>{
    try{
      const response = await api.get("/dashboard/recent-expenses")
      setRecentExpenses(response.data)
    }catch(error){
      console.error("Get Recent Expenses Error:", error)
    }

  }

  const getExpensesByCategory = async()=>{
    try{
      const response = await api.get("/dashboard/expenses-by-category")
      setExpensesByCategory(response.data)
    }catch(error){
      console.error("Get Expenses by Category Error:", error)
    }
  }
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

                                      {/* Invoice Status */}

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
                                                    {/* Recent Invoices */}

    <section className="mt-8">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-slate-900">
      Recent Invoices
    </h2>
  </div>

  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    {recentInvoices.length === 0 ? (
      <p className="p-6 text-slate-500">
        No recent invoices available.
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                Invoice
              </th>

              <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                Status
              </th>

              <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                Date
              </th>

              <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {recentInvoices.map((invoice) => (
              <tr
                key={invoice._id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {invoice.invoiceNumber}
                </td>

                <td className="px-6 py-4 text-slate-600 capitalize">
                  {invoice.status}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  {invoice.total.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</section>

                                              {/* Recent Expenses */}

<section className="mt-8">
  <h2 className="text-xl font-bold text-slate-900 mb-4">
    Recent Expenses
  </h2>

  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    {recentExpenses.length === 0 ? (
      <p className="p-6 text-slate-500">
        No recent expenses available.
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
            </tr>
          </thead>

          <tbody>
            {recentExpenses.map((expense) => (
              <tr
                key={expense._id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {expense.description}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {expense.category}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {new Date(expense.date).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  {expense.amount.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</section>
                                      {/* Expenses By Category Charts */}
<section className="mt-8">
  <ExpensesByCategoryChart data={expensesByCategory} />
</section>
    </Layout>
  );
}