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
      try {
        setLoading(true);

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
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#DBEAFE] border-t-[#2563EB]" />

            <p className="text-sm text-[#64748B]">
              Loading client information...
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
            Unable to load client
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
          >
            Back to Clients
          </button>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="border border-[#E2E8F0] bg-white p-8 text-center">
          <p className="font-semibold text-[#0F172A]">
            Client not found
          </p>

          <p className="mt-2 text-sm text-[#64748B]">
            This client may no longer exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
          >
            Back to Clients
          </button>
        </div>
      </Layout>
    );
  }

  const initials = client.name
    ? client.name
        .split(" ")
        .slice(0, 2)
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "CL";

  return (
    <Layout>
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/clients")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition hover:text-[#2563EB]"
      >
        <span>←</span>
        Back to Clients
      </button>

      {/* Header */}
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-lg font-bold text-[#2563EB]">
            {initials}
          </div>

          <div>
            <p className="text-sm font-semibold text-[#2563EB]">
              Client profile
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A]">
              {client.name}
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              Client information and billing details.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Main Information */}
        <section className="xl:col-span-2 border border-[#E2E8F0] bg-white">
          <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
            <p className="font-semibold text-[#0F172A]">
              Client Information
            </p>

            <p className="mt-1 text-xs text-[#94A3B8]">
              Contact and identification details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <DetailItem
              label="Name"
              value={client.name}
            />

            <DetailItem
              label="Email"
              value={client.email}
            />

            <DetailItem
              label="Phone"
              value={client.phone}
            />

            <DetailItem
              label="Tax Number"
              value={client.taxNumber}
            />

            <div className="sm:col-span-2">
              <DetailItem
                label="Address"
                value={client.address}
                last
              />
            </div>
          </div>
        </section>

        {/* Summary */}
        <aside className="border border-[#E2E8F0] bg-white">
          <div className="border-b border-[#E2E8F0] px-5 py-4">
            <p className="font-semibold text-[#0F172A]">
              Client Summary
            </p>

            <p className="mt-1 text-xs text-[#94A3B8]">
              Quick reference.
            </p>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                Client
              </p>

              <p className="mt-2 font-semibold text-[#0F172A]">
                {client.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                Contact
              </p>

              <p className="mt-2 text-sm text-[#475569] break-words">
                {client.email}
              </p>

              <p className="mt-1 text-sm text-[#475569]">
                {client.phone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                Tax Number
              </p>

              <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                {client.taxNumber}
              </p>
            </div>
          </div>
        </aside>

        {/* Notes */}
        <section className="xl:col-span-3 border border-[#E2E8F0] bg-white">
          <div className="border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
            <p className="font-semibold text-[#0F172A]">
              Notes
            </p>

            <p className="mt-1 text-xs text-[#94A3B8]">
              Additional information about this client.
            </p>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {client.notes ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#475569]">
                {client.notes}
              </p>
            ) : (
              <p className="text-sm text-[#94A3B8]">
                No notes have been added for this client.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function DetailItem({
  label,
  value,
  last = false,
}) {
  return (
    <div
      className={`px-5 py-5 sm:px-6 ${
        last
          ? ""
          : "border-b border-[#F1F5F9] sm:border-r sm:last:border-r-0"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-[#0F172A]">
        {value || "—"}
      </p>
    </div>
  );
}