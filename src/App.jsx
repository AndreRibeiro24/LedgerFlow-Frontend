import {Routes, Route} from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients"
import Expenses from  "./pages/Expenses"
import Invoices from "./pages/Invoices"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/clients" element={<Clients/>}/>
      <Route path="/expenses" element={<Expenses/>}/>
      <Route path="/Invoices" element={<Invoices/>}/>
    </Routes>
  );
}

export default App;
