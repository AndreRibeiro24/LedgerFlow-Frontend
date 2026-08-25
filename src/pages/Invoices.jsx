import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";
import ConfirmModal from "../components/ConfirmModal";

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
      unitPrice: "",
      taxRate: 23,
    },
  ],
};

const parseDecimal = (value) => {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  const parsedValue = Number(
    String(value).replace(",", ".")
  );

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0;
};

export default function Invoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);

  const [editingInvoice, setEditingInvoice] =
    useState(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState(emptyForm);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const getInvoices = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/invoices");

      setInvoices(response.data);
    } catch (error) {
      console.error(
        "Get invoices error:",
        error
      );

      setError(
        "Unable to load invoices."
      );
    } finally {
      setLoading(false);
    }
  };

  const getClients = async () => {
    try {
      const response =
        await api.get("/clients");

      setClients(response.data);
    } catch (error) {
      console.error(
        "Get clients error:",
        error
      );
    }
  };

  useEffect(() => {
    getInvoices();
    getClients();
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      formOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [formOpen]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleBillingChange = (
    event
  ) => {
    setFormData({
      ...formData,

      billingDetails: {
        ...formData.billingDetails,
        [event.target.name]:
          event.target.value,
      },
    });
  };

  const handleIssuerChange = (
    event
  ) => {
    setFormData({
      ...formData,

      issuerDetails: {
        ...formData.issuerDetails,
        [event.target.name]:
          event.target.value,
      },
    });
  };

  const handleItemChange = (
    index,
    event
  ) => {
    const { name, value } = event.target;

    if (name === "unitPrice") {
      const decimalRegex =
        /^\d*[.,]?\d*$/;

      if (!decimalRegex.test(value)) {
        return;
      }
    }

    const updatedItems = [
      ...formData.items,
    ];

    updatedItems[index] = {
      ...updatedItems[index],

      [name]:
        name === "description" ||
        name === "unitPrice"
          ? value
          : Number(value),
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
          unitPrice: "",
          taxRate: 23,
        },
      ],
    });
  };

  const removeItem = (index) => {
    if (
      formData.items.length === 1
    )
      return;

    setFormData({
      ...formData,

      items:
        formData.items.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    });
  };

  const calculatedItems =
    useMemo(() => {
      return formData.items.map(
        (item) => {
          const quantity =
            Number(
              item.quantity
            ) || 0;

          const unitPrice =
            parseDecimal(
              item.unitPrice
            );

          const taxRate =
            Number(
              item.taxRate
            ) || 0;

          const baseTotal =
            quantity * unitPrice;

          const taxAmount =
            baseTotal *
            (taxRate / 100);

          const lineTotal =
            baseTotal +
            taxAmount;

          return {
            ...item,
            quantity,
            unitPrice,
            taxRate,
            baseTotal,
            taxAmount,
            lineTotal,
          };
        }
      );
    }, [formData.items]);

  const subtotal =
    useMemo(() => {
      return calculatedItems.reduce(
        (sum, item) =>
          sum + item.baseTotal,
        0
      );
    }, [calculatedItems]);

  const taxTotal =
    useMemo(() => {
      return calculatedItems.reduce(
        (sum, item) =>
          sum + item.taxAmount,
        0
      );
    }, [calculatedItems]);

  const total =
    subtotal + taxTotal;

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

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,

        subtotal,
        taxTotal,
        total,

        items:
          calculatedItems.map(
            (item) => ({
              description:
                item.description,

              quantity:
                item.quantity,

              unitPrice:
                item.unitPrice,

              taxRate:
                item.taxRate,

              lineTotal:
                item.lineTotal,
            })
          ),
      };

      if (editingInvoice) {
        await api.put(
          `/invoices/${editingInvoice._id}`,
          payload
        );
      } else {
        await api.post(
          "/invoices",
          payload
        );
      }

      closeForm();
      await getInvoices();
    } catch (error) {
      console.error(
        "Save invoice error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Unable to save invoice."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);

    const clientId =
      typeof invoice.client ===
      "object"
        ? invoice.client?._id
        : invoice.client;

    setFormData({
      invoiceNumber:
        invoice.invoiceNumber || "",

      client:
        clientId || "",

      issueDate:
        invoice.issueDate
          ? invoice.issueDate.split(
              "T"
            )[0]
          : "",

      dueDate:
        invoice.dueDate
          ? invoice.dueDate.split(
              "T"
            )[0]
          : "",

      status:
        invoice.status ||
        "draft",

      currency:
        invoice.currency ||
        "EUR",

      notes:
        invoice.notes || "",

      billingDetails: {
        name:
          invoice.billingDetails
            ?.name || "",

        taxNumber:
          invoice.billingDetails
            ?.taxNumber || "",

        address:
          invoice.billingDetails
            ?.address || "",

        email:
          invoice.billingDetails
            ?.email || "",
      },

      issuerDetails: {
        name:
          invoice.issuerDetails
            ?.name || "",

        taxNumber:
          invoice.issuerDetails
            ?.taxNumber || "",

        address:
          invoice.issuerDetails
            ?.address || "",

        email:
          invoice.issuerDetails
            ?.email || "",

        iban:
          invoice.issuerDetails
            ?.iban || "",
      },

      items:
        invoice.items?.length >
        0
          ? invoice.items.map(
              (item) => ({
                description:
                  item.description ||
                  "",

                quantity:
                  item.quantity ||
                  1,

                unitPrice:
                  item.unitPrice ??
                  "",

                taxRate:
                  item.taxRate ??
                  23,
              })
            )
          : [
              {
                description:
                  "",
                quantity: 1,
                unitPrice: "",
                taxRate: 23,
              },
            ],
    });

    setError("");
    setFormOpen(true);
  };

  const handleDelete = (invoice) => {
    setDeleteTarget(invoice);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) {
      setError("Invalid invoice selected.");
      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.delete(
        `/invoices/${deleteTarget._id}`
      );

      setInvoices(
        (currentInvoices) =>
          currentInvoices.filter(
            (invoice) =>
              invoice._id !==
              deleteTarget._id
          )
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error(
        "Delete invoice error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Unable to delete invoice."
      );

      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (
    value
  ) => {
    return new Intl.NumberFormat(
      "pt-PT",
      {
        style: "currency",
        currency: "EUR",
      }
    ).format(
      Number(value) || 0
    );
  };

  const formatDate = (value) => {
    if (!value) return "—";

    return new Intl.DateTimeFormat(
      "pt-PT"
    ).format(new Date(value));
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2563EB] dark:text-[#60A5FA]">
            Billing
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Create, manage and track your business
            invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openCreateForm
          }
          className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
        >
          + New Invoice
        </button>
      </div>

      {error &&
        !formOpen && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-[#7F1D1D] dark:bg-[#450A0A]/40 dark:text-[#FCA5A5]">
            {error}
          </div>
        )}

      {/* Invoice List */}
      <section className="overflow-hidden border border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-6">
          <div>
            <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Invoice List
            </p>

            <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
              {invoices.length} invoice
              {invoices.length !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
            Loading invoices...
          </div>
        ) : invoices.length ===
          0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              No invoices yet
            </p>

            <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Create your first invoice to start
              tracking revenue.
            </p>

            <button
              type="button"
              onClick={
                openCreateForm
              }
              className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
            >
              Create Invoice
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
                      Invoice
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader>
                      Date
                    </TableHeader>

                    <TableHeader align="right">
                      Total
                    </TableHeader>

                    <TableHeader align="right">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map(
                    (invoice) => (
                      <tr
                        key={
                          invoice._id
                        }
                        className="border-b border-[#F1F5F9] transition last:border-b-0 hover:bg-[#F8FAFC] dark:border-[#243044] dark:hover:bg-[#172033]"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                            {
                              invoice.invoiceNumber
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
                            Due{" "}
                            {formatDate(
                              invoice.dueDate
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            status={
                              invoice.status
                            }
                          />
                        </td>

                        <td className="px-6 py-4 text-sm text-[#64748B] dark:text-[#CBD5E1]">
                          {formatDate(
                            invoice.issueDate
                          )}
                        </td>

                        <td className="px-6 py-4 text-right text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                          {formatCurrency(
                            invoice.total
                          )}
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
                                handleEdit(
                                  invoice
                                )
                              }
                            >
                              Edit
                            </ActionButton>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  invoice
                                )
                              }
                              className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] dark:text-[#F87171] dark:hover:bg-[#450A0A]/40"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#E2E8F0] dark:divide-[#243044] sm:hidden">
              {invoices.map(
                (invoice) => (
                  <div
                    key={
                      invoice._id
                    }
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                          {
                            invoice.invoiceNumber
                          }
                        </p>

                        <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
                          {formatDate(
                            invoice.issueDate
                          )}
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          invoice.status
                        }
                      />
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-[#94A3B8] dark:text-[#64748B]">
                          Total
                        </p>

                        <p className="mt-1 font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                          {formatCurrency(
                            invoice.total
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
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
                            handleEdit(
                              invoice
                            )
                          }
                        >
                          Edit
                        </ActionButton>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              invoice
                            )
                          }
                          className="rounded-md bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#DC2626] dark:bg-[#450A0A]/40 dark:text-[#F87171]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
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
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] dark:bg-black/60"
          />

          <div className="relative flex h-full w-full flex-col bg-[#F8FAFC] shadow-2xl transition-colors duration-200 dark:bg-[#0B1120] lg:h-[94vh] lg:max-w-7xl lg:rounded-xl">
            <header className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-5 py-4 transition-colors dark:border-[#243044] dark:bg-[#111827] sm:px-7">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                  {editingInvoice
                    ? "Edit invoice"
                    : "New invoice"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {editingInvoice
                    ? editingInvoice.invoiceNumber
                    : "Create Invoice"}
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
              id="invoice-form"
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-5 sm:p-7 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                  <FormSection
                    number="01"
                    title="Invoice Details"
                    description="Basic information that identifies the invoice."
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputField
                        label="Invoice Number"
                        name="invoiceNumber"
                        value={
                          formData.invoiceNumber
                        }
                        onChange={handleChange}
                        placeholder="INV-0001"
                        required
                      />

                      <SelectField
                        label="Client"
                        name="client"
                        value={
                          formData.client
                        }
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Select a client
                        </option>

                        {clients.map(
                          (client) => (
                            <option
                              key={
                                client._id
                              }
                              value={
                                client._id
                              }
                            >
                              {
                                client.name
                              }
                            </option>
                          )
                        )}
                      </SelectField>

                      <InputField
                        label="Issue Date"
                        type="date"
                        name="issueDate"
                        value={
                          formData.issueDate
                        }
                        onChange={handleChange}
                        required
                      />

                      <InputField
                        label="Due Date"
                        type="date"
                        name="dueDate"
                        value={
                          formData.dueDate
                        }
                        onChange={handleChange}
                        required
                      />

                      <SelectField
                        label="Status"
                        name="status"
                        value={
                          formData.status
                        }
                        onChange={handleChange}
                      >
                        <option value="draft">
                          Draft
                        </option>

                        <option value="pending">
                          Pending
                        </option>

                        <option value="paid">
                          Paid
                        </option>

                        <option value="overdue">
                          Overdue
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </SelectField>

                      <SelectField
                        label="Currency"
                        name="currency"
                        value={
                          formData.currency
                        }
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

                  <FormSection
                    number="02"
                    title="Invoice Items"
                    description="Add the products or services being billed."
                    action={
                      <button
                        type="button"
                        onClick={
                          addItem
                        }
                        className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-xs font-semibold text-[#2563EB] transition hover:bg-[#DBEAFE] dark:border-[#1E40AF] dark:bg-[#172554] dark:text-[#60A5FA] dark:hover:bg-[#1E3A8A]"
                      >
                        + Add Item
                      </button>
                    }
                  >
                    <div className="space-y-4">
                      {formData.items.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={
                              index
                            }
                            className="border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-colors dark:border-[#243044] dark:bg-[#0F172A]"
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#94A3B8] dark:text-[#64748B]">
                                Item{" "}
                                {index +
                                  1}
                              </p>

                              {formData
                                .items
                                .length >
                                1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      index
                                    )
                                  }
                                  className="text-xs font-semibold text-[#DC2626] hover:underline dark:text-[#F87171]"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12">
                              <div className="lg:col-span-2 xl:col-span-4">
                                <InputField
                                  label="Description"
                                  name="description"
                                  value={
                                    item.description
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleItemChange(
                                      index,
                                      event
                                    )
                                  }
                                  placeholder="Service or product"
                                  required
                                />
                              </div>

                              <div className="xl:col-span-2">
                                <InputField
                                  label="Quantity"
                                  type="number"
                                  name="quantity"
                                  value={
                                    item.quantity
                                  }
                                  onChange={(
                                    event
                                  ) =>
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

                              <div className="xl:col-span-2">
                                <InputField
                                  label="Unit Price"
                                  type="text"
                                  inputMode="decimal"
                                  name="unitPrice"
                                  value={
                                    item.unitPrice
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleItemChange(
                                      index,
                                      event
                                    )
                                  }
                                  placeholder="0,00"
                                  required
                                />
                              </div>

                              <div className="xl:col-span-2">
                                <SelectField
                                  label="VAT"
                                  name="taxRate"
                                  value={
                                    item.taxRate
                                  }
                                  onChange={(
                                    event
                                  ) =>
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

                              <div className="xl:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                  Total
                                </label>

                                <div className="flex min-h-[42px] items-center justify-end whitespace-nowrap rounded-lg bg-white px-3 text-sm font-semibold text-[#0F172A] ring-1 ring-[#E2E8F0] dark:bg-[#111827] dark:text-[#F8FAFC] dark:ring-[#334155]">
                                  {formatCurrency(
                                    calculatedItems[
                                      index
                                    ]
                                      ?.lineTotal
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </FormSection>

                  <FormSection
                    number="03"
                    title="Billing Details"
                    description="Information shown for the customer receiving the invoice."
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputField
                        label="Name"
                        name="name"
                        value={
                          formData
                            .billingDetails
                            .name
                        }
                        onChange={
                          handleBillingChange
                        }
                        required
                      />

                      <InputField
                        label="Tax Number"
                        name="taxNumber"
                        value={
                          formData
                            .billingDetails
                            .taxNumber
                        }
                        onChange={
                          handleBillingChange
                        }
                        required
                      />

                      <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={
                          formData
                            .billingDetails
                            .email
                        }
                        onChange={
                          handleBillingChange
                        }
                        required
                      />

                      <InputField
                        label="Address"
                        name="address"
                        value={
                          formData
                            .billingDetails
                            .address
                        }
                        onChange={
                          handleBillingChange
                        }
                        required
                      />
                    </div>
                  </FormSection>

                  <FormSection
                    number="04"
                    title="Issuer Details"
                    description="Your business information shown on the invoice."
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputField
                        label="Business Name"
                        name="name"
                        value={
                          formData
                            .issuerDetails
                            .name
                        }
                        onChange={
                          handleIssuerChange
                        }
                        required
                      />

                      <InputField
                        label="Tax Number"
                        name="taxNumber"
                        value={
                          formData
                            .issuerDetails
                            .taxNumber
                        }
                        onChange={
                          handleIssuerChange
                        }
                        required
                      />

                      <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={
                          formData
                            .issuerDetails
                            .email
                        }
                        onChange={
                          handleIssuerChange
                        }
                        required
                      />

                      <InputField
                        label="Address"
                        name="address"
                        value={
                          formData
                            .issuerDetails
                            .address
                        }
                        onChange={
                          handleIssuerChange
                        }
                        required
                      />

                      <div className="sm:col-span-2">
                        <InputField
                          label="IBAN"
                          name="iban"
                          value={
                            formData
                              .issuerDetails
                              .iban
                          }
                          onChange={
                            handleIssuerChange
                          }
                          placeholder="PT50..."
                          required
                        />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    number="05"
                    title="Notes"
                    description="Optional information or payment instructions."
                  >
                    <textarea
                      name="notes"
                      value={
                        formData.notes
                      }
                      onChange={
                        handleChange
                      }
                      rows="4"
                      placeholder="Add any additional information..."
                      className="w-full resize-none rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B] dark:focus:border-[#3B82F6] dark:focus:ring-blue-950"
                    />
                  </FormSection>
                </div>

                <aside>
                  <div className="xl:sticky xl:top-0">
                    <div className="border border-[#E2E8F0] bg-white transition-colors dark:border-[#243044] dark:bg-[#111827]">
                      <div className="border-b border-[#E2E8F0] p-5 dark:border-[#243044]">
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                          Invoice Summary
                        </p>

                        <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
                          Totals update automatically.
                        </p>
                      </div>

                      <div className="space-y-4 p-5">
                        <SummaryRow
                          label="Subtotal"
                          value={formatCurrency(
                            subtotal
                          )}
                        />

                        <SummaryRow
                          label="VAT"
                          value={formatCurrency(
                            taxTotal
                          )}
                        />

                        <div className="border-t border-[#E2E8F0] pt-4 dark:border-[#243044]">
                          <div className="flex items-end justify-between gap-4">
                            <span className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1]">
                              Total
                            </span>

                            <span className="text-2xl font-bold tracking-tight text-[#2563EB] dark:text-[#60A5FA]">
                              {formatCurrency(
                                total
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-[#F1F5F9] pt-4 text-xs leading-5 text-[#94A3B8] dark:border-[#243044] dark:text-[#64748B]">
                          {
                            formData
                              .items
                              .length
                          }{" "}
                          item
                          {formData
                            .items
                            .length !==
                          1
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

            <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E2E8F0] bg-white px-5 py-4 transition-colors dark:border-[#243044] dark:bg-[#111827] sm:px-7">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:text-[#CBD5E1] dark:hover:bg-[#172033]"
              >
                Cancel
              </button>

              <button
                form="invoice-form"
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#94A3B8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
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

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete invoice?"
        message={
          deleteTarget
            ? `Are you sure you want to delete invoice ${deleteTarget.invoiceNumber}? This invoice will be permanently removed.`
            : ""
        }
        confirmLabel="Delete Invoice"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  );
}

function FormSection({
  number,
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="border border-[#E2E8F0] bg-white transition-colors dark:border-[#243044] dark:bg-[#111827]">
      <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-6">
        <div className="flex gap-4">
          <span className="mt-0.5 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">
            {number}
          </span>

          <div>
            <h3 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              {title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#94A3B8] dark:text-[#64748B]">
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

function SelectField({
  label,
  children,
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:focus:border-[#3B82F6] dark:focus:ring-blue-950"
      >
        {children}
      </select>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
        {label}
      </span>

      <span className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
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
      className={`px-6 py-3 ${alignment} text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8] dark:text-[#64748B]`}
    >
      {children}
    </th>
  );
}

function ActionButton({
  children,
  ...props
}) {
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