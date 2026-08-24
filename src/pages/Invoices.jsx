import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";

const emptyForm = {
  invoiceNumber: "",
  client: "",
  issueDate: "",
  dueDate: "",
  status: "draft",
  currency: "EUR",
  notes: "",

  billingDetails: {
    name: "",
    taxNumber: "",
    address: "",
    email: "",
  },

  issuerDetails: {
    name: "",
    taxNumber: "",
    address: "",
    email: "",
    iban: "",
  },

  items: [
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 23,
    },
  ],
};

export default function Invoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);

  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  // ---------------------------------------------
  // Fetch data
  // ---------------------------------------------

  const getInvoices = async () => {
    try {
      setLoading(true);

      const response = await api.get("/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error("Get invoices error:", error);
      setError("Unable to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  const getClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Get clients error:", error);
    }
  };

  useEffect(() => {
    getInvoices();
    getClients();
  }, []);

  useEffect(() => {
    document.body.style.overflow = formOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [formOpen]);

  // ---------------------------------------------
  // Standard form fields
  // ---------------------------------------------

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleBillingChange = (event) => {
    setFormData({
      ...formData,
      billingDetails: {
        ...formData.billingDetails,
        [event.target.name]: event.target.value,
      },
    });
  };

  const handleIssuerChange = (event) => {
    setFormData({
      ...formData,
      issuerDetails: {
        ...formData.issuerDetails,
        [event.target.name]: event.target.value,
      },
    });
  };

  // ---------------------------------------------
  // Invoice Items
  // ---------------------------------------------

  const handleItemChange = (index, event) => {
    const updatedItems = [...formData.items];

    updatedItems[index] = {
      ...updatedItems[index],

      [event.target.name]:
        event.target.name === "description"
          ? event.target.value
          : Number(event.target.value),
    };

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,

      items: [
        ...formData.items,
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          taxRate: 23,
        },
      ],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;

    setFormData({
      ...formData,

      items: formData.items.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    });
  };

  // ---------------------------------------------
  // Calculations
  // ---------------------------------------------

  const calculatedItems = useMemo(() => {
    return formData.items.map((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const taxRate = Number(item.taxRate) || 0;

      const baseTotal = quantity * unitPrice;
      const taxAmount = baseTotal * (taxRate / 100);
      const lineTotal = baseTotal + taxAmount;

      return {
        ...item,
        quantity,
        unitPrice,
        taxRate,
        baseTotal,
        taxAmount,
        lineTotal,
      };
    });
  }, [formData.items]);

  const subtotal = useMemo(() => {
    return calculatedItems.reduce(
      (sum, item) => sum + item.baseTotal,
      0
    );
  }, [calculatedItems]);

  const taxTotal = useMemo(() => {
    return calculatedItems.reduce(
      (sum, item) => sum + item.taxAmount,
      0
    );
  }, [calculatedItems]);

  const total = subtotal + taxTotal;

  // ---------------------------------------------
  // Form controls
  // ---------------------------------------------

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingInvoice(null);
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

  // ---------------------------------------------
  // Create / Update
  // ---------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,

        subtotal,
        taxTotal,
        total,

        items: calculatedItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          lineTotal: item.lineTotal,
        })),
      };

      if (editingInvoice) {
        await api.put(
          `/invoices/${editingInvoice._id}`,
          payload
        );
      } else {
        await api.post("/invoices", payload);
      }

      closeForm();
      await getInvoices();
    } catch (error) {
      console.error("Save invoice error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save invoice."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------
  // Edit
  // ---------------------------------------------

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);

    const clientId =
      typeof invoice.client === "object"
        ? invoice.client?._id
        : invoice.client;

    setFormData({
      invoiceNumber: invoice.invoiceNumber || "",
      client: clientId || "",

      issueDate: invoice.issueDate
        ? invoice.issueDate.split("T")[0]
        : "",

      dueDate: invoice.dueDate
        ? invoice.dueDate.split("T")[0]
        : "",

      status: invoice.status || "draft",
      currency: invoice.currency || "EUR",
      notes: invoice.notes || "",

      billingDetails: {
        name: invoice.billingDetails?.name || "",
        taxNumber:
          invoice.billingDetails?.taxNumber || "",
        address:
          invoice.billingDetails?.address || "",
        email:
          invoice.billingDetails?.email || "",
      },

      issuerDetails: {
        name: invoice.issuerDetails?.name || "",
        taxNumber:
          invoice.issuerDetails?.taxNumber || "",
        address:
          invoice.issuerDetails?.address || "",
        email:
          invoice.issuerDetails?.email || "",
        iban:
          invoice.issuerDetails?.iban || "",
      },

      items:
        invoice.items?.length > 0
          ? invoice.items.map((item) => ({
              description: item.description || "",
              quantity: item.quantity || 1,
              unitPrice: item.unitPrice || 0,
              taxRate: item.taxRate ?? 23,
            }))
          : [
              {
                description: "",
                quantity: 1,
                unitPrice: 0,
                taxRate: 23,
              },
            ],
    });

    setError("");
    setFormOpen(true);
  };

  // ---------------------------------------------
  // Delete
  // ---------------------------------------------

  const handleDelete = async (invoiceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/invoices/${invoiceId}`);

      setInvoices((currentInvoices) =>
        currentInvoices.filter(
          (invoice) => invoice._id !== invoiceId
        )
      );
    } catch (error) {
      console.error("Delete invoice error:", error);
      setError("Unable to delete invoice.");
    }
  };

  // ---------------------------------------------
  // Helpers
  // ---------------------------------------------

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
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2563EB]">
            Billing
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A]">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Create, manage and track your business invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
        >
          + New Invoice
        </button>
      </div>

      {error && !formOpen && (
        <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Invoice List */}
      <section className="overflow-hidden border border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
          <div>
            <p className="font-semibold text-[#0F172A]">
              Invoice List
            </p>

            <p className="mt-1 text-xs text-[#94A3B8]">
              {invoices.length} invoice
              {invoices.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#64748B]">
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-[#0F172A]">
              No invoices yet
            </p>

            <p className="mt-2 text-sm text-[#64748B]">
              Create your first invoice to start tracking revenue.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Create Invoice
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr className="border-b border-[#E2E8F0]">
                    <TableHeader>Invoice</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader align="right">
                      Total
                    </TableHeader>
                    <TableHeader align="right">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="border-b border-[#F1F5F9] transition last:border-b-0 hover:bg-[#F8FAFC]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {invoice.invoiceNumber}
                        </p>

                        <p className="mt-1 text-xs text-[#94A3B8]">
                          Due {formatDate(invoice.dueDate)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={invoice.status} />
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {formatDate(invoice.issueDate)}
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-semibold text-[#0F172A]">
                        {formatCurrency(invoice.total)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <ActionButton
                            onClick={() =>
                              navigate(
                                `/invoices/${invoice._id}`
                              )
                            }
                          >
                            View
                          </ActionButton>

                          <ActionButton
                            onClick={() =>
                              handleEdit(invoice)
                            }
                          >
                            Edit
                          </ActionButton>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(invoice._id)
                            }
                            className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2]"
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

            {/* Mobile Cards */}
            <div className="divide-y divide-[#E2E8F0] sm:hidden">
              {invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#0F172A]">
                        {invoice.invoiceNumber}
                      </p>

                      <p className="mt-1 text-xs text-[#94A3B8]">
                        {formatDate(invoice.issueDate)}
                      </p>
                    </div>

                    <StatusBadge status={invoice.status} />
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-[#94A3B8]">
                        Total
                      </p>

                      <p className="mt-1 font-bold text-[#0F172A]">
                        {formatCurrency(invoice.total)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <ActionButton
                        onClick={() =>
                          navigate(
                            `/invoices/${invoice._id}`
                          )
                        }
                      >
                        View
                      </ActionButton>

                      <ActionButton
                        onClick={() =>
                          handleEdit(invoice)
                        }
                      >
                        Edit
                      </ActionButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Create / Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center lg:p-6">
          <button
            type="button"
            aria-label="Close invoice form"
            onClick={closeForm}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
          />

          <div className="relative flex h-full w-full flex-col bg-[#F8FAFC] shadow-2xl lg:h-[94vh] lg:max-w-7xl lg:rounded-xl">
            {/* Modal Header */}
            <header className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold text-[#2563EB]">
                  {editingInvoice
                    ? "Edit invoice"
                    : "New invoice"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#0F172A]">
                  {editingInvoice
                    ? editingInvoice.invoiceNumber
                    : "Create Invoice"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-[#64748B] transition hover:bg-[#F1F5F9]"
              >
                ×
              </button>
            </header>

            {/* Scrollable Form */}
            <form
              id="invoice-form"
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-5 sm:p-7 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                  {/* Invoice Details */}
                  <FormSection
                    number="01"
                    title="Invoice Details"
                    description="Basic information that identifies the invoice."
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputField
                        label="Invoice Number"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handleChange}
                        placeholder="INV-0001"
                        required
                      />

                      <SelectField
                        label="Client"
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Select a client
                        </option>

                        {clients.map((client) => (
                          <option
                            key={client._id}
                            value={client._id}
                          >
                            {client.name}
                          </option>
                        ))}
                      </SelectField>

                      <InputField
                        label="Issue Date"
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleChange}
                        required
                      />

                      <InputField
                        label="Due Date"
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                      />

                      <SelectField
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">
                          Cancelled
                        </option>
                      </SelectField>

                      <SelectField
                        label="Currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        <option value="EUR">
                          EUR — Euro
                        </option>

                        <option value="USD">
                          USD — US Dollar
                        </option>

                        <option value="GBP">
                          GBP — Pound Sterling
                        </option>
                      </SelectField>
                    </div>
                  </FormSection>

                  {/* Invoice Items */}
                  <FormSection
                    number="02"
                    title="Invoice Items"
                    description="Add the products or services being billed."
                    action={
                      <button
                        type="button"
                        onClick={addItem}
                        className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-xs font-semibold text-[#2563EB] transition hover:bg-[#DBEAFE]"
                      >
                        + Add Item
                      </button>
                    }
                  >
                    <div className="space-y-4">
                      {formData.items.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#94A3B8]">
                                Item {index + 1}
                              </p>

                              {formData.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(index)
                                  }
                                  className="text-xs font-semibold text-[#DC2626] hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12">
                              {/* Description */}
                              <div className="lg:col-span-2 xl:col-span-4">
                                <InputField
                                  label="Description"
                                  name="description"
                                  value={item.description}
                                  onChange={(event) =>
                                    handleItemChange(
                                      index,
                                      event
                                    )
                                  }
                                  placeholder="Service or product"
                                  required
                                />
                              </div>

                              {/* Quantity */}
                              <div className="xl:col-span-2">
                                <InputField
                                  label="Quantity"
                                  type="number"
                                  name="quantity"
                                  value={item.quantity}
                                  onChange={(event) =>
                                    handleItemChange(
                                      index,
                                      event
                                    )
                                  }
                                  min="1"
                                  step="1"
                                  required
                                />
                              </div>

                              {/* Unit Price */}
                              <div className="xl:col-span-2">
                                <InputField
                                  label="Unit Price"
                                  type="number"
                                  name="unitPrice"
                                  value={item.unitPrice}
                                  onChange={(event) =>
                                    handleItemChange(
                                      index,
                                      event
                                    )
                                  }
                                  min="0"
                                  step="0.01"
                                  required
                                />
                              </div>

                              {/* VAT */}
                              <div className="xl:col-span-2">
                                <SelectField
                                  label="VAT"
                                  name="taxRate"
                                  value={item.taxRate}
                                  onChange={(event) =>
                                    handleItemChange(
                                      index,
                                      event
                                    )
                                  }
                                >
                                  <option value={0}>
                                    0% — Exempt
                                  </option>

                                  <option value={6}>
                                    6% — Reduced
                                  </option>

                                  <option value={13}>
                                    13% — Intermediate
                                  </option>

                                  <option value={23}>
                                    23% — Standard
                                  </option>
                                </SelectField>
                              </div>

                              {/* Line Total */}
                              <div className="xl:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                                  Total
                                </label>

                                <div className="flex h-[42px] items-center justify-end rounded-lg bg-white px-3 text-sm font-semibold text-[#0F172A] ring-1 ring-[#E2E8F0]">
                                  {formatCurrency(
                                    calculatedItems[index]
                                      ?.lineTotal
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Mobile item summary */}
                            <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-3 md:hidden">
                              <span className="text-xs text-[#64748B]">
                                Line total incl. VAT
                              </span>

                              <span className="text-sm font-bold text-[#2563EB]">
                                {formatCurrency(
                                  calculatedItems[index]
                                    ?.lineTotal
                                )}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </FormSection>

                  {/* Billing Details */}
                  <FormSection
                    number="03"
                    title="Billing Details"
                    description="Information shown for the customer receiving the invoice."
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputField
                        label="Name"
                        name="name"
                        value={formData.billingDetails.name}
                        onChange={handleBillingChange}
                        required
                      />

                      <InputField
                        label="Tax Number"
                        name="taxNumber"
                        value={
                          formData.billingDetails.taxNumber
                        }
                        onChange={handleBillingChange}
                        required
                      />

                      <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.billingDetails.email}
                        onChange={handleBillingChange}
                        required
                      />

                      <InputField
                        label="Address"
                        name="address"
                        value={formData.billingDetails.address}
                        onChange={handleBillingChange}
                        required
                      />
                    </div>
                  </FormSection>

                  {/* Issuer Details */}
                  <FormSection
                    number="04"
                    title="Issuer Details"
                    description="Your business information shown on the invoice."
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputField
                        label="Business Name"
                        name="name"
                        value={formData.issuerDetails.name}
                        onChange={handleIssuerChange}
                        required
                      />

                      <InputField
                        label="Tax Number"
                        name="taxNumber"
                        value={
                          formData.issuerDetails.taxNumber
                        }
                        onChange={handleIssuerChange}
                        required
                      />

                      <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.issuerDetails.email}
                        onChange={handleIssuerChange}
                        required
                      />

                      <InputField
                        label="Address"
                        name="address"
                        value={formData.issuerDetails.address}
                        onChange={handleIssuerChange}
                        required
                      />

                      <div className="sm:col-span-2">
                        <InputField
                          label="IBAN"
                          name="iban"
                          value={formData.issuerDetails.iban}
                          onChange={handleIssuerChange}
                          placeholder="PT50..."
                          required
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Notes */}
                  <FormSection
                    number="05"
                    title="Notes"
                    description="Optional information or payment instructions."
                  >
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Add any additional information..."
                      className="w-full resize-none rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100"
                    />
                  </FormSection>
                </div>

                {/* Sticky Summary */}
                <aside>
                  <div className="xl:sticky xl:top-0">
                    <div className="border border-[#E2E8F0] bg-white">
                      <div className="border-b border-[#E2E8F0] p-5">
                        <p className="text-sm font-semibold text-[#0F172A]">
                          Invoice Summary
                        </p>

                        <p className="mt-1 text-xs text-[#94A3B8]">
                          Totals update automatically.
                        </p>
                      </div>

                      <div className="space-y-4 p-5">
                        <SummaryRow
                          label="Subtotal"
                          value={formatCurrency(subtotal)}
                        />

                        <SummaryRow
                          label="VAT"
                          value={formatCurrency(taxTotal)}
                        />

                        <div className="border-t border-[#E2E8F0] pt-4">
                          <div className="flex items-end justify-between gap-4">
                            <span className="text-sm font-semibold text-[#475569]">
                              Total
                            </span>

                            <span className="text-2xl font-bold tracking-tight text-[#2563EB]">
                              {formatCurrency(total)}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-[#F1F5F9] pt-4 text-xs leading-5 text-[#94A3B8]">
                          {formData.items.length} item
                          {formData.items.length !== 1
                            ? "s"
                            : ""}{" "}
                          on this invoice.
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </form>

            {/* Modal Footer */}
            <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E2E8F0] bg-white px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>

              <button
                form="invoice-form"
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
              >
                {saving
                  ? "Saving..."
                  : editingInvoice
                    ? "Save Changes"
                    : "Create Invoice"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  );
}

/* ================================================= */
/* Local Components                                  */
/* ================================================= */

function FormSection({
  number,
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="border border-[#E2E8F0] bg-white">
      <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
        <div className="flex gap-4">
          <span className="mt-0.5 text-xs font-bold text-[#2563EB]">
            {number}
          </span>

          <div>
            <h3 className="font-semibold text-[#0F172A]">
              {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
              {description}
            </p>
          </div>
        </div>

        {action}
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function InputField({
  label,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
        {label}
      </label>

      <input
        type={type}
        {...props}
        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  label,
  children,
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100"
      >
        {children}
      </select>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#64748B]">
        {label}
      </span>

      <span className="text-sm font-semibold text-[#0F172A]">
        {value}
      </span>
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
      className={`px-6 py-3 ${alignment} text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]`}
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
      className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#475569] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: "bg-[#F0FDF4] text-[#15803D]",
    pending: "bg-[#EFF6FF] text-[#2563EB]",
    draft: "bg-[#F1F5F9] text-[#64748B]",
    overdue: "bg-[#FFFBEB] text-[#B45309]",
    cancelled: "bg-[#FEF2F2] text-[#DC2626]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        styles[status] ||
        "bg-[#F1F5F9] text-[#64748B]"
      }`}
    >
      {status}
    </span>
  );
}