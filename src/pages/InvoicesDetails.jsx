import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getInvoice = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/invoices/${id}`);
        setInvoice(response.data);
      } catch (error) {
        console.error("Get invoice details error:", error);
        setError("Unable to load invoice details.");
      } finally {
        setLoading(false);
      }
    };

    getInvoice();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="text-slate-500">Loading invoice...</p>
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

  if (!invoice) {
    return (
      <Layout>
        <p className="text-slate-500">Invoice not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <button
          onClick={() => navigate("/invoices")}
          className="mb-4 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Invoices
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {invoice.invoiceNumber}
            </h1>

            <p className="mt-1 text-slate-500">
              Invoice details
            </p>
          </div>

          <span className="capitalize rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {invoice.status}
          </span>
        </div>
      </div>

      <div className="space-y-8">

        {/* Invoice Information */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Invoice Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-500">
                Issue Date
              </p>

              <p className="font-medium text-slate-900 mt-1">
                {new Date(
                  invoice.issueDate
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Due Date
              </p>

              <p className="font-medium text-slate-900 mt-1">
                {new Date(
                  invoice.dueDate
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Currency
              </p>

              <p className="font-medium text-slate-900 mt-1">
                {invoice.currency}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Status
              </p>

              <p className="font-medium text-slate-900 mt-1 capitalize">
                {invoice.status}
              </p>
            </div>
          </div>
        </section>

        {/* Billing / Issuer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Bill To
            </h2>

            <div className="space-y-2 text-slate-700">
              <p className="font-semibold text-slate-900">
                {invoice.billingDetails?.name}
              </p>

              <p>
                Tax Number:{" "}
                {invoice.billingDetails?.taxNumber}
              </p>

              <p>
                {invoice.billingDetails?.address}
              </p>

              <p>
                {invoice.billingDetails?.email}
              </p>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Issued By
            </h2>

            <div className="space-y-2 text-slate-700">
              <p className="font-semibold text-slate-900">
                {invoice.issuerDetails?.name}
              </p>

              <p>
                Tax Number:{" "}
                {invoice.issuerDetails?.taxNumber}
              </p>

              <p>
                {invoice.issuerDetails?.address}
              </p>

              <p>
                {invoice.issuerDetails?.email}
              </p>

              <p>
                IBAN: {invoice.issuerDetails?.iban}
              </p>
            </div>
          </section>
        </div>

        {/* Items */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Invoice Items
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                    Description
                  </th>

                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">
                    Quantity
                  </th>

                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">
                    Unit Price
                  </th>

                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">
                    Tax
                  </th>

                  <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.description}
                    </td>

                    <td className="px-6 py-4 text-right text-slate-600">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-4 text-right text-slate-600">
                      {Number(item.unitPrice).toFixed(2)} €
                    </td>

                    <td className="px-6 py-4 text-right text-slate-600">
                      {item.taxRate}%
                    </td>

                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {Number(item.lineTotal).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Totals */}
        <section className="flex justify-end">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 w-full md:w-96 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium">
                {Number(invoice.subtotal).toFixed(2)} €
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Tax
              </span>

              <span className="font-medium">
                {Number(invoice.taxTotal).toFixed(2)} €
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>
                {Number(invoice.total).toFixed(2)} €
              </span>
            </div>
          </div>
        </section>

        {/* Notes */}
        {invoice.notes && (
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Notes
            </h2>

            <p className="text-slate-700 whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </section>
        )}

      </div>
    </Layout>
  );
}