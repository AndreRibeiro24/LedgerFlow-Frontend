import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiLogOut,
} from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } =
    useContext(ThemeContext);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

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

  const firstName =
    user?.name?.split(" ")[0] || "User";

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] transition-colors duration-200 dark:bg-[#0B1120] dark:text-[#F8FAFC]">
      {/* ========================================= */}
      {/* Desktop Sidebar                           */}
      {/* ========================================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#E2E8F0] bg-white transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827] lg:flex">
        {/* Brand */}
        <div className="flex h-20 items-center border-b border-[#E2E8F0] px-6 dark:border-[#243044]">
          <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Ledger
          </span>

          <span className="text-xl font-bold tracking-tight text-[#2563EB] dark:text-[#60A5FA]">
            Flow
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#94A3B8] dark:text-[#64748B]">
            Workspace
          </p>

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? `
                      bg-[#EFF6FF]
                      text-[#2563EB]
                      dark:bg-[#172554]/60
                      dark:text-[#60A5FA]
                    `
                    : `
                      text-[#64748B]
                      hover:bg-[#F8FAFC]
                      hover:text-[#0F172A]
                      dark:text-[#94A3B8]
                      dark:hover:bg-[#172033]
                      dark:hover:text-[#F8FAFC]
                    `
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -left-3 h-6 w-0.5 rounded-r-full bg-[#2563EB] dark:bg-[#3B82F6]" />
                  )}

                  {link.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-[#E2E8F0] p-4 dark:border-[#243044]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB] dark:bg-[#1E3A8A]/40 dark:text-[#93C5FD]">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-[#94A3B8] dark:text-[#64748B]">
                {user?.email || "Account"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#64748B] transition hover:bg-[#FEF2F2] hover:text-[#DC2626] dark:text-[#94A3B8] dark:hover:bg-[#450A0A]/30 dark:hover:text-[#FCA5A5]"
          >
            <FiLogOut size={16} />

            Sign out
          </button>
        </div>
      </aside>

      {/* ========================================= */}
      {/* Main                                      */}
      {/* ========================================= */}

      <div className="min-h-screen lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-[#E2E8F0] bg-white/95 px-4 backdrop-blur transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]/95 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                aria-label="Open navigation"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B] lg:hidden"
              >
                <FiMenu size={19} />
              </button>

              {/* Desktop Greeting */}
              <div className="hidden lg:block">
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Welcome back,
                </p>

                <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {firstName}
                </p>
              </div>

              {/* Mobile Branding */}
              <div className="lg:hidden">
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  Ledger
                </span>

                <span className="font-bold text-[#2563EB] dark:text-[#60A5FA]">
                  Flow
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
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
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B] dark:hover:text-[#F8FAFC]"
              >
                {theme === "dark" ? (
                  <FiSun size={18} />
                ) : (
                  <FiMoon size={18} />
                )}
              </button>

              {/* Desktop Account */}
              <div className="hidden items-center gap-3 sm:flex">
                <div className="hidden text-right md:block">
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-[#94A3B8] dark:text-[#64748B]">
                    Account
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB] dark:bg-[#1E3A8A]/40 dark:text-[#93C5FD]">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>

      {/* ========================================= */}
      {/* Mobile Drawer                             */}
      {/* ========================================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-[2px] dark:bg-black/60"
          />

          {/* Drawer */}
          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col border-r border-[#E2E8F0] bg-white shadow-2xl transition-colors duration-200 dark:border-[#243044] dark:bg-[#111827]">
            {/* Header */}
            <div className="flex h-20 items-center justify-between border-b border-[#E2E8F0] px-5 dark:border-[#243044]">
              <div>
                <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                  Ledger
                </span>

                <span className="text-xl font-bold tracking-tight text-[#2563EB] dark:text-[#60A5FA]">
                  Flow
                </span>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:bg-[#172033] dark:hover:text-[#F8FAFC]"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-6">
              <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#94A3B8] dark:text-[#64748B]">
                Workspace
              </p>

              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `relative flex items-center rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? `
                          bg-[#EFF6FF]
                          text-[#2563EB]
                          dark:bg-[#172554]/60
                          dark:text-[#60A5FA]
                        `
                        : `
                          text-[#64748B]
                          hover:bg-[#F8FAFC]
                          hover:text-[#0F172A]
                          dark:text-[#94A3B8]
                          dark:hover:bg-[#172033]
                          dark:hover:text-[#F8FAFC]
                        `
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Mobile User */}
            <div className="border-t border-[#E2E8F0] p-4 dark:border-[#243044]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB] dark:bg-[#1E3A8A]/40 dark:text-[#93C5FD]">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-xs text-[#94A3B8] dark:text-[#64748B]">
                    {user?.email || "Account"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  logout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#64748B] transition hover:bg-[#FEF2F2] hover:text-[#DC2626] dark:text-[#94A3B8] dark:hover:bg-[#450A0A]/30 dark:hover:text-[#FCA5A5]"
              >
                <FiLogOut size={16} />

                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}