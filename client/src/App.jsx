// this is the main router. 

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./features/auth/Login.jsx";
import Register from "./features/auth/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ChefDashboard from "./pages/ChefDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Test from "./pages/test.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<Test />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chef" element={<ChefDashboard />} />
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute> } />
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


