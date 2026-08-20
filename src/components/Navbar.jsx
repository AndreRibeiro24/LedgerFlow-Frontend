import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/clients">Clients</Link>
        </li>

        <li>
          <Link to="/expenses">Expenses</Link>
        </li>

        <li>
          <Link to="/invoices">Invoices</Link>
        </li>

        <li>
          <Link to="/login">Logout</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;