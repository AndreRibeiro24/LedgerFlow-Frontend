import {Routes, Route} from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients"
import Expenses from  "./pages/Expenses"
import Invoices from "./pages/Invoices"
import ClientsDetails from "./pages/ClientDetails"
import ProtectedRoute from "./routes/ProtectedRoutes";
import ExpenseDetails from "./pages/ExpensesDetails";
import InvoicesDetails from "./pages/InvoicesDetails";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard" element={
        <ProtectedRoute>
        <Dashboard/>
        </ProtectedRoute>}/>
      <Route path="/clients" element={
        <ProtectedRoute>
        <Clients/>
        </ProtectedRoute>}/>
      <Route path="/expenses" element={
        <ProtectedRoute>
        <Expenses/>
        </ProtectedRoute>}/>
      <Route path="/invoices" element={
        <ProtectedRoute>
        <Invoices/>
        </ProtectedRoute>
        }/>
      <Route path="/clients/:id" element={
        <ProtectedRoute>
        <ClientsDetails/>
        </ProtectedRoute>
    }
    />
      <Route path="/expenses/:id" element={
      <ProtectedRoute>
        <ExpenseDetails />
      </ProtectedRoute>
    }
  />
    <Route path="/invoices/:id" element={
      <ProtectedRoute>
        <InvoicesDetails/>
      </ProtectedRoute>
      
    }/>
    </Routes>

  );
}

export default App;


