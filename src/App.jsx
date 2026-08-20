import {Routes, Route} from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients"
import Expenses from  "./pages/Expenses"
import Invoices from "./pages/Invoices"

import ProtectedRoute from "./routes/ProtectedRoutes";

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
      <Route path="/Invoices" element={
        <ProtectedRoute>
        <Invoices/>
        </ProtectedRoute>
        }/>
    </Routes>
  );
}

export default App;
