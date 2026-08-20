import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import {useNavigate} from "react-router-dom"



export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    taxNumber: "",
    address: "",
    notes: "",
  });

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

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      taxNumber: "",
      address: "",
      notes: "",
    });

    setEditingClient(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (editingClient) {
        await api.put(`/clients/${editingClient._id}`, formData);
      } else {
        await api.post("/clients", formData);
      }

      resetForm();
      await getClients();
    } catch (error) {
      console.error("Save client error:", error);

      setError(
        error.response?.data?.message || "Unable to save client."
      );
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Clients
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your business clients
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Client Form */}
        <section className="xl:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingClient
                ? "Edit Client"
                : "Add Client"}
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tax Number
                </label>

                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800 transition"
                >
                  {editingClient
                    ? "Update Client"
                    : "Create Client"}
                </button>

                {editingClient && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Clients List */}
        <section className="xl:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Client List
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {clients.length} client
                {clients.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <p className="p-6 text-slate-500">
                Loading clients...
              </p>
            ) : clients.length === 0 ? (
              <p className="p-6 text-slate-500">
                No clients available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                        Name
                      </th>

                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                        Email
                      </th>

                      <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">
                        Tax Number
                      </th>

                      <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client._id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {client.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {client.phone}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {client.email}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {client.taxNumber}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                                  onClick={() => navigate(`/clients/${client._id}`)}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                            >
                                    View
                            </button>
                            <button
                              onClick={() =>
                                handleEdit(client)
                              }
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(client._id)
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
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