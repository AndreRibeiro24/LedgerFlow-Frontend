import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  taxNumber: "",
  address: "",
  notes: "",
};

export default function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  const getClients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Get clients error:", error);
      setError("Unable to load clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    document.body.style.overflow = formOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [formOpen]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingClient(null);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingClient) {
        await api.put(
          `/clients/${editingClient._id}`,
          formData
        );
      } else {
        await api.post("/clients", formData);
      }

      closeForm();
      await getClients();
    } catch (error) {
      console.error("Save client error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save client."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);

    setFormData({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      taxNumber: client.taxNumber || "",
      address: client.address || "",
      notes: client.notes || "",
    });

    setError("");
    setFormOpen(true);
  };

  const handleDelete = async (clientId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/clients/${clientId}`);

      setClients((currentClients) =>
        currentClients.filter(
          (client) => client._id !== clientId
        )
      );
    } catch (error) {
      console.error("Delete client error:", error);
      setError("Unable to delete client.");
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2563EB] dark:text-[#60A5FA]">
            Customers
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Clients
          </h1>

          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Manage your client information and billing details.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
        >
          + New Client
        </button>
      </div>

      {error && !formOpen && (
        <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-[#7F1D1D] dark:bg-[#450A0A]/40 dark:text-[#FCA5A5]">
          {error}
        </div>
      )}

      {/* Client List */}
      <section className="overflow-hidden border border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]">
        <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6 dark:border-[#243044]">
          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            Client List
          </p>

          <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
            {clients.length} client
            {clients.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              No clients yet
            </p>

            <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Add your first client to start creating invoices.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
            >
              Add Client
            </button>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A]">
                  <tr className="border-b border-[#E2E8F0] dark:border-[#243044]">
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>
                      Tax Number
                    </TableHeader>
                    <TableHeader align="right">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client._id}
                      className="border-b border-[#F1F5F9] transition last:border-b-0 hover:bg-[#F8FAFC] dark:border-[#243044] dark:hover:bg-[#172033]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                          {client.name}
                        </p>

                        <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
                          {client.phone}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B] dark:text-[#CBD5E1]">
                        {client.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B] dark:text-[#CBD5E1]">
                        {client.taxNumber}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <ActionButton
                            onClick={() =>
                              navigate(
                                `/clients/${client._id}`
                              )
                            }
                          >
                            View
                          </ActionButton>

                          <ActionButton
                            onClick={() =>
                              handleEdit(client)
                            }
                          >
                            Edit
                          </ActionButton>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(client._id)
                            }
                            className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] dark:text-[#F87171] dark:hover:bg-[#450A0A]/40"
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

            {/* Mobile */}
            <div className="divide-y divide-[#E2E8F0] dark:divide-[#243044] sm:hidden">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className="p-5"
                >
                  <div>
                    <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      {client.name}
                    </p>

                    <p className="mt-1 text-sm text-[#64748B] dark:text-[#CBD5E1]">
                      {client.email}
                    </p>

                    <p className="mt-1 text-xs text-[#94A3B8] dark:text-[#64748B]">
                      {client.phone}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionButton
                      onClick={() =>
                        navigate(
                          `/clients/${client._id}`
                        )
                      }
                    >
                      View
                    </ActionButton>

                    <ActionButton
                      onClick={() =>
                        handleEdit(client)
                      }
                    >
                      Edit
                    </ActionButton>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(client._id)
                      }
                      className="rounded-md bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#DC2626] dark:bg-[#450A0A]/40 dark:text-[#F87171]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Create / Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6">
          <button
            type="button"
            aria-label="Close client form"
            onClick={closeForm}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] dark:bg-black/60"
          />

          <div className="relative flex max-h-full w-full flex-col bg-white shadow-2xl transition-colors duration-200 dark:bg-[#111827] sm:max-w-2xl sm:rounded-xl">
            <header className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-7">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                  {editingClient
                    ? "Edit client"
                    : "New client"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {editingClient
                    ? editingClient.name
                    : "Add Client"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-[#64748B] transition hover:bg-[#F1F5F9] dark:text-[#94A3B8] dark:hover:bg-[#172033] dark:hover:text-[#F8FAFC]"
              >
                ×
              </button>
            </header>

            <form
              id="client-form"
              onSubmit={handleSubmit}
              className="overflow-y-auto"
            >
              <div className="p-5 sm:p-7">
                {error && (
                  <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-[#7F1D1D] dark:bg-[#450A0A]/40 dark:text-[#FCA5A5]">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Client name"
                    required
                  />

                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="client@example.com"
                    required
                  />

                  <InputField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+351..."
                    required
                  />

                  <InputField
                    label="Tax Number"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    placeholder="Tax identification number"
                    required
                  />

                  <div className="sm:col-span-2">
                    <InputField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Billing address"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      Notes
                    </label>

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Optional notes about this client..."
                      className="w-full resize-none rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B] dark:focus:border-[#3B82F6] dark:focus:ring-blue-950"
                    />
                  </div>
                </div>
              </div>
            </form>

            <footer className="flex justify-end gap-3 border-t border-[#E2E8F0] px-5 py-4 dark:border-[#243044] sm:px-7">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:text-[#CBD5E1] dark:hover:bg-[#172033]"
              >
                Cancel
              </button>

              <button
                form="client-form"
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#94A3B8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
              >
                {saving
                  ? "Saving..."
                  : editingClient
                    ? "Save Changes"
                    : "Create Client"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
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

function ActionButton({ children, ...props }) {
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