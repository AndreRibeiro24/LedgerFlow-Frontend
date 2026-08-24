import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const passwordIsValid = Object.values(
    passwordRequirements
  ).every(Boolean);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!passwordIsValid) return;

    await register(formData);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-[#0F172A]"
          >
            Ledger<span className="text-[#2563EB]">Flow</span>
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline text-[#64748B]">
              Already have an account?
            </span>

            <Link
              to="/login"
              className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />

              <span className="text-xs font-semibold text-[#2563EB]">
                Get started with LedgerFlow
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]">
              Create your account
            </h1>

            <p className="mt-3 text-[#64748B] leading-7">
              Start organizing your clients, invoices and business
              expenses in one workspace.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-7 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[#0F172A] mb-2"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#0F172A] mb-2"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#0F172A] mb-2"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a secure password"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100"
                />

                {/* Password requirements */}
                <div className="mt-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                  <p className="text-xs font-semibold text-[#475569] mb-3">
                    Your password must contain
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <PasswordRequirement
                      valid={passwordRequirements.length}
                      text="8+ characters"
                    />

                    <PasswordRequirement
                      valid={passwordRequirements.uppercase}
                      text="Uppercase letter"
                    />

                    <PasswordRequirement
                      valid={passwordRequirements.lowercase}
                      text="Lowercase letter"
                    />

                    <PasswordRequirement
                      valid={passwordRequirements.number}
                      text="One number"
                    />

                    <PasswordRequirement
                      valid={passwordRequirements.special}
                      text="Special character"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !passwordIsValid}
                className="w-full rounded-lg bg-[#2563EB] py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
              <p className="text-sm text-[#64748B]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#94A3B8]">
            Manage your business finances with clarity.
          </p>
        </div>
      </main>
    </div>
  );
}

function PasswordRequirement({ valid, text }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
          valid
            ? "bg-green-100 text-green-700"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {valid ? "✓" : "•"}
      </span>

      <span
        className={`text-xs transition ${
          valid
            ? "text-green-700"
            : "text-[#64748B]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}