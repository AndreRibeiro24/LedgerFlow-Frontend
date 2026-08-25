import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Register() {
  const {
    register,
    loading,
    authError,
  } = useContext(AuthContext);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [registerError, setRegisterError] = useState("");

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

  setRegisterError("");

  const result = await register(formData);

  if (!result?.success) {
    setRegisterError(
      result?.message ||
        "Unable to create account."
    );
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] transition-colors duration-200 dark:bg-[#0B1120] dark:text-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]"
          >
            Ledger
            <span className="text-[#2563EB] dark:text-[#60A5FA]">
              Flow
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                theme === "dark"
                  ? "Light mode"
                  : "Dark mode"
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B] dark:hover:text-[#F8FAFC]"
            >
              {theme === "dark" ? (
                <FiSun size={18} />
              ) : (
                <FiMoon size={18} />
              )}
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span className="hidden text-[#64748B] dark:text-[#94A3B8] sm:inline">
                Already have an account?
              </span>

              <Link
                to="/login"
                className="font-semibold text-[#2563EB] transition hover:text-[#1D4ED8] dark:text-[#60A5FA] dark:hover:text-[#93C5FD]"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 dark:border-[#1E40AF] dark:bg-[#172554]">
              <span className="h-2 w-2 rounded-full bg-[#2563EB] dark:bg-[#60A5FA]" />

              <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                Get started with LedgerFlow
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] md:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 leading-7 text-[#64748B] dark:text-[#94A3B8]">
              Start organizing your clients, invoices and business expenses
              in one workspace.
            </p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:p-8">

            {/* Registration error */}
            {authError && (
              <div className="mb-5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 dark:border-[#991B1B] dark:bg-[#450A0A]/40">
                <p className="text-sm font-semibold text-[#DC2626] dark:text-[#F87171]">
                  Registration failed
                </p>

                <p className="mt-1 text-sm text-[#B91C1C] dark:text-[#FCA5A5]">
                  {authError}
                </p>
              </div>
            )}
                {registerError && (
                <div className="mb-5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 dark:border-[#991B1B] dark:bg-[#450A0A]/40">
                    <p className="text-sm font-semibold text-[#DC2626] dark:text-[#F87171]">
                    Registration failed
                    </p>

                    <p className="mt-1 text-sm text-[#B91C1C] dark:text-[#FCA5A5]">
                    {registerError}
                    </p>
                </div>
                )}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]"
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
                  autoComplete="name"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B] dark:focus:border-[#3B82F6] dark:focus:ring-blue-950"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]"
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
                  autoComplete="email"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B] dark:focus:border-[#3B82F6] dark:focus:ring-blue-950"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]"
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
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-3 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F8FAFC] dark:placeholder:text-[#64748B] dark:focus:border-[#3B82F6] dark:focus:ring-blue-950"
                />

                {/* Password requirements */}
                <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-colors dark:border-[#243044] dark:bg-[#0F172A]">
                  <p className="mb-3 text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">
                    Your password must contain
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                className="w-full rounded-lg bg-[#2563EB] py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#CBD5E1] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] dark:disabled:bg-[#334155] dark:disabled:text-[#64748B]"
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-6 border-t border-[#E2E8F0] pt-6 text-center dark:border-[#243044]">
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#2563EB] transition hover:text-[#1D4ED8] dark:text-[#60A5FA] dark:hover:text-[#93C5FD]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#94A3B8] dark:text-[#64748B]">
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
            ? "bg-green-100 text-green-700 dark:bg-[#052E16] dark:text-[#4ADE80]"
            : "bg-slate-200 text-slate-500 dark:bg-[#1E293B] dark:text-[#64748B]"
        }`}
      >
        {valid ? "✓" : "•"}
      </span>

      <span
        className={`text-xs transition ${
          valid
            ? "text-green-700 dark:text-[#4ADE80]"
            : "text-[#64748B] dark:text-[#94A3B8]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}