import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Clients",
      path: "/clients",
    },
    {
      name: "Invoices",
      path: "/invoices",
    },
    {
      name: "Expenses",
      path: "/expenses",
    },
  ];

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "User";

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">

        {/* Logo */}
        <div className="h-20 flex items-center px-7 border-b border-[#E2E8F0]">
          <NavLink
            to="/dashboard"
            className="text-2xl font-bold tracking-tight"
          >
            Ledger
            <span className="text-[#2563EB]">
              Flow
            </span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-7">

          <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">
            Workspace
          </p>

          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `
                    relative flex items-center rounded-lg px-3 py-2.5
                    text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-[#EFF6FF] text-[#2563EB]"
                        : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 h-5 w-1 rounded-r bg-[#2563EB]" />
                    )}

                    <span className="ml-2">
                      {link.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Sidebar User */}
        <div className="border-t border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB]">
              {userInitials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0F172A]">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-[#94A3B8]">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#64748B] transition hover:bg-[#FEF2F2] hover:text-[#DC2626]"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Application */}
      <div className="lg:pl-64">

        {/* Topbar */}
        <header className="sticky top-0 z-20 h-20 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
          <div className="h-full flex items-center justify-between px-5 sm:px-7 lg:px-10">

            {/* Mobile */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                aria-label="Open navigation"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] transition hover:bg-[#F8FAFC]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </button>

              <NavLink
                to="/dashboard"
                className="text-xl font-bold tracking-tight"
              >
                Ledger
                <span className="text-[#2563EB]">
                  Flow
                </span>
              </NavLink>
            </div>

            {/* Desktop Greeting */}
            <div className="hidden lg:block">
              <p className="text-sm text-[#64748B]">
                Welcome back,
              </p>

              <p className="font-semibold text-[#0F172A]">
                {firstName}
              </p>
            </div>

            {/* User Top Right */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-[#94A3B8]">
                  Account
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB]">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-w-0">
          <div className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">

          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="absolute inset-0 bg-[#0F172A]/30 backdrop-blur-[2px]"
          />

          {/* Mobile Drawer */}
          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-white shadow-xl">

            {/* Mobile Logo */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-[#E2E8F0]">
              <NavLink
                to="/dashboard"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="text-2xl font-bold tracking-tight"
              >
                Ledger
                <span className="text-[#2563EB]">
                  Flow
                </span>
              </NavLink>

              <button
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                aria-label="Close navigation"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-7">
              <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">
                Workspace
              </p>

              <div className="space-y-1">
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className={({ isActive }) =>
                      `
                        flex items-center rounded-lg px-4 py-3
                        text-sm font-medium transition
                        ${
                          isActive
                            ? "bg-[#EFF6FF] text-[#2563EB]"
                            : "text-[#475569] hover:bg-[#F8FAFC]"
                        }
                      `
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Mobile User */}
            <div className="border-t border-[#E2E8F0] p-4">
              <div className="flex items-center gap-3 px-2 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB]">
                  {userInitials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-xs text-[#94A3B8]">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-2 w-full rounded-lg bg-[#FEF2F2] px-4 py-3 text-left text-sm font-semibold text-[#DC2626]"
              >
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}