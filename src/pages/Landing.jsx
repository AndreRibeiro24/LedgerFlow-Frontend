import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-[#0F172A]"
          >
            Ledger<span className="text-[#2563EB]">Flow</span>
          </Link>

          <nav className="flex items-center gap-5">
            <Link
              to="/login"
              className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />

                <span className="text-xs font-semibold text-[#2563EB]">
                  Business finance management
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-[#0F172A]">
                Your finances.
                <br />

                <span className="text-[#2563EB]">
                  One clear view.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[#475569]">
                Manage clients, invoices and expenses from one simple
                workspace and understand how your business is performing.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#1D4ED8] transition"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="rounded-lg border border-[#CBD5E1] bg-white px-6 py-3 font-semibold text-[#0F172A] hover:border-[#94A3B8] hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="hidden lg:block">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-[#64748B]">
                      Financial overview
                    </p>

                    <p className="text-xl font-semibold mt-1">
                      This month
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#2563EB] rounded-full" />
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
                  <div className="flex items-end gap-3 h-40">
                    {[40, 64, 50, 85, 68, 100, 82, 115, 94, 130, 112, 145].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t bg-blue-100 relative"
                          style={{ height }}
                        >
                          <div
                            className="absolute bottom-0 left-0 right-0 rounded-t bg-[#2563EB]"
                            style={{
                              height: `${Math.max(height * 0.65, 15)}px`,
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="max-w-2xl mb-14">
              <p className="text-sm font-semibold text-[#2563EB] mb-3">
                Everything in one place
              </p>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Built to keep your finances organized.
              </h2>

              <p className="mt-4 text-[#64748B] leading-7">
                Less time moving between spreadsheets and more time
                understanding your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-[#E2E8F0]">
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
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="rounded-2xl bg-[#0F172A] px-8 py-12 md:px-12 md:py-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-blue-300 text-sm font-semibold mb-3">
                Get started today
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Take control of your business finances.
              </h2>

              <p className="text-slate-400 mt-3 max-w-xl">
                Your clients, invoices and expenses — organized in one
                workspace.
              </p>
            </div>

            <Link
              to="/register"
              className="self-start lg:self-auto whitespace-nowrap rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#1D4ED8] transition"
            >
              Create an account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="font-semibold">
            Ledger<span className="text-[#2563EB]">Flow</span>
          </p>

          <p className="text-sm text-[#94A3B8]">
            Simple financial management for your business.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ number, title, text }) {
  return (
    <div className="py-8 lg:px-7 lg:first:pl-0 border-b lg:border-b-0 lg:border-r last:border-r-0 border-[#E2E8F0]">
      <p className="text-xs font-bold text-[#2563EB] mb-8">
        {number}
      </p>

      <h3 className="text-lg font-semibold text-[#0F172A] mb-3">
        {title}
      </h3>

      <p className="text-sm leading-6 text-[#64748B]">
        {text}
      </p>
    </div>
  );
}

function PreviewMetric({ label, value, positive }) {
  return (
    <div>
      <p className="text-xs text-[#64748B]">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-[#0F172A]">
        {value}
      </p>

      {positive && (
        <p className="mt-1 text-xs text-emerald-600">
          ↑ positive
        </p>
      )}
    </div>
  );
}