import { useContext } from "react";
import { Link } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";

import { ThemeContext } from "../context/ThemeContext";

export default function Landing() {
  const { theme, toggleTheme } = useContext(ThemeContext);

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

          <nav className="flex items-center gap-3 sm:gap-5">
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

            <Link
              to="/login"
              className="text-sm font-medium text-[#475569] transition hover:text-[#0F172A] dark:text-[#CBD5E1] dark:hover:text-white"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Hero Copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 dark:border-[#1E40AF] dark:bg-[#172554]">
                <span className="h-2 w-2 rounded-full bg-[#2563EB] dark:bg-[#60A5FA]" />

                <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                  Business finance management
                </span>
              </div>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[#0F172A] dark:text-[#F8FAFC] md:text-6xl lg:text-7xl">
                Your finances.
                <br />

                <span className="text-[#2563EB] dark:text-[#60A5FA]">
                  One clear view.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[#475569] dark:text-[#94A3B8]">
                Manage clients, invoices and expenses from one simple
                workspace and understand how your business is performing.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="rounded-lg border border-[#CBD5E1] bg-white px-6 py-3 font-semibold text-[#0F172A] transition hover:border-[#94A3B8] hover:bg-slate-50 dark:border-[#334155] dark:bg-[#111827] dark:text-[#CBD5E1] dark:hover:border-[#475569] dark:hover:bg-[#172033] dark:hover:text-white"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                      Financial overview
                    </p>

                    <p className="mt-1 text-xl font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      This month
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-[#172554]">
                    <div className="h-3 w-3 rounded-full bg-[#2563EB] dark:bg-[#60A5FA]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <PreviewMetric
                    label="Revenue"
                    value="€8,420"
                    positive
                  />

                  <PreviewMetric
                    label="Expenses"
                    value="€2,180"
                  />

                  <PreviewMetric
                    label="Profit"
                    value="€6,240"
                    positive
                  />
                </div>

                {/* Fake chart */}
                <div className="mt-10">
                  <div className="flex h-40 items-end gap-3">
                    {[
                      40, 64, 50, 85, 68, 100, 82, 115, 94, 130, 112,
                      145,
                    ].map((height, index) => (
                      <div
                        key={index}
                        className="relative flex-1 rounded-t bg-blue-100 dark:bg-[#1E3A8A]/50"
                        style={{ height }}
                      >
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-t bg-[#2563EB] dark:bg-[#3B82F6]"
                          style={{
                            height: `${Math.max(height * 0.65, 15)}px`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-sm font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                Everything in one place
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] md:text-4xl">
                Built to keep your finances organized.
              </h2>

              <p className="mt-4 leading-7 text-[#64748B] dark:text-[#94A3B8]">
                Less time moving between spreadsheets and more time
                understanding your business.
              </p>
            </div>

            <div className="grid grid-cols-1 border-t border-[#E2E8F0] dark:border-[#243044] md:grid-cols-2 lg:grid-cols-4">
              <Feature
                number="01"
                title="Dashboard"
                text="Monitor revenue, expenses, profit and invoice activity."
              />

              <Feature
                number="02"
                title="Clients"
                text="Keep contact and billing information organized."
              />

              <Feature
                number="03"
                title="Invoices"
                text="Create, manage and track your business invoices."
              />

              <Feature
                number="04"
                title="Expenses"
                text="Track your spending and understand where money goes."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col gap-8 rounded-2xl bg-[#0F172A] px-8 py-12 dark:border dark:border-[#243044] dark:bg-[#111827] md:px-12 md:py-14 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold text-blue-300">
                Get started today
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Take control of your business finances.
              </h2>

              <p className="mt-3 max-w-xl text-slate-400">
                Your clients, invoices and expenses — organized in one
                workspace.
              </p>
            </div>

            <Link
              to="/register"
              className="self-start whitespace-nowrap rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] lg:self-auto"
            >
              Create an account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
            Ledger
            <span className="text-[#2563EB] dark:text-[#60A5FA]">
              Flow
            </span>
          </p>

          <p className="text-sm text-[#94A3B8] dark:text-[#64748B]">
            Simple financial management for your business.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ number, title, text }) {
  return (
    <div className="border-b border-[#E2E8F0] py-8 dark:border-[#243044] lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0">
      <p className="mb-8 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">
        {number}
      </p>

      <h3 className="mb-3 text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
        {title}
      </h3>

      <p className="text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
        {text}
      </p>
    </div>
  );
}

function PreviewMetric({ label, value, positive }) {
  return (
    <div>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
        {value}
      </p>

      {positive && (
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
          ↑ positive
        </p>
      )}
    </div>
  );
}