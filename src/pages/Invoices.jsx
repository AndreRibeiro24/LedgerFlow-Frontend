import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  });

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
        lineTotal,
        baseTotal,
        taxAmount,
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

  const resetForm = () => {
    setFormData({
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
    });

    setEditingInvoice(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
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

      resetForm();
      await getInvoices();
    } catch (error) {
      console.error("Save invoice error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save invoice."
      );
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);

    setFormData({
      invoiceNumber: invoice.invoiceNumber || "",
      client: invoice.client || "",
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
        email: invoice.billingDetails?.email || "",
      },

      issuerDetails: {
        name: invoice.issuerDetails?.name || "",
        taxNumber:
          invoice.issuerDetails?.taxNumber || "",
        address:
          invoice.issuerDetails?.address || "",
        email: invoice.issuerDetails?.email || "",
        iban: invoice.issuerDetails?.iban || "",
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Invoices
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your invoices and billing
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Invoice Form */}
        <section className="xl:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingInvoice
                ? "Edit Invoice"
                : "Create Invoice"}
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Invoice Number
                </label>

                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Client
                </label>

                <select
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Issue Date
                  </label>

                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Currency
                  </label>

                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-900">
                    Invoice Items
                  </h3>

                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm font-medium text-slate-700 hover:text-slate-900"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-lg p-4 space-y-3"
                    >
                      <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={item.description}
                        onChange={(event) =>
                          handleItemChange(index, event)
                        }
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          name="quantity"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            handleItemChange(index, event)
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2"
                        />

                        <input
                          type="number"
                          name="unitPrice"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(event) =>
                            handleItemChange(index, event)
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2"
                        />

                        <input
                          type="number"
                          name="taxRate"
                          min="0"
                          value={item.taxRate}
                          onChange={(event) =>
                            handleItemChange(index, event)
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-500">
                          Total:{" "}
                          {calculatedItems[
                            index
                          ]?.lineTotal.toFixed(2)}{" "}
                          €
                        </p>

                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(index)
                            }
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-medium">
                    {subtotal.toFixed(2)} €
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Tax
                  </span>

                  <span className="font-medium">
                    {taxTotal.toFixed(2)} €
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>

                  <span>
                    {total.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Billing */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Billing Details
                </h3>

                <div className="space-y-3">
                  {[
                    ["name", "Name"],
                    ["taxNumber", "Tax Number"],
                    ["address", "Address"],
                    ["email", "Email"],
                  ].map(([name, label]) => (
                    <input
                      key={name}
                      type={
                        name === "email"
                          ? "email"
                          : "text"
                      }
                      name={name}
                      placeholder={label}
                      value={
                        formData.billingDetails[name]
                      }
                      onChange={handleBillingChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  ))}
                </div>
              </div>

              {/* Issuer */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Issuer Details
                </h3>

                <div className="space-y-3">
                  {[
                    ["name", "Name"],
                    ["taxNumber", "Tax Number"],
                    ["address", "Address"],
                    ["email", "Email"],
                    ["iban", "IBAN"],
                  ].map(([name, label]) => (
                    <input
                      key={name}
                      type={
                        name === "email"
                          ? "email"
                          : "text"
                      }
                      name={name}
                      placeholder={label}
                      value={
                        formData.issuerDetails[name]
                      }
                      onChange={handleIssuerChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  ))}
                </div>
              </div>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
                rows="3"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800"
                >
                  {editingInvoice
                    ? "Update Invoice"
                    : "Create Invoice"}
                </button>

                {editingInvoice && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 px-4 py-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Invoice List */}
        <section className="xl:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Invoice List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {invoices.length} invoice
                {invoices.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <p className="p-6 text-slate-500">
                Loading invoices...
              </p>
            ) : invoices.length === 0 ? (
              <p className="p-6 text-slate-500">
                No invoices available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm text-slate-500">
                        Invoice
                      </th>

                      <th className="text-left px-6 py-3 text-sm text-slate-500">
                        Status
                      </th>

                      <th className="text-left px-6 py-3 text-sm text-slate-500">
                        Date
                      </th>

                      <th className="text-right px-6 py-3 text-sm text-slate-500">
                        Total
                      </th>

                      <th className="text-right px-6 py-3 text-sm text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice._id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {invoice.invoiceNumber}
                        </td>

                        <td className="px-6 py-4 capitalize text-slate-600">
                          {invoice.status}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {new Date(
                            invoice.issueDate
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right font-medium">
                          {Number(
                            invoice.total
                          ).toFixed(2)}{" "}
                          €
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                                onClick={() =>
                                    navigate(`/invoices/${invoice._id}`)
                                }
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                >
                                View
                                </button>
                            <button
                              onClick={() =>
                                handleEdit(invoice)
                              }
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(invoice._id)
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
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
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}