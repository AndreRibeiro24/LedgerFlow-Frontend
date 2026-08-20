import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getClient = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/clients/${id}`);
        setClient(response.data);
      } catch (error) {
        console.error("Get client details error:", error);
        setError("Unable to load client details.");
      } finally {
        setLoading(false);
      }
    };

    getClient();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="text-slate-500">Loading client...</p>
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

  if (!client) {
    return (
      <Layout>
        <p className="text-slate-500">Client not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <button
          onClick={() => navigate("/clients")}
          className="mb-4 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to Clients
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Client Details
        </h1>

        <p className="mt-1 text-slate-500">
          Full information for {client.name}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-medium text-slate-900 mt-1">
              {client.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium text-slate-900 mt-1">
              {client.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="font-medium text-slate-900 mt-1">
              {client.phone}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Tax Number</p>
            <p className="font-medium text-slate-900 mt-1">
              {client.taxNumber}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Address</p>
            <p className="font-medium text-slate-900 mt-1">
              {client.address}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Notes</p>
            <p className="font-medium text-slate-900 mt-1 whitespace-pre-wrap">
              {client.notes || "No notes available."}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}