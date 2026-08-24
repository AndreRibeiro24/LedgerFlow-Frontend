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
      try {
        setLoading(true);

        const response = await api.get(
          `/invoices/${id}`
        );

        setInvoice(response.data);
      } catch (error) {
        console.error(
          "Get invoice details error:",
          error
        );

        setError(
          "Unable to load invoice details."
        );
      } finally {
        setLoading(false);
      }
    };

    getInvoice();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: invoice?.currency || "EUR",
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
              Loading invoice...
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
            Unable to load invoice
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/invoices")
            }
            className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Back to Invoices
          </button>
        </div>
      </Layout>
    );
  }

  if (!invoice) {
    return (
      <Layout>
        <div className="border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="font-semibold text-[#0F172A]">
            Invoice not found
          </p>

          <p className="mt-2 text-sm text-[#64748B]">
            This invoice may no longer exist.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/invoices")
            }
            className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Back to Invoices
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition hover:text-[#2563EB]"
        >
          <span>←</span>
          Back to Invoices
        </button>

        <div className="flex items-center gap-3">
          <StatusBadge status={invoice.status} />

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          >
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <article className="mx-auto max-w-5xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm print:max-w-none print:border-0 print:shadow-none">
        {/* Brand Accent */}
        <div className="h-1.5 bg-[#2563EB]" />

        <div className="p-6 sm:p-10 lg:p-12">
          {/* Invoice Header */}
          <header className="flex flex-col gap-8 border-b border-[#E2E8F0] pb-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Brand */}
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
                  Ledger
                </span>

                <span className="text-2xl font-bold tracking-tight text-[#2563EB]">
                  Flow
                </span>
              </div>

              <p className="mt-2 max-w-xs text-sm leading-6 text-[#64748B]">
                Business finance management
              </p>
            </div>

            {/* Invoice Identification */}
            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94A3B8]">
                Invoice
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">
                {invoice.invoiceNumber}
              </h1>

              <div className="mt-3 flex sm:justify-end">
                <StatusBadge status={invoice.status} />
              </div>
            </div>
          </header>

          {/* Invoice Metadata */}
          <section className="grid grid-cols-2 gap-5 border-b border-[#E2E8F0] py-6 sm:grid-cols-4">
            <MetaItem
              label="Issue Date"
              value={formatDate(
                invoice.issueDate
              )}
            />

            <MetaItem
              label="Due Date"
              value={formatDate(
                invoice.dueDate
              )}
            />

            <MetaItem
              label="Currency"
              value={
                invoice.currency || "EUR"
              }
            />

            <MetaItem
              label="Status"
              value={
                <span className="capitalize">
                  {invoice.status}
                </span>
              }
            />
          </section>

          {/* From / Bill To */}
          <section className="grid grid-cols-1 gap-10 border-b border-[#E2E8F0] py-8 md:grid-cols-2">
            {/* Issuer */}
            <AddressBlock
              label="From"
              name={
                invoice.issuerDetails?.name
              }
              taxNumber={
                invoice.issuerDetails
                  ?.taxNumber
              }
              address={
                invoice.issuerDetails
                  ?.address
              }
              email={
                invoice.issuerDetails?.email
              }
              iban={
                invoice.issuerDetails?.iban
              }
            />

            {/* Client */}
            <AddressBlock
              label="Bill To"
              name={
                invoice.billingDetails?.name
              }
              taxNumber={
                invoice.billingDetails
                  ?.taxNumber
              }
              address={
                invoice.billingDetails
                  ?.address
              }
              email={
                invoice.billingDetails?.email
              }
            />
          </section>

          {/* Items */}
          <section className="py-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#0F172A]">
                  Invoice Items
                </h2>

                <p className="mt-1 text-xs text-[#94A3B8]">
                  Products and services included in this invoice.
                </p>
              </div>

              <p className="text-xs font-semibold text-[#94A3B8]">
                {invoice.items?.length || 0} item
                {invoice.items?.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            {/* Item Table */}
            <div className="overflow-x-auto border border-[#E2E8F0]">
              <table className="w-full min-w-[680px]">
                <thead className="bg-[#F8FAFC]">
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                      Description
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                      Qty
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                      Unit Price
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                      VAT
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {invoice.items?.map(
                    (item, index) => (
                      <tr
                        key={
                          item._id || index
                        }
                        className="border-b border-[#F1F5F9] last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-[#0F172A]">
                            {item.description}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-[#475569]">
                          {item.quantity}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right text-sm text-[#475569]">
                          {formatCurrency(
                            item.unitPrice
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-[#475569]">
                          {item.taxRate}%
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-[#0F172A]">
                          {formatCurrency(
                            item.lineTotal
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Section */}
          <section className="grid grid-cols-1 gap-8 border-t border-[#E2E8F0] pt-8 md:grid-cols-2">
            {/* Notes / Payment */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                Notes
              </p>

              {invoice.notes ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#475569]">
                  {invoice.notes}
                </p>
              ) : (
                <p className="mt-3 text-sm text-[#94A3B8]">
                  No additional notes.
                </p>
              )}

              {invoice.issuerDetails?.iban && (
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                    Payment Details
                  </p>

                  <p className="mt-2 text-sm text-[#475569]">
                    IBAN
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-[#0F172A]">
                    {
                      invoice.issuerDetails
                        .iban
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="md:ml-auto md:w-full md:max-w-sm">
              <div className="space-y-4">
                <TotalRow
                  label="Subtotal"
                  value={formatCurrency(
                    invoice.subtotal
                  )}
                />

                <TotalRow
                  label="VAT"
                  value={formatCurrency(
                    invoice.taxTotal
                  )}
                />

                <div className="border-t-2 border-[#0F172A] pt-4">
                  <div className="flex items-end justify-between gap-6">
                    <span className="text-base font-bold text-[#0F172A]">
                      Total
                    </span>

                    <span className="whitespace-nowrap text-2xl font-bold tracking-tight text-[#2563EB]">
                      {formatCurrency(
                        invoice.total
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t border-[#E2E8F0] pt-6">
            <div className="flex flex-col gap-3 text-xs text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
              <p>
                Generated with LedgerFlow
              </p>

              <p>
                Invoice {invoice.invoiceNumber}
              </p>
            </div>
          </footer>
        </div>
      </article>
    </Layout>
  );
}

/* ================================================= */
/* Components                                        */
/* ================================================= */

function MetaItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
        {label}
      </p>

      <div className="mt-2 text-sm font-semibold text-[#0F172A]">
        {value || "—"}
      </div>
    </div>
  );
}

function AddressBlock({
  label,
  name,
  taxNumber,
  address,
  email,
  iban,
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2563EB]">
        {label}
      </p>

      <p className="mt-3 text-lg font-bold text-[#0F172A]">
        {name || "—"}
      </p>

      <div className="mt-3 space-y-1.5 text-sm leading-6 text-[#64748B]">
        {taxNumber && (
          <p>
            Tax Number:{" "}
            <span className="font-medium text-[#475569]">
              {taxNumber}
            </span>
          </p>
        )}

        {address && (
          <p className="max-w-md">
            {address}
          </p>
        )}

        {email && (
          <p className="break-words">
            {email}
          </p>
        )}

        {iban && (
          <p className="break-all">
            IBAN: {iban}
          </p>
        )}
      </div>
    </div>
  );
}

function TotalRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm text-[#64748B]">
        {label}
      </span>

      <span className="whitespace-nowrap text-sm font-semibold text-[#0F172A]">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid:
      "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",

    pending:
      "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",

    draft:
      "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",

    overdue:
      "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",

    cancelled:
      "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${
        styles[status] ||
        "border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B]"
      }`}
    >
      {status}
    </span>
  );
}