import { NavLink } from "react-router-dom";

export default function Layout({ children }) {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Clients", path: "/clients" },
    { name: "Expenses", path: "/expenses" },
    { name: "Invoices", path: "/invoices" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="px-6 py-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">LedgerFlow</h1>
          <p className="text-sm text-slate-400 mt-1">
            Finance Dashboard
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <NavLink
            to="/login"
            className="block w-full text-center px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            Logout
          </NavLink>
        </div>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">LedgerFlow</h2>
              <p className="text-sm text-slate-500">
                Business financial management
              </p>
            </div>

            <span className="text-sm text-slate-600">
              Welcome back
            </span>
          </div>
        </header>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}